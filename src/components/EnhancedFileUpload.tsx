import React, { useState, useRef, useCallback } from 'react';
import { useMedia } from '@/context/MediaContext';
import { useToast } from '@/context/ToastContext';
import { debug } from '@/utils/debug';
import { validateFile } from '@/config/environment';
import { cloudflareStream } from '@/services/cloudflareStream';

interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  isVideo?: boolean;
  streamId?: string;
}

interface EnhancedFileUploadProps {
  onUpload?: (files: any[]) => void;
  onUploadComplete?: () => void;
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
  showProgress?: boolean;
  autoUpload?: boolean;
  enableVideoStream?: boolean;
}

export default function EnhancedFileUpload({
  onUpload,
  onUploadComplete,
  accept = 'image/*,video/*',
  maxSize = 100 * 1024 * 1024, // 100MB for videos
  multiple = true,
  maxFiles = 10,
  className = '',
  showProgress = true,
  autoUpload = true,
  enableVideoStream = true,
}: EnhancedFileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Map<string, UploadProgress>>(new Map());
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, uploadVideo, uploadImage } = useMedia();
  const toast = useToast();

  const updateProgress = useCallback((fileId: string, progress: Partial<UploadProgress>) => {
    setUploadProgress(prev => {
      const newMap = new Map(prev);
      const current = newMap.get(fileId) || {
        fileId,
        fileName: '',
        progress: 0,
        status: 'uploading' as const,
      };
      newMap.set(fileId, { ...current, ...progress });
      return newMap;
    });
  }, []);

  const uploadFileWithProgress = useCallback(
    async (file: File) => {
      const fileId = `${file.name}-${Date.now()}`;
      
      debug.upload.start('Starting enhanced file upload', {
        name: file.name,
        size: file.size,
        type: file.type,
        isVideo: file.type.startsWith('video/'),
      });

      // Initialize progress
      updateProgress(fileId, {
        fileName: file.name,
        progress: 0,
        status: 'uploading',
        isVideo: file.type.startsWith('video/'),
      });

      try {
        // Validate file
        const validation = validateFile(file);
        if (!validation.valid) {
          throw new Error(validation.error);
        }

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          updateProgress(fileId, {
            progress: Math.min(Math.random() * 90, 90),
          });
        }, 200);

        let mediaFile;

        // Determine upload method
        if (file.type.startsWith('video/') && enableVideoStream && cloudflareStream.shouldUseStream(file)) {
          debug.upload.start('Using Cloudflare Stream for video upload', {
            fileName: file.name,
            fileSize: file.size,
          });

          updateProgress(fileId, { status: 'processing' });
          mediaFile = await uploadVideo(file);
          
          // Get stream ID for progress tracking
          const streamId = mediaFile.cloudflare?.streamId;
          if (streamId) {
            updateProgress(fileId, { streamId });
          }
        } else if (file.type.startsWith('image/')) {
          debug.upload.start('Using standard image upload', {
            fileName: file.name,
            fileSize: file.size,
          });
          mediaFile = await uploadImage(file);
        } else {
          debug.upload.start('Using standard file upload', {
            fileName: file.name,
            fileSize: file.size,
          });
          mediaFile = await uploadFile(file);
        }

        clearInterval(progressInterval);
        updateProgress(fileId, {
          progress: 100,
          status: 'completed',
        });

        debug.upload.complete('File uploaded successfully', {
          fileName: file.name,
          fileId: mediaFile.id,
          url: mediaFile.url,
          isVideo: file.type.startsWith('video/'),
        });

        toast.success(`${file.name} uploaded successfully`);
        return mediaFile;
      } catch (error) {
        debug.upload.error('File upload failed', error as Error, {
          fileName: file.name,
          fileSize: file.size,
        });

        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        updateProgress(fileId, {
          status: 'error',
          error: errorMessage,
        });

        toast.error(`Upload failed: ${errorMessage}`);
        throw error;
      }
    },
    [updateProgress, uploadFile, uploadVideo, uploadImage, toast, enableVideoStream]
  );

  const handleFiles = useCallback(
    async (files: File[]) => {
      debug.file.validate('Validating files for enhanced upload', {
        fileCount: files.length,
        multiple,
        maxSize,
        accept,
        maxFiles,
      });

      // Validate file count
      if (!multiple && files.length > 1) {
        toast.warning('Please select only one file');
        return;
      }

      if (files.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} files allowed`);
        return;
      }

      // Validate files
      const validFiles: File[] = [];
      const errors: string[] = [];

      for (const file of files) {
        const validation = validateFile(file);
        if (!validation.valid) {
          const error = `File ${file.name}: ${validation.error}`;
          errors.push(error);
          continue;
        }

        // Check file size
        if (file.size > maxSize) {
          const error = `File ${file.name}: Size exceeds maximum allowed size of ${Math.round(maxSize / (1024 * 1024))}MB`;
          errors.push(error);
          continue;
        }

        validFiles.push(file);
      }

      if (errors.length > 0) {
        setUploadErrors(errors);
        errors.forEach(error => toast.error(error));
      }

      if (validFiles.length === 0) {
        return;
      }

      if (autoUpload) {
        // Upload files immediately
        const uploadedFiles = [];
        for (const file of validFiles) {
          try {
            const result = await uploadFileWithProgress(file);
            uploadedFiles.push(result);
          } catch (error) {
            console.error('Upload error:', error);
          }
        }

        if (uploadedFiles.length > 0) {
          onUpload?.(uploadedFiles);
          onUploadComplete?.();
        }
      } else {
        // Add to queue for manual upload
        setUploadQueue(prev => [...prev, ...validFiles]);
        toast.info(`${validFiles.length} file(s) added to upload queue`);
      }
    },
    [multiple, maxSize, maxFiles, uploadFileWithProgress, toast, accept, autoUpload, onUpload, onUploadComplete]
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

  const handleBatchUpload = useCallback(async () => {
    if (uploadQueue.length === 0) return;

    const uploadedFiles = [];
    for (const file of uploadQueue) {
      try {
        const result = await uploadFileWithProgress(file);
        uploadedFiles.push(result);
      } catch (error) {
        console.error('Upload error:', error);
      }
    }

    if (uploadedFiles.length > 0) {
      onUpload?.(uploadedFiles);
      onUploadComplete?.();
    }

    setUploadQueue([]);
  }, [uploadQueue, uploadFileWithProgress, onUpload, onUploadComplete]);

  const removeFromQueue = useCallback((index: number) => {
    setUploadQueue(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearQueue = useCallback(() => {
    setUploadQueue([]);
    setUploadErrors([]);
  }, []);

  const clearProgress = useCallback(() => {
    setUploadProgress(new Map());
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: UploadProgress['status']) => {
    switch (status) {
      case 'uploading':
        return '⏳';
      case 'processing':
        return '🔄';
      case 'completed':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '📁';
    }
  };

  const getStatusColor = (status: UploadProgress['status']) => {
    switch (status) {
      case 'uploading':
        return 'text-blue-600';
      case 'processing':
        return 'text-yellow-600';
      case 'completed':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const isUploading = Array.from(uploadProgress.values()).some(p => p.status === 'uploading' || p.status === 'processing');
  const hasCompleted = Array.from(uploadProgress.values()).some(p => p.status === 'completed');

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging ? 'border-brand bg-brand/5' : 'border-neutral-300 hover:border-brand/50'
        } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
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
              Max size: {formatFileSize(maxSize)} •{' '}
              {multiple ? `Max ${maxFiles} files` : 'Single file'} • Images and videos supported
              {enableVideoStream && ' • Videos will use Cloudflare Stream'}
            </p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Choose Files
          </button>
        </div>
      </div>

      {/* Upload Progress */}
      {showProgress && uploadProgress.size > 0 && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-neutral-700">Upload Progress</h3>
            <div className="flex gap-2">
              {hasCompleted && (
                <button
                  onClick={clearProgress}
                  className="px-3 py-1 text-sm border border-neutral-300 rounded hover:bg-neutral-100"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {Array.from(uploadProgress.values()).map(progress => (
              <div
                key={progress.fileId}
                className="flex items-center gap-3 p-3 bg-neutral-50 rounded border"
              >
                <div className="text-lg">{getStatusIcon(progress.status)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-neutral-700 truncate">
                      {progress.fileName}
                    </p>
                    <span className={`text-xs font-medium ${getStatusColor(progress.status)}`}>
                      {progress.status}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        progress.status === 'error' ? 'bg-red-500' : 'bg-brand'
                      }`}
                      style={{ width: `${progress.progress}%` }}
                    />
                  </div>
                  {progress.error && (
                    <p className="text-xs text-red-600 mt-1">{progress.error}</p>
                  )}
                  {progress.isVideo && progress.streamId && (
                    <p className="text-xs text-blue-600 mt-1">
                      Stream ID: {progress.streamId}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                disabled={isUploading}
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
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-neutral-50 rounded border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-neutral-200 rounded flex items-center justify-center">
                    {file.type.startsWith('image/') ? (
                      <svg
                        className="w-4 h-4 text-neutral-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 text-neutral-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-700 truncate max-w-xs">
                      {file.name}
                    </p>
                    <p className="text-xs text-neutral-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFromQueue(index)}
                  className="p-1 text-neutral-400 hover:text-red-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
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