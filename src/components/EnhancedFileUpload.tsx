import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import { useMedia } from '@/context/MediaContext';
import { debug } from '@/utils/debug';

interface UploadedFile {
  id: string;
  name: string;
  filename: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
  progress?: number;
  status?: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

interface UploadQueueItem {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  retryCount: number;
}

interface EnhancedFileUploadProps {
  onUpload: (file: UploadedFile) => void;
  onBatchUpload?: (files: UploadedFile[]) => void;
  onRemove?: (fileId: string) => void;
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
  showProgress?: boolean;
  autoUpload?: boolean;
  dragAndDrop?: boolean;
  showPreview?: boolean;
  allowRetry?: boolean;
  maxRetries?: number;
}

export default function EnhancedFileUpload({
  onUpload,
  onRemove: _onRemove,
  accept = 'image/*,video/*',
  maxSize = 100 * 1024 * 1024, // 100MB (increased for Cloudflare Stream)
  multiple = false,
  maxFiles = 10,
  className = '',
  showProgress = true,
  autoUpload = true,
  dragAndDrop = true,
  allowRetry = true,
  maxRetries = 3,
}: EnhancedFileUploadProps) {
  const { showToast } = useToast();
  const { uploadFile: uploadToGlobalMedia } = useMedia();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStats, setUploadStats] = useState({
    total: 0,
    completed: 0,
    failed: 0,
    inProgress: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update upload stats
  useEffect(() => {
    const stats = uploadQueue.reduce(
      (acc, item) => {
        acc.total++;
        if (item.status === 'completed') acc.completed++;
        else if (item.status === 'error') acc.failed++;
        else if (item.status === 'uploading') acc.inProgress++;
        return acc;
      },
      { total: 0, completed: 0, failed: 0, inProgress: 0 }
    );
    setUploadStats(stats);
  }, [uploadQueue]);

  const uploadFile = useCallback(
    async (queueItem: UploadQueueItem): Promise<UploadedFile> => {
      debug.upload.start('Starting file upload', {
        name: queueItem.file.name,
        size: queueItem.file.size,
        type: queueItem.file.type,
      });
      debug.perf.start(`upload:${queueItem.file.name}`);

      // Update status to uploading
      setUploadQueue(prev => prev.map(item =>
        item.id === queueItem.id ? { ...item, status: 'uploading', progress: 0 } : item
      ));

      try {
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setUploadQueue(prev => prev.map(item => {
            if (item.id === queueItem.id && item.status === 'uploading') {
              const newProgress = Math.min(item.progress + Math.random() * 20, 90);
              return { ...item, progress: newProgress };
            }
            return item;
          }));
        }, 200);

        let result;
        if (import.meta.env.DEV) {
          debug.info('Using global media context for upload (dev mode)', { file: queueItem.file.name });
          // Use global media context for upload
          const mediaFile = await uploadToGlobalMedia(queueItem.file);
          result = {
            success: true,
            file: {
              id: mediaFile.id,
              name: mediaFile.name,
              filename: mediaFile.filename,
              url: mediaFile.url,
              size: mediaFile.size,
              type: mediaFile.type,
              uploadedAt: mediaFile.uploadedAt || mediaFile.createdAt,
            }
          };
        } else {
          // Use global media context for production upload
          const mediaFile = await uploadToGlobalMedia(queueItem.file);
          result = {
            success: true,
            file: {
              id: mediaFile.id,
              name: mediaFile.name,
              filename: mediaFile.filename,
              url: mediaFile.url,
              size: mediaFile.size,
              type: mediaFile.type,
              uploadedAt: mediaFile.uploadedAt || mediaFile.createdAt,
            }
          };
        }

        clearInterval(progressInterval);

        // Update to completed
        setUploadQueue(prev => prev.map(item =>
          item.id === queueItem.id ? { ...item, status: 'completed', progress: 100 } : item
        ));

        debug.upload.complete('File uploaded successfully', {
          fileName: queueItem.file.name,
          fileId: result.file?.id,
          url: result.file?.url,
        });

        const uploadedFile: UploadedFile = {
          ...result.file,
          progress: 100,
          status: 'completed',
        };

        onUpload(uploadedFile);
        showToast(`Uploaded ${queueItem.file.name}`, 'success');
        debug.perf.end(`upload:${queueItem.file.name}`);
        return uploadedFile;
      } catch (error) {
        debug.upload.error('File upload failed', error as Error, {
          fileName: queueItem.file.name,
          fileSize: queueItem.file.size,
          retryCount: queueItem.retryCount,
        });

        // Update to error status
        setUploadQueue(prev => prev.map(item =>
          item.id === queueItem.id ? {
            ...item,
            status: 'error',
            error: (error as Error).message,
          } : item
        ));

        showToast(`Upload failed: ${(error as Error).message}`, 'error');
        debug.perf.end(`upload:${queueItem.file.name}`);
        throw error;
      }
    },
    [onUpload, showToast]
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
        showToast('Please select only one file', 'warning');
        return;
      }

      if (files.length > maxFiles) {
        showToast(`Maximum ${maxFiles} files allowed`, 'error');
        return;
      }

      // Validate files
      const validFiles: File[] = [];
      const errors: string[] = [];

