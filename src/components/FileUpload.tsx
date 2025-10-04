import { useState, useRef, useCallback } from 'react';
import { mockApi } from '../utils/mockApi';

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
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  className?: string;
}

export default function FileUpload({
  onUpload,
  onRemove: _onRemove,
  accept = 'image/*,video/*',
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = false,
  className = '',
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFiles(files);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFiles(files);
    }
  }, []);

  const handleFiles = async (files: File[]) => {
    if (!multiple && files.length > 1) {
      alert('Please select only one file');
      return;
    }

    for (const file of files) {
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is ${formatFileSize(maxSize)}`);
        continue;
      }

      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      let result;
      if (import.meta.env.DEV) {
        // Use mock API in development
        result = await mockApi.uploadFile(file);
      } else {
        // Use real API in production
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Upload failed');
        }

        result = await response.json();
      }

      clearInterval(progressInterval);
      setUploadProgress(100);

      onUpload(result.file);
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${(error as Error).message}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };


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
              <div className="w-full bg-neutral-200 rounded-full h-2 mt-2">
                <div
                  className="bg-brand h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
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
                Max size: {formatFileSize(maxSize)} • Images and videos supported
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
