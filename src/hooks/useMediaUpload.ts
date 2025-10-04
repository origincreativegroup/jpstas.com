import { useState, useCallback, useRef } from 'react';
import { mockApi } from '@/utils/mockApi';

export interface UploadQueueItem {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  progress: number;
  error?: string;
  result?: any;
  retryCount: number;
}

interface UseMediaUploadOptions {
  maxConcurrent?: number;
  maxRetries?: number;
  onUploadComplete?: (file: any) => void;
  onUploadError?: (file: File, error: Error) => void;
  onQueueComplete?: () => void;
}

export function useMediaUpload(options: UseMediaUploadOptions = {}) {
  const {
    maxConcurrent = 3,
    maxRetries = 2,
    onUploadComplete,
    onUploadError,
    onQueueComplete,
  } = options;

  const [queue, setQueue] = useState<UploadQueueItem[]>([]);
  const [activeUploads, setActiveUploads] = useState(0);
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

  const uploadFile = useCallback(
    async (item: UploadQueueItem): Promise<void> => {
      const controller = new AbortController();
      abortControllersRef.current.set(item.id, controller);

      try {
        setQueue(prev =>
          prev.map(q => (q.id === item.id ? { ...q, status: 'uploading' as const } : q))
        );

        let result: { file?: any };
        if (import.meta.env.DEV) {
          // Mock upload with progress simulation
          result = await mockApi.uploadFile(item.file);

          // Simulate progress
          for (let i = 0; i <= 100; i += 10) {
            if (controller.signal.aborted) throw new Error('Upload cancelled');
            setQueue(prev =>
              prev.map(q => (q.id === item.id ? { ...q, progress: i } : q))
            );
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } else {
          // Real upload with progress tracking
          const formData = new FormData();
          formData.append('file', item.file);

          const xhr = new XMLHttpRequest();

          // Progress tracking
          xhr.upload.addEventListener('progress', e => {
            if (e.lengthComputable) {
              const progress = Math.round((e.loaded / e.total) * 100);
              setQueue(prev =>
                prev.map(q => (q.id === item.id ? { ...q, progress } : q))
              );
            }
          });

          // Upload promise
          result = await new Promise((resolve, reject) => {
            xhr.addEventListener('load', () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                try {
                  const response = JSON.parse(xhr.responseText);
                  resolve(response);
                } catch (e) {
                  reject(new Error('Invalid response'));
                }
              } else {
                reject(new Error(`Upload failed with status ${xhr.status}`));
              }
            });

            xhr.addEventListener('error', () => reject(new Error('Upload failed')));
            xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));

            controller.signal.addEventListener('abort', () => xhr.abort());

            xhr.open('POST', '/api/upload');
            xhr.send(formData);
          });
        }

        // Success
        setQueue(prev =>
          prev.map(q =>
            q.id === item.id
              ? { ...q, status: 'completed' as const, progress: 100, result: result.file }
              : q
          )
        );

        if (onUploadComplete && result.file) {
          onUploadComplete(result.file);
        }
      } catch (error) {
        const err = error as Error;

        // Check if we should retry
        if (item.retryCount < maxRetries && err.message !== 'Upload cancelled') {
          console.log(`Retrying upload for ${item.file.name}, attempt ${item.retryCount + 1}`);
          setQueue(prev =>
            prev.map(q =>
              q.id === item.id
                ? { ...q, retryCount: q.retryCount + 1, status: 'pending' as const, progress: 0 }
                : q
            )
          );
        } else {
          // Failed permanently
          setQueue(prev =>
            prev.map(q =>
              q.id === item.id
                ? { ...q, status: 'failed' as const, error: err.message }
                : q
            )
          );

          if (onUploadError) {
            onUploadError(item.file, err);
          }
        }
      } finally {
        abortControllersRef.current.delete(item.id);
        setActiveUploads(prev => prev - 1);
      }
    },
    [maxRetries, onUploadComplete, onUploadError]
  );

  const processQueue = useCallback(() => {
    setQueue(prevQueue => {
      const pending = prevQueue.filter(q => q.status === 'pending');
      const uploading = prevQueue.filter(q => q.status === 'uploading');

      // Start new uploads up to max concurrent
      const slotsAvailable = maxConcurrent - uploading.length;
      const toStart = pending.slice(0, slotsAvailable);

      toStart.forEach(item => {
        setActiveUploads(prev => prev + 1);
        uploadFile(item);
      });

      return prevQueue;
    });
  }, [maxConcurrent, uploadFile]);

  const addFiles = useCallback(
    (files: File[]) => {
      const newItems: UploadQueueItem[] = files.map(file => ({
        id: `${Date.now()}-${Math.random()}`,
        file,
        status: 'pending',
        progress: 0,
        retryCount: 0,
      }));

      setQueue(prev => [...prev, ...newItems]);
      setTimeout(processQueue, 0);
    },
    [processQueue]
  );

  const cancelUpload = useCallback((id: string) => {
    const controller = abortControllersRef.current.get(id);
    if (controller) {
      controller.abort();
    }
    setQueue(prev => prev.filter(q => q.id !== id));
  }, []);

  const cancelAll = useCallback(() => {
    abortControllersRef.current.forEach(controller => controller.abort());
    abortControllersRef.current.clear();
    setQueue([]);
    setActiveUploads(0);
  }, []);

  const retryFailed = useCallback(() => {
    setQueue(prev =>
      prev.map(q =>
        q.status === 'failed' ? { ...q, status: 'pending', retryCount: 0, progress: 0, error: undefined } : q
      )
    );
    setTimeout(processQueue, 0);
  }, [processQueue]);

  const clearCompleted = useCallback(() => {
    setQueue(prev => prev.filter(q => q.status !== 'completed'));
  }, []);

  // Auto-process queue when items are added or completed
  const pendingCount = queue.filter(q => q.status === 'pending').length;
  const completedCount = queue.filter(q => q.status === 'completed').length;
  const failedCount = queue.filter(q => q.status === 'failed').length;
  const totalCount = queue.length;

  // Check if all uploads are complete
  if (totalCount > 0 && activeUploads === 0 && pendingCount === 0) {
    if (onQueueComplete) {
      setTimeout(() => {
        onQueueComplete();
      }, 0);
    }
  }

  // Auto-process queue when there are pending items and available slots
  if (pendingCount > 0 && activeUploads < maxConcurrent) {
    setTimeout(processQueue, 0);
  }

  return {
    queue,
    addFiles,
    cancelUpload,
    cancelAll,
    retryFailed,
    clearCompleted,
    stats: {
      total: totalCount,
      pending: pendingCount,
      uploading: activeUploads,
      completed: completedCount,
      failed: failedCount,
    },
  };
}