      for (const file of files) {
        if (file.size > maxSize) {
          const error = `File ${file.name} is too large. Maximum size is ${formatFileSize(maxSize)}`;
          errors.push(error);
          continue;
        }

        // Check file type
        if (accept !== '*/*') {
          const acceptedTypes = accept.split(',').map(type => type.trim());
          const fileType = file.type;
          const isAccepted = acceptedTypes.some(acceptedType => {
            if (acceptedType.endsWith('/*')) {
              return fileType.startsWith(acceptedType.slice(0, -1));
            }
            return fileType === acceptedType;
          });

          if (!isAccepted) {
            const error = `File ${file.name} is not an accepted type. Accepted: ${accept}`;
            errors.push(error);
            continue;
          }
        }

        validFiles.push(file);
      }

      if (errors.length > 0) {
        errors.forEach(error => showToast(error, 'error'));
      }

      if (validFiles.length === 0) {
        return;
      }

      // Add files to queue
      const newQueueItems: UploadQueueItem[] = validFiles.map(file => ({
        file,
        id: `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        progress: 0,
        status: 'pending' as const,
        retryCount: 0,
      }));

      setUploadQueue(prev => [...prev, ...newQueueItems]);

      if (autoUpload) {
        // Upload files immediately
        setUploading(true);
        for (const item of newQueueItems) {
          try {
            await uploadFile(item);
          } catch (error) {
            console.error('Upload error:', error);
          }
        }
        setUploading(false);
      } else {
        showToast(`${validFiles.length} file(s) added to upload queue`, 'info');
      }
    },
    [multiple, maxSize, maxFiles, uploadFile, showToast, accept, autoUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (dragAndDrop) {
      setIsDragging(true);
    }
  }, [dragAndDrop]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (dragAndDrop) {
      setIsDragging(false);
    }
  }, [dragAndDrop]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (dragAndDrop) {
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
          handleFiles(files);
        }
      }
    },
    [handleFiles, dragAndDrop]
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

  const retryUpload = useCallback(async (queueItem: UploadQueueItem) => {
    if (queueItem.retryCount >= maxRetries) {
      showToast('Maximum retry attempts reached', 'error');
      return;
    }

    const updatedItem = {
      ...queueItem,
      retryCount: queueItem.retryCount + 1,
      status: 'pending' as const,
      error: undefined,
    };

    setUploadQueue(prev => prev.map(item =>
      item.id === queueItem.id ? updatedItem : item
    ));

    try {
      await uploadFile(updatedItem);
    } catch (error) {
      console.error('Retry upload error:', error);
    }
  }, [uploadFile, maxRetries, showToast]);

  const removeFromQueue = useCallback((id: string) => {
    setUploadQueue(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearQueue = useCallback(() => {
    setUploadQueue([]);
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'error':
        return '❌';
      case 'uploading':
        return '⏳';
      default:
        return '⏸️';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'uploading':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Upload Area */}
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
              <p className="text-sm font-medium text-neutral-700">Uploading files...</p>
              <p className="text-xs text-neutral-500 mt-1">
                {uploadStats.completed} of {uploadStats.total} completed
              </p>
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
                {dragAndDrop ? 'Drag and drop files here, or click to select' : 'Click to select files'}
              </p>
              <p className="text-xs text-neutral-400 mt-2">
                Max size: {formatFileSize(maxSize)} • {multiple ? `Max ${maxFiles} files` : 'Single file'} • {accept}
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
      {uploadQueue.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-neutral-700">
              Upload Queue ({uploadQueue.length} files)
            </h3>
            <div className="flex gap-2">
              {!autoUpload && (
                <button
                  onClick={() => {
                    setUploading(true);
                    uploadQueue.forEach(item => {
                      if (item.status === 'pending') {
                        uploadFile(item);
                      }
                    });
                    setUploading(false);
                  }}
                  disabled={uploading}
                  className="px-3 py-1 text-sm bg-brand text-white rounded hover:bg-purple-700 disabled:opacity-50"
                >
                  Upload All
                </button>
              )}
              <button
                onClick={clearQueue}
                className="px-3 py-1 text-sm border border-neutral-300 rounded hover:bg-neutral-100"
              >
                Clear Queue
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          {showProgress && uploadStats.total > 0 && (
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div
                className="bg-brand h-2 rounded-full transition-all duration-300"
                style={{ width: `${(uploadStats.completed / uploadStats.total) * 100}%` }}
              ></div>
            </div>
          )}

          {/* Queue Items */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {uploadQueue.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded border">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 h-8 bg-neutral-200 rounded flex items-center justify-center">
                    {item.file.type.startsWith('image/') ? (
                      <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-700 truncate">{item.file.name}</p>
                    <p className="text-xs text-neutral-500">{formatFileSize(item.file.size)}</p>
                    {item.error && (
                      <p className="text-xs text-red-600 mt-1">{item.error}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                    </span>
                    {showProgress && item.status === 'uploading' && (
                      <div className="w-16 bg-neutral-200 rounded-full h-1">
                        <div
                          className="bg-brand h-1 rounded-full transition-all duration-300"
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.status === 'error' && allowRetry && item.retryCount < maxRetries && (
                    <button
                      onClick={() => retryUpload(item)}
                      className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Retry ({maxRetries - item.retryCount} left)
                    </button>
                  )}
                  <button
                    onClick={() => removeFromQueue(item.id)}
                    className="p-1 text-neutral-400 hover:text-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
