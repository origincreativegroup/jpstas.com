import { useState, useRef, useCallback } from 'react';
import { api, handleApiError } from '@/services/apiClient';
import { useToast } from '@/context/ToastContext';
import { debug } from '@/utils/debug';
import { validateFile } from '@/config/environment';

interface UploadedFile {
  id: string;
  name: string;
  filename: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
}

interface FileUploadProps {
  onUpload: (file: UploadedFile) => void;
  onRemove?: (fileId: string) => void;
  onBatchUpload?: (files: UploadedFile[]) => void;
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
  showProgress?: boolean;
  autoUpload?: boolean;
}

export default function FileUpload({
  onUpload,
  onRemove: _onRemove,
  onBatchUpload,
  accept = 'image/*,video/*',
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = false,
  maxFiles = 10,
  className = '',
  showProgress = true,
  autoUpload = true,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadQueue, setUploadQueue] = useState<File[]>([]);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const uploadFile = useCallback(
    async (file: File) => {
      debug.upload.start('Starting file upload', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified).toISOString(),
      });
      debug.perf.start(`upload:${file.name}`);

      setUploading(true);
      setUploadProgress(0);

      try {
        // Validate file before upload
        const validation = validateFile(file);
        if (!validation.valid) {
          throw new Error(validation.error);
        }

        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const newProgress = Math.min(prev + 10, 90);
            debug.upload.progress('Upload progress', {
              file: file.name,
              progress: newProgress,
            });
            return newProgress;
          });
        }, 100);

        // Use unified API client
        const mediaFile = await api.uploadFile(file);

        clearInterval(progressInterval);
        setUploadProgress(100);

        // Convert MediaFile to UploadedFile
        const uploadedFile: UploadedFile = {
          id: mediaFile.id,
          name: mediaFile.name,
          filename: mediaFile.filename,
          url: mediaFile.url,
          size: mediaFile.size,
          type: mediaFile.type,
          uploadedAt: mediaFile.uploadedAt || mediaFile.createdAt,
        };

        debug.upload.complete('File uploaded successfully', {
          fileName: file.name,
          fileId: uploadedFile.id,
          url: uploadedFile.url,
        });

        onUpload(uploadedFile);
        toast.success(`Uploaded ${file.name}`);
        debug.perf.end(`upload:${file.name}`);
        
        return uploadedFile;
      } catch (error) {
        debug.upload.error('File upload failed', error as Error, {
          fileName: file.name,
          fileSize: file.size,
        });
        debug.perf.end(`upload:${file.name}`);
        
        const errorMessage = handleApiError(error);
        toast.error(`Upload failed: ${errorMessage}`);
        throw error;
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    },
    [onUpload, toast]
  );

  const handleFiles = useCallback(
    async (files: File[]) => {
      debug.file.validate('Validating files', {
        fileCount: files.length,
        multiple: multiple,
        maxSize: maxSize,
        accept: accept,
        maxFiles: maxFiles,
      });

      // Validate file count
      if (!multiple && files.length > 1) {
        debug.file.error(
          'Multiple files selected but only single file allowed',
          new Error('Multiple files not allowed'),
          { fileCount: files.length }
        );
        toast.warning('Please select only one file');
        return;
      }

      if (files.length > maxFiles) {
        debug.file.error(
          'Too many files selected',
          new Error('File limit exceeded'),
          { fileCount: files.length, maxFiles }
        );
        toast.error(`Maximum ${maxFiles} files allowed`);
        return;
      }

      // Validate files using environment config
      const validFiles: File[] = [];
      const errors: string[] = [];

      for (const file of files) {
        const validation = validateFile(file);
        if (!validation.valid) {
          const error = `File ${file.name}: ${validation.error}`;
          errors.push(error);
          debug.file.error(
            'File validation failed',
            new Error(validation.error!),
            {
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type,
            }
          );
          continue;
        }

        validFiles.push(file);
        debug.file.validate('File passed validation', {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
        });
      }

      if (errors.length > 0) {
        setUploadErrors(errors);
        errors.forEach(error => toast.error(error));
      }

      if (validFiles.length === 0) {
        return;
      }

      debug.info('Processing files for upload', {
        totalFiles: validFiles.length,
        files: validFiles.map(f => ({
          name: f.name,
          size: f.size,
          type: f.type,
        })),
      });

      if (autoUpload) {
        // Upload files immediately
        for (const file of validFiles) {
          await uploadFile(file);
        }
      } else {
        // Add to queue for manual upload
        setUploadQueue(prev => [...prev, ...validFiles]);
        toast.info(`${validFiles.length} file(s) added to upload queue`);
      }
    },
    [multiple, maxSize, maxFiles, uploadFile, toast, accept, autoUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFiles(files);
      }
    },
    [handleFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        handleFiles(files);
      }
    },
    [handleFiles]
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleBatchUpload = useCallback(async () => {
    if (uploadQueue.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadErrors([]);

    const uploadedFiles: UploadedFile[] = [];
    const errors: string[] = [];

    for (let i = 0; i < uploadQueue.length; i++) {
      const file = uploadQueue[i];
      if (!file) continue;
      
      try {
        const result = await uploadFile(file);
        uploadedFiles.push(result);
        setUploadProgress(((i + 1) / uploadQueue.length) * 100);
      } catch (error) {
        const errorMsg = `Failed to upload ${file.name}: ${(error as Error).message}`;
        errors.push(errorMsg);
        console.error('Upload error:', error);
      }
    }

    if (uploadedFiles.length > 0) {
      if (onBatchUpload) {
        onBatchUpload(uploadedFiles);
      } else {
        uploadedFiles.forEach(file => onUpload(file));
      }
      toast.success(`Successfully uploaded ${uploadedFiles.length} file(s)`);
    }

    if (errors.length > 0) {
      setUploadErrors(errors);
      errors.forEach(error => toast.error(error));
    }

    setUploadQueue([]);
    setUploading(false);
    setUploadProgress(0);
  }, [uploadQueue, uploadFile, onUpload, onBatchUpload, toast]);

  const removeFromQueue = useCallback((index: number) => {
    setUploadQueue(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearQueue = useCallback(() => {
    setUploadQueue([]);
    setUploadErrors([]);
  }, []);

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging ? 'border-brand bg-brand/5' : 'border-neutral-300 hover:border-brand/50'
        } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
        />

        {uploading ? (
          <div className="space-y-4">
            <div className="w-12 h-12 mx-auto">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-700">Uploading...</p>
              {showProgress && (
                <div className="w-full bg-neutral-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-brand h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-12 h-12 mx-auto text-neutral-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium text-neutral-700">
                {isDragging ? 'Drop files here' : 'Upload files'}
              </p>
              <p className="text-sm text-neutral-500 mt-1">
                Drag and drop files here, or click to select
              </p>
              <p className="text-xs text-neutral-400 mt-2">
                Max size: {formatFileSize(maxSize)} • {multiple ? `Max ${maxFiles} files` : 'Single file'} • Images and videos supported
              </p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Choose Files
            </button>
          </div>
        )}
      </div>

      {/* Upload Queue */}
      {!autoUpload && uploadQueue.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-neutral-700">
              Upload Queue ({uploadQueue.length} files)
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleBatchUpload}
                disabled={uploading}
                className="px-3 py-1 text-sm bg-brand text-white rounded hover:bg-purple-700 disabled:opacity-50"
              >
                Upload All
              </button>
              <button
                onClick={clearQueue}
                className="px-3 py-1 text-sm border border-neutral-300 rounded hover:bg-neutral-100"
              >
                Clear Queue
              </button>
            </div>
          </div>
          
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {uploadQueue.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-neutral-50 rounded border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-neutral-200 rounded flex items-center justify-center">
                    {file.type.startsWith('image/') ? (
                      <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-700 truncate max-w-xs">{file.name}</p>
                    <p className="text-xs text-neutral-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFromQueue(index)}
                  className="p-1 text-neutral-400 hover:text-red-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Errors */}
      {uploadErrors.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <h4 className="text-sm font-medium text-red-800 mb-2">Upload Errors:</h4>
          <ul className="text-xs text-red-700 space-y-1">
            {uploadErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

interface MediaPreviewProps {
  file: UploadedFile;
  onRemove?: (fileId: string) => void;
  className?: string;
}

export function MediaPreview({ file, onRemove, className = '' }: MediaPreviewProps) {
  const isImageFile = isImage(file.type);
  const isVideoFile = isVideo(file.type);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`relative group ${className}`}>
      <div className="aspect-video bg-neutral-100 rounded-lg overflow-hidden">
        {isImageFile ? (
          <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
        ) : isVideoFile ? (
          <video
            src={file.url}
            className="w-full h-full object-cover"
            controls
            preload="metadata"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto text-neutral-400 mb-2">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-xs text-neutral-500">{file.name}</p>
            </div>
          </div>
        )}
      </div>

      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 space-y-2">
          <button
            onClick={() => window.open(file.url, '_blank')}
            className="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-colors"
          >
            <svg
              className="w-4 h-4 text-neutral-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </button>
          {onRemove && (
            <button
              onClick={() => onRemove(file.id)}
              className="w-8 h-8 bg-red-500 bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-colors"
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="mt-2">
        <p className="text-sm font-medium text-neutral-700 truncate">{file.name}</p>
        <p className="text-xs text-neutral-500">{formatFileSize(file.size)}</p>
      </div>
    </div>
  );
}

function isImage(type: string) {
  return type.startsWith('image/');
}

function isVideo(type: string) {
  return type.startsWith('video/');
}
