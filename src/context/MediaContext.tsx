import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface MediaFile {
  id: string;
  name: string;
  filename: string;
  url: string;
  thumbnailUrl?: string;
  size: number;
  type: string;
  uploadedAt: string;
  cloudflare?: {
    type: 'stream' | 'image';
    uid?: string;
    id?: string;
    variants?: string[];
  };
}

interface MediaContextType {
  media: MediaFile[];
  loading: boolean;
  error: string | null;
  addMedia: (file: MediaFile) => void;
  removeMedia: (id: string) => Promise<void>;
  refreshMedia: () => Promise<void>;
  getMediaById: (id: string) => MediaFile | undefined;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export function MediaProvider({ children }: { children: ReactNode }) {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMedia = useCallback((file: MediaFile) => {
    setMedia(prev => [file, ...prev]);
  }, []);

  const removeMedia = useCallback(async (id: string) => {
    const fileToDelete = media.find(m => m.id === id);
    if (!fileToDelete) return;

    try {
      // Determine file type for delete API
      const fileType = fileToDelete.type.startsWith('video/') ? 'video' : 'image';

      // Call delete API
      const response = await fetch(`/api/upload?id=${id}&type=${fileType}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Delete failed');
      }

      // Remove from local state on success
      setMedia(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  }, [media]);

  const refreshMedia = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/media');
      if (!response.ok) {
        throw new Error('Failed to fetch media');
      }

      const data = await response.json();
      setMedia(data.media || []);
    } catch (err) {
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

  return (
    <MediaContext.Provider
      value={{
        media,
        loading,
        error,
        addMedia,
        removeMedia,
        refreshMedia,
        getMediaById,
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
