export interface MediaFile {
  id: string;
  name: string;
  filename: string;
  url: string;
  alt: string;
  caption?: string;
  type: 'image' | 'video';
  size: number;
  width?: number;
  height?: number;
  duration?: number; // For videos
  thumbnail?: string; // For videos
  thumbnailUrl?: string; // Alternative thumbnail property
  metadata?: {
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
  uploadedAt?: string; // Alternative to createdAt
  uploadedBy?: string;
  tags?: string[];
  collections?: string[];
  status: 'processing' | 'ready' | 'error';
  error?: string;
  favorite?: boolean; // For favoriting functionality
  usage?: {
    projectIds?: string[];
    lastUsed?: string;
    useCount?: number;
  };
  cloudflare?: {
    type: 'stream' | 'image';
    uid?: string;
    id?: string;
    variants?: string[];
    // Cloudflare Stream specific
    streamId?: string;
    thumbnailUrl?: string;
    posterUrl?: string;
    aspectRatio?: string;
    bitrate?: number;
    fps?: number;
    codec?: string;
    processingStatus?: 'pending' | 'ready' | 'error';
    processingProgress?: number;
  };
}

export interface MediaCollection {
  id: string;
  name: string;
  description?: string;
  mediaIds: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface MediaUploadProgress {
  fileId: string;
  filename: string;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

export interface MediaFilter {
  search?: string;
  type?: 'all' | 'images' | 'videos' | 'image' | 'video';
  tags?: string[];
  collections?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  sizeRange?: {
    min: number;
    max: number;
  };
  favorite?: boolean;
}
