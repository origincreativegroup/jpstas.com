import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { debug } from '@/utils/debug';
import { api, handleApiError } from '@/services/apiClient';
import { cloudflareStream } from '@/services/cloudflareStream';
import { MediaFile, MediaFilter } from '@/types/media';

interface MediaContextType {
  media: MediaFile[];
  loading: boolean;
  error: string | null;
  addMedia: (file: MediaFile) => void;
  updateMedia: (id: string, updates: Partial<MediaFile>) => Promise<void>;
  removeMedia: (id: string) => Promise<void>;
  refreshMedia: () => Promise<void>;
  getMediaById: (id: string) => MediaFile | undefined;
  filterMedia: (filter: MediaFilter) => MediaFile[];
  getAllTags: () => string[];
  getAllCollections: () => string[];
  toggleFavorite: (id: string) => Promise<void>;
  bulkUpdate: (ids: string[], updates: Partial<MediaFile>) => Promise<void>;
  bulkDelete: (ids: string[]) => Promise<void>;
  // Cloudflare Stream integration
  uploadVideo: (file: File, options?: any) => Promise<MediaFile>;
  uploadImage: (file: File, options?: any) => Promise<MediaFile>;
  uploadFile: (file: File, options?: any) => Promise<MediaFile>;
  getVideoEmbedUrl: (streamId: string, options?: any) => string;
  getVideoThumbnailUrl: (streamId: string, options?: any) => string;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export function MediaProvider({ children }: { children: ReactNode }) {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMedia = useCallback((file: MediaFile) => {
    debug.media.upload('Adding media file to context', {
      id: file.id,
      name: file.name,
      type: file.type,
      size: file.size,
    });

    setMedia(prev => {
      // Check if file already exists to prevent duplicates
      const exists = prev.some(m => m.id === file.id);
      if (exists) {
        debug.media.warn('File already exists, skipping duplicate', {
          id: file.id,
          name: file.name,
        });
        return prev;
      }

      const updated = [file, ...prev];
      debug.state.update('Media state updated', { totalFiles: updated.length });
      return updated;
    });
  }, []);

  const updateMedia = useCallback(async (id: string, updates: Partial<MediaFile>) => {
    debug.media.update('Updating media file', { id, updates });
    debug.perf.start(`updateMedia:${id}`);

    try {
      // Update locally first for optimistic UI
      setMedia(prev =>
        prev.map(m => (m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m))
      );

      // Update on backend
      const updatedFile = await api.updateMedia(id, updates);

      if (!updatedFile) {
        throw new Error('Update failed - no file returned');
      }

      // Update with server response
      setMedia(prev => prev.map(m => (m.id === id ? updatedFile : m)));

      debug.api.response(`PATCH /api/media/${id} - Success`, { id, updates });
      debug.perf.end(`updateMedia:${id}`);
    } catch (err) {
      debug.media.error('Failed to update media', err as Error, { id, updates });
      debug.perf.end(`updateMedia:${id}`);

      // Revert local changes on error
      setMedia(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));

      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const removeMedia = useCallback(
    async (id: string) => {
      debug.media.delete('Removing media file', { id });
      debug.perf.start(`removeMedia:${id}`);

      try {
        // Get file from current state
        const fileToDelete = media.find(m => m.id === id);
        if (!fileToDelete) {
          debug.media.error('File not found for deletion', new Error('File not found'), { id });
          throw new Error('File not found');
        }

        // Remove from backend
        await api.deleteMedia(id);

        // Remove from local state
        setMedia(prev => {
          const updated = prev.filter(m => m.id !== id);
          debug.state.update('Media removed from state', {
            removedId: id,
            totalFiles: updated.length,
          });
          return updated;
        });

        debug.api.response(`DELETE /api/media - Success`, { id });
        debug.perf.end(`removeMedia:${id}`);
      } catch (err) {
        debug.media.error('Failed to remove media', err as Error, { id });
        debug.perf.end(`removeMedia:${id}`);

        const errorMessage = handleApiError(err);
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [media]
  );

  const refreshMedia = useCallback(async () => {
    debug.media.select('Refreshing media library');
    debug.perf.start('refreshMedia');
    setLoading(true);
    setError(null);

    try {
      const mediaFiles = await api.getMedia();
      setMedia(mediaFiles);

      debug.state.update('Media library refreshed', {
        totalFiles: mediaFiles.length,
      });
      debug.perf.end('refreshMedia');
    } catch (err) {
      debug.media.error('Failed to refresh media', err as Error);
      debug.perf.end('refreshMedia');

      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getMediaById = useCallback(
    (id: string) => {
      return media.find(m => m.id === id);
    },
    [media]
  );

  const filterMedia = useCallback(
    (filter: MediaFilter): MediaFile[] => {
      return media.filter(file => {
        // Search filter
        if (filter.search) {
          const searchLower = filter.search.toLowerCase();
          const matchesName = file.name.toLowerCase().includes(searchLower);
          const matchesAlt = file.metadata?.alt?.toLowerCase().includes(searchLower);
          const matchesCaption = file.metadata?.caption?.toLowerCase().includes(searchLower);
          const matchesTags = file.metadata?.tags?.some((tag: string) =>
            tag.toLowerCase().includes(searchLower)
          );
          if (!matchesName && !matchesAlt && !matchesCaption && !matchesTags) return false;
        }

        // Type filter
        if (filter.type && filter.type !== 'all') {
          if (filter.type === 'images' && !file.type.startsWith('image/')) return false;
          if (filter.type === 'videos' && !file.type.startsWith('video/')) return false;
        }

        // Tags filter
        if (filter.tags && filter.tags.length > 0) {
          const fileTags = file.metadata?.tags || [];
          if (!filter.tags.some(tag => fileTags.includes(tag))) return false;
        }

        // Collections filter
        if (filter.collections && filter.collections.length > 0) {
          const fileCollections = file.metadata?.collections || [];
          if (!filter.collections.some(col => fileCollections.includes(col))) return false;
        }

        // Date range filter
        if (filter.dateRange) {
          const fileDate = new Date(file.uploadedAt || file.createdAt);
          const startDate = new Date(filter.dateRange.start);
          const endDate = new Date(filter.dateRange.end);
          if (fileDate < startDate || fileDate > endDate) return false;
        }

        // Size range filter
        if (filter.sizeRange) {
          if (file.size < filter.sizeRange.min || file.size > filter.sizeRange.max) return false;
        }

        // Favorite filter
        if (filter.favorite !== undefined && file.favorite !== filter.favorite) return false;

        return true;
      });
    },
    [media]
  );

  const getAllTags = useCallback((): string[] => {
    const tagsSet = new Set<string>();
    media.forEach(file => {
      file.metadata?.tags?.forEach((tag: string) => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, [media]);

  const getAllCollections = useCallback((): string[] => {
    const collectionsSet = new Set<string>();
    media.forEach(file => {
      file.metadata?.collections?.forEach((col: string) => collectionsSet.add(col));
    });
    return Array.from(collectionsSet).sort();
  }, [media]);

  const toggleFavorite = useCallback(
    async (id: string) => {
      const file = media.find(m => m.id === id);
      if (!file) return;
      await updateMedia(id, { favorite: !file.favorite });
    },
    [media, updateMedia]
  );

  const bulkUpdate = useCallback(async (ids: string[], updates: Partial<MediaFile>) => {
    debug.media.update('Bulk updating media files', { count: ids.length, updates });
    debug.perf.start('bulkUpdate');

    try {
      // Update locally first for optimistic UI
      setMedia(prev =>
        prev.map(m =>
          ids.includes(m.id) ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m
        )
      );

      // Use bulk endpoint for better performance
      const result = await api.bulkUpdateMedia(ids, updates);

      // Handle partial failures
      if (result.errors && result.errors.length > 0) {
        debug.media.warn('Bulk update had partial failures', { 
          total: ids.length, 
          errors: result.errors.length,
          successful: result.results.length 
        });
        
        // Revert failed items
        const failedIds = result.errors.map(e => e.id);
        setMedia(prev => prev.map(m => 
          failedIds.includes(m.id) ? { ...m, ...updates } : m
        ));

        if (result.errors.length === ids.length) {
          // All failed
          const errorMessage = result.errors[0].error || 'All bulk updates failed';
          setError(errorMessage);
          throw new Error(errorMessage);
        } else {
          // Partial success - show warning but don't throw
          setError(`Some updates failed: ${result.errors.length} of ${ids.length}`);
        }
      }

      debug.api.response('Bulk update - Success', { 
        count: ids.length, 
        successful: result.results.length,
        errors: result.errors?.length || 0 
      });
      debug.perf.end('bulkUpdate');
    } catch (err) {
      debug.media.error('Bulk update failed', err as Error, { count: ids.length });
      debug.perf.end('bulkUpdate');

      // Revert local changes on error
      setMedia(prev => prev.map(m => (ids.includes(m.id) ? { ...m, ...updates } : m)));

      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const bulkDelete = useCallback(
    async (ids: string[]) => {
      debug.media.delete('Bulk deleting media files', { count: ids.length });
      debug.perf.start('bulkDelete');

      try {
        // Get files to delete for logging
        const filesToDelete = media.filter(m => ids.includes(m.id));
        debug.info('Files to delete', {
          count: filesToDelete.length,
          files: filesToDelete.map(f => ({ id: f.id, name: f.name, type: f.type })),
        });

        // Use bulk endpoint for better performance
        const result = await api.bulkDeleteMedia(ids);

        // Handle partial failures
        if (result.errors && result.errors.length > 0) {
          debug.media.warn('Bulk delete had partial failures', { 
            total: ids.length, 
            errors: result.errors.length,
            successful: result.results.length 
          });
          
          // Only remove successfully deleted items from state
          const successfulIds = result.results.map(r => r.id);
          setMedia(prev => {
            const updated = prev.filter(m => !successfulIds.includes(m.id));
            debug.state.update('Partial bulk delete from state', {
              removedCount: successfulIds.length,
              totalFiles: updated.length,
            });
            return updated;
          });

          if (result.errors.length === ids.length) {
            // All failed
            const errorMessage = result.errors[0].error || 'All bulk deletes failed';
            setError(errorMessage);
            throw new Error(errorMessage);
          } else {
            // Partial success - show warning but don't throw
            setError(`Some deletions failed: ${result.errors.length} of ${ids.length}`);
          }
        } else {
          // All successful - remove all from state
          setMedia(prev => {
            const updated = prev.filter(m => !ids.includes(m.id));
            debug.state.update('Bulk deleted from state', {
              removedCount: ids.length,
              totalFiles: updated.length,
            });
            return updated;
          });
        }

        debug.api.response('Bulk delete - Success', { 
          count: ids.length, 
          successful: result.results.length,
          errors: result.errors?.length || 0 
        });
        debug.perf.end('bulkDelete');
      } catch (err) {
        debug.media.error('Bulk delete failed', err as Error, { count: ids.length });
        debug.perf.end('bulkDelete');

        const errorMessage = handleApiError(err);
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [media]
  );

  // Cloudflare Stream video upload
  const uploadVideo = useCallback(
    async (file: File, options?: any): Promise<MediaFile> => {
      debug.media.upload('Uploading video to Cloudflare Stream', {
        name: file.name,
        size: file.size,
        type: file.type,
      });
      debug.perf.start('uploadVideo');

      try {
        // Check if file should use Cloudflare Stream
        if (!cloudflareStream.shouldUseStream(file)) {
          throw new Error('File is not a supported video format for Cloudflare Stream');
        }

        // Check file size
        if (file.size > cloudflareStream.getMaxFileSize()) {
          throw new Error(
            `File size exceeds maximum allowed size of ${cloudflareStream.getMaxFileSize() / (1024 * 1024)}MB`
          );
        }

        // Upload to Cloudflare Stream
        const streamUpload = await cloudflareStream.uploadVideo(file, options);

        // Convert to MediaFile
        const mediaFile = cloudflareStream.convertToMediaFile(streamUpload, file);

        // Add to local state
        addMedia(mediaFile);

        debug.media.upload('Video uploaded successfully', {
          id: mediaFile.id,
          streamId: streamUpload.uid,
          status: streamUpload.status.state,
        });
        debug.perf.end('uploadVideo');

        return mediaFile;
      } catch (err) {
        debug.media.error('Video upload failed', err as Error, {
          name: file.name,
          size: file.size,
        });
        debug.perf.end('uploadVideo');

        const errorMessage = err instanceof Error ? err.message : 'Video upload failed';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [addMedia]
  );

  // Image upload (using existing API)
  const uploadImage = useCallback(
    async (file: File): Promise<MediaFile> => {
      debug.media.upload('Uploading image', {
        name: file.name,
        size: file.size,
        type: file.type,
      });
      debug.perf.start('uploadImage');

      try {
        // Use existing API for images
        const mediaFile = await api.uploadFile(file);

        if (!mediaFile) {
          throw new Error('Upload failed - no file returned');
        }

        // Add to local state
        addMedia(mediaFile);

        debug.media.upload('Image uploaded successfully', {
          id: mediaFile.id,
          name: mediaFile.name,
        });
        debug.perf.end('uploadImage');

        return mediaFile;
      } catch (err) {
        debug.media.error('Image upload failed', err as Error, {
          name: file.name,
          size: file.size,
        });
        debug.perf.end('uploadImage');

        const errorMessage = handleApiError(err);
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [addMedia]
  );

  // Generic file upload (auto-detect type)
  const uploadFile = useCallback(
    async (file: File, options?: any): Promise<MediaFile> => {
      debug.media.upload('Uploading file', {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      try {
        // Determine upload method based on file type
        if (file.type.startsWith('video/') && cloudflareStream.shouldUseStream(file)) {
          return await uploadVideo(file, options);
        } else if (file.type.startsWith('image/')) {
          return await uploadImage(file);
        } else {
          // Use existing API for other file types
          const mediaFile = await api.uploadFile(file);
          if (!mediaFile) {
            throw new Error('Upload failed - no file returned');
          }
          addMedia(mediaFile);
          return mediaFile;
        }
      } catch (err) {
        debug.media.error('File upload failed', err as Error, {
          name: file.name,
          size: file.size,
        });

        const errorMessage = err instanceof Error ? err.message : 'File upload failed';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [uploadVideo, uploadImage, addMedia]
  );

  // Get video embed URL
  const getVideoEmbedUrl = useCallback((streamId: string, options?: any): string => {
    return cloudflareStream.getEmbedUrl(streamId, options);
  }, []);

  // Get video thumbnail URL
  const getVideoThumbnailUrl = useCallback((streamId: string, options?: any): string => {
    return cloudflareStream.getThumbnailUrl(streamId, options);
  }, []);

  return (
    <MediaContext.Provider
      value={{
        media,
        loading,
        error,
        addMedia,
        updateMedia,
        removeMedia,
        refreshMedia,
        getMediaById,
        filterMedia,
        getAllTags,
        getAllCollections,
        toggleFavorite,
        bulkUpdate,
        bulkDelete,
        // Cloudflare Stream integration
        uploadVideo,
        uploadImage,
        uploadFile,
        getVideoEmbedUrl,
        getVideoThumbnailUrl,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
}

export function useMedia() {
  const context = useContext(MediaContext);
  if (context === undefined) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return context;
}
