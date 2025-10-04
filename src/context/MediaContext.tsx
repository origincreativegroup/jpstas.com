import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { debug } from '@/utils/debug';

export interface MediaFile {
  id: string;
  name: string;
  filename: string;
  url: string;
  thumbnailUrl?: string;
  size: number;
  type: string;
  uploadedAt: string;
  updatedAt?: string;
  cloudflare?: {
    type: 'stream' | 'image';
    uid?: string;
    id?: string;
    variants?: string[];
  };
  metadata?: {
    alt?: string;
    caption?: string;
    tags?: string[];
    collections?: string[];
    dimensions?: { width: number; height: number };
    duration?: number; // for videos
  };
  usage?: {
    projectIds?: string[];
    lastUsed?: string;
    useCount?: number;
  };
  favorite?: boolean;
}

export interface MediaFilter {
  search?: string;
  type?: 'all' | 'images' | 'videos';
  tags?: string[];
  collections?: string[];
  dateRange?: { start: string; end: string };
  sizeRange?: { min: number; max: number };
  favorite?: boolean;
}

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
      const updated = [file, ...prev];
      debug.state.update('Media state updated', { totalFiles: updated.length });
      return updated;
    });
  }, []);

  const updateMedia = useCallback(async (id: string, updates: Partial<MediaFile>) => {
    debug.media.update('Updating media file', { id, updates });
    debug.perf.start(`updateMedia:${id}`);

    try {
      setMedia(prev =>
        prev.map(m =>
          m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m
        )
      );

      debug.api.request(`PATCH /api/media/${id}`, { updates });

      // Save to backend
      const response = await fetch(`/api/media/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update media');
      }

      debug.api.response(`PATCH /api/media/${id} - Success`, {
        status: response.status,
      });
      debug.perf.end(`updateMedia:${id}`);
    } catch (err) {
      debug.media.error('Failed to update media', err as Error, { id, updates });
      debug.perf.end(`updateMedia:${id}`);
      setError((err as Error).message);
      throw err;
    }
  }, []);

  const removeMedia = useCallback(async (id: string) => {
    debug.media.delete('Removing media file', { id });
    debug.perf.start(`removeMedia:${id}`);

    try {
      // Get file from current state to avoid stale closure
      let fileToDelete: MediaFile | undefined;
      setMedia(prev => {
        fileToDelete = prev.find(m => m.id === id);
        return prev;
      });

      if (!fileToDelete) {
        debug.media.error('File not found for deletion', new Error('File not found'), { id });
        throw new Error('File not found');
      }

      // Determine file type for delete API
      const fileType = fileToDelete.type.startsWith('video/') ? 'video' : 'image';
      debug.api.request(`DELETE /api/upload?id=${id}&type=${fileType}`, {
        id,
        type: fileType,
        name: fileToDelete.name,
      });

      // Call delete API
      const response = await fetch(`/api/upload?id=${id}&type=${fileType}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        debug.api.error(
          `DELETE /api/upload - Failed`,
          new Error(errorData.error || 'Delete failed'),
          { id, status: response.status }
        );
        throw new Error(errorData.error || 'Delete failed');
      }

      debug.api.response(`DELETE /api/upload - Success`, { id, status: response.status });

      // Remove from local state on success
      setMedia(prev => {
        const updated = prev.filter(m => m.id !== id);
        debug.state.update('Media removed from state', {
          removedId: id,
          totalFiles: updated.length,
        });
        return updated;
      });

      debug.perf.end(`removeMedia:${id}`);
    } catch (err) {
      debug.media.error('Failed to remove media', err as Error, { id });
      debug.perf.end(`removeMedia:${id}`);
      setError((err as Error).message);
      throw err;
    }
  }, []);

  const refreshMedia = useCallback(async () => {
    debug.media.select('Refreshing media library');
    debug.perf.start('refreshMedia');
    setLoading(true);
    setError(null);

    try {
      debug.api.request('GET /api/media');
      const response = await fetch('/api/media');

      if (!response.ok) {
        throw new Error('Failed to fetch media');
      }

      const data = await response.json();
      debug.api.response('GET /api/media - Success', {
        status: response.status,
        mediaCount: data.media?.length || 0,
      });

      setMedia(data.media || []);
      debug.state.update('Media library refreshed', {
        totalFiles: data.media?.length || 0,
      });

      debug.perf.end('refreshMedia');
    } catch (err) {
      debug.media.error('Failed to refresh media', err as Error);
      debug.perf.end('refreshMedia');
      setError((err as Error).message);
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
          const matchesTags = file.metadata?.tags?.some(tag =>
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
          const fileDate = new Date(file.uploadedAt);
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
      file.metadata?.tags?.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, [media]);

  const getAllCollections = useCallback((): string[] => {
    const collectionsSet = new Set<string>();
    media.forEach(file => {
      file.metadata?.collections?.forEach(col => collectionsSet.add(col));
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

  const bulkUpdate = useCallback(
    async (ids: string[], updates: Partial<MediaFile>) => {
      debug.media.update('Bulk updating media files', { count: ids.length, updates });
      debug.perf.start('bulkUpdate');

      try {
        // Update locally first
        setMedia(prev =>
          prev.map(m =>
            ids.includes(m.id) ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m
          )
        );

        debug.api.request('PATCH /api/media/bulk', { ids, updates });

        // Batch update on backend
        const response = await fetch('/api/media/bulk', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids, updates }),
        });

        if (!response.ok) {
          throw new Error('Bulk update failed');
        }

        debug.api.response('PATCH /api/media/bulk - Success', {
          status: response.status,
          count: ids.length,
        });
        debug.perf.end('bulkUpdate');
      } catch (err) {
        debug.media.error('Bulk update failed', err as Error, { count: ids.length });
        debug.perf.end('bulkUpdate');
        setError((err as Error).message);
        throw err;
      }
    },
    []
  );

  const bulkDelete = useCallback(
    async (ids: string[]) => {
      debug.media.delete('Bulk deleting media files', { count: ids.length });
      debug.perf.start('bulkDelete');

      try {
        // Get all files to delete from current state
        let filesToDelete: MediaFile[] = [];
        setMedia(prev => {
          filesToDelete = prev.filter(m => ids.includes(m.id));
          return prev;
        });

        debug.info('Files to delete', {
          count: filesToDelete.length,
          files: filesToDelete.map(f => ({ id: f.id, name: f.name, type: f.type })),
        });

        // Delete each file from Cloudflare
        let successCount = 0;
        let failCount = 0;

        for (const file of filesToDelete) {
          const fileType = file.type.startsWith('video/') ? 'video' : 'image';
          debug.api.request(`DELETE /api/upload (bulk)`, {
            id: file.id,
            type: fileType,
            name: file.name,
          });

          const response = await fetch(`/api/upload?id=${file.id}&type=${fileType}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            debug.api.error(
              `DELETE /api/upload - Failed (bulk)`,
              new Error('Delete failed'),
              {
                id: file.id,
                status: response.status,
              }
            );
            failCount++;
          } else {
            successCount++;
          }
        }

        debug.info('Bulk delete results', {
          total: filesToDelete.length,
          success: successCount,
          failed: failCount,
        });

        // Remove from local state
        setMedia(prev => {
          const updated = prev.filter(m => !ids.includes(m.id));
          debug.state.update('Bulk deleted from state', {
            removedCount: ids.length,
            totalFiles: updated.length,
          });
          return updated;
        });

        debug.perf.end('bulkDelete');
      } catch (err) {
        debug.media.error('Bulk delete failed', err as Error, { count: ids.length });
        debug.perf.end('bulkDelete');
        setError((err as Error).message);
        throw err;
      }
    },
    []
  );

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
