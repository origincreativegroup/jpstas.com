// Cloudflare Stream Service
import { MediaFile } from '@/types/media';

interface CloudflareStreamUpload {
  uid: string;
  status: {
    state: 'pending' | 'ready' | 'error';
    pctComplete: number;
    errorReasonCode?: string;
    errorReasonText?: string;
  };
  meta: {
    name: string;
    duration: number;
    size: number;
    width: number;
    height: number;
  };
  created: string;
  modified: string;
  preview?: string;
  thumbnail?: string;
  thumbnailTimestampPct?: number;
  allowedOrigins?: string[];
  requireSignedURLs?: boolean;
  watermark?: {
    uid: string;
    size: string;
    opacity: number;
    position: string;
  };
}

interface StreamUploadResponse {
  result: CloudflareStreamUpload;
  success: boolean;
  errors: any[];
  messages: any[];
}

class CloudflareStreamService {
  private accountId: string;
  private apiToken: string;
  private baseUrl: string;
  private maxRetries: number = 3;
  private retryDelay: number = 1000; // 1 second

  constructor() {
    this.accountId = import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID || '';
    this.apiToken = import.meta.env.VITE_CLOUDFLARE_API_TOKEN || '';
    this.baseUrl = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/stream`;
  }

  // Retry logic for API calls
  private async retryApiCall<T>(
    apiCall: () => Promise<T>,
    operation: string,
    maxRetries: number = this.maxRetries
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await apiCall();
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on authentication errors or invalid requests
        if (error instanceof Error && (
          error.message.includes('401') || 
          error.message.includes('403') ||
          error.message.includes('400') ||
          error.message.includes('Invalid')
        )) {
          throw error;
        }

        console.warn(`${operation} failed (attempt ${attempt}/${maxRetries}):`, error);
        
        if (attempt < maxRetries) {
          // Exponential backoff
          const delay = this.retryDelay * Math.pow(2, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw new Error(`${operation} failed after ${maxRetries} attempts: ${lastError!.message}`);
  }

  // Upload video to Cloudflare Stream
  async uploadVideo(
    file: File,
    options?: {
      name?: string;
      requireSignedURLs?: boolean;
      allowedOrigins?: string[];
      watermark?: {
        uid: string;
        size: string;
        opacity: number;
        position: string;
      };
    }
  ): Promise<CloudflareStreamUpload> {
    if (!this.accountId || !this.apiToken) {
      throw new Error('Cloudflare credentials not configured. Please check your environment variables.');
    }

    return this.retryApiCall(async () => {
      const formData = new FormData();
      formData.append('file', file);

      if (options?.name) {
        formData.append('name', options.name);
      }
      if (options?.requireSignedURLs !== undefined) {
        formData.append('requireSignedURLs', options.requireSignedURLs.toString());
      }
      if (options?.allowedOrigins) {
        formData.append('allowedOrigins', options.allowedOrigins.join(','));
      }
      if (options?.watermark) {
        formData.append('watermark', JSON.stringify(options.watermark));
      }

      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.errors?.[0]?.message || 'Unknown error';
        throw new Error(`Cloudflare Stream upload failed: ${errorMessage}`);
      }

      const data: StreamUploadResponse = await response.json();
      return data.result;
    }, `Video upload for ${file.name}`);
  }

  // Get video details
  async getVideo(uid: string): Promise<CloudflareStreamUpload> {
    if (!this.accountId || !this.apiToken) {
      throw new Error('Cloudflare credentials not configured');
    }

    return this.retryApiCall(async () => {
      const response = await fetch(`${this.baseUrl}/${uid}`, {
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to get video: ${errorData.errors?.[0]?.message || 'Unknown error'}`);
      }

      const data: StreamUploadResponse = await response.json();
      return data.result;
    }, `Get video details for ${uid}`);
  }

  // Delete video
  async deleteVideo(uid: string): Promise<void> {
    if (!this.accountId || !this.apiToken) {
      throw new Error('Cloudflare credentials not configured');
    }

    return this.retryApiCall(async () => {
      const response = await fetch(`${this.baseUrl}/${uid}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to delete video: ${errorData.errors?.[0]?.message || 'Unknown error'}`
        );
      }
    }, `Delete video ${uid}`);
  }

  // Get video embed URL
  getEmbedUrl(
    uid: string,
    options?: {
      autoplay?: boolean;
      controls?: boolean;
      loop?: boolean;
      muted?: boolean;
      startTime?: number;
      endTime?: number;
    }
  ): string {
    const params = new URLSearchParams();

    if (options?.autoplay) params.append('autoplay', 'true');
    if (options?.controls !== false) params.append('controls', 'true');
    if (options?.loop) params.append('loop', 'true');
    if (options?.muted) params.append('muted', 'true');
    if (options?.startTime) params.append('startTime', options.startTime.toString());
    if (options?.endTime) params.append('endTime', options.endTime.toString());

    const queryString = params.toString();
    return `https://iframe.cloudflarestream.com/${uid}${queryString ? `?${queryString}` : ''}`;
  }

  // Get video thumbnail URL
  getThumbnailUrl(
    uid: string,
    options?: {
      time?: number;
      width?: number;
      height?: number;
      fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';
    }
  ): string {
    const params = new URLSearchParams();

    if (options?.time) params.append('time', options.time.toString());
    if (options?.width) params.append('width', options.width.toString());
    if (options?.height) params.append('height', options.height.toString());
    if (options?.fit) params.append('fit', options.fit);

    const queryString = params.toString();
    return `https://videodelivery.net/${uid}/thumbnails/thumbnail.jpg${queryString ? `?${queryString}` : ''}`;
  }

  // Convert Cloudflare Stream upload to MediaFile
  convertToMediaFile(streamUpload: CloudflareStreamUpload, originalFile: File): MediaFile {
    return {
      id: streamUpload.uid,
      name: streamUpload.meta.name || originalFile.name,
      filename: originalFile.name,
      url: this.getEmbedUrl(streamUpload.uid),
      alt: streamUpload.meta.name || originalFile.name,
      type: 'video',
      size: streamUpload.meta.size,
      width: streamUpload.meta.width,
      height: streamUpload.meta.height,
      duration: streamUpload.meta.duration,
      thumbnail: streamUpload.thumbnail || this.getThumbnailUrl(streamUpload.uid),
      thumbnailUrl: streamUpload.thumbnail || this.getThumbnailUrl(streamUpload.uid),
      metadata: {
        duration: streamUpload.meta.duration,
        width: streamUpload.meta.width,
        height: streamUpload.meta.height,
        format: 'mp4',
        quality: 'auto',
        streamId: streamUpload.uid,
        thumbnailUrl: streamUpload.thumbnail || this.getThumbnailUrl(streamUpload.uid),
        posterUrl: streamUpload.preview || this.getThumbnailUrl(streamUpload.uid),
        aspectRatio: `${streamUpload.meta.width}:${streamUpload.meta.height}`,
        bitrate: 0, // Will be populated when processing is complete
        fps: 0, // Will be populated when processing is complete
        codec: 'h264', // Default codec
      },
      createdAt: streamUpload.created,
      updatedAt: streamUpload.modified,
      uploadedAt: streamUpload.created,
      status:
        streamUpload.status.state === 'ready'
          ? 'ready'
          : streamUpload.status.state === 'error'
            ? 'error'
            : 'processing',
      error: streamUpload.status.errorReasonText,
      cloudflare: {
        type: 'stream',
        uid: streamUpload.uid,
        id: streamUpload.uid,
        variants: ['auto'], // Cloudflare Stream provides adaptive bitrate
        streamId: streamUpload.uid,
        thumbnailUrl: streamUpload.thumbnail || this.getThumbnailUrl(streamUpload.uid),
        posterUrl: streamUpload.preview || this.getThumbnailUrl(streamUpload.uid),
        aspectRatio: `${streamUpload.meta.width}:${streamUpload.meta.height}`,
        bitrate: 0,
        fps: 0,
        codec: 'h264',
        processingStatus: streamUpload.status.state,
        processingProgress: streamUpload.status.pctComplete,
      },
    };
  }

  // Check if file is a video that should be processed by Cloudflare Stream
  shouldUseStream(file: File): boolean {
    return file.type.startsWith('video/') && file.size > 0;
  }

  // Get supported video formats
  getSupportedFormats(): string[] {
    return [
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/avi',
      'video/mov',
      'video/wmv',
      'video/flv',
      'video/mkv',
    ];
  }

  // Get max file size (100MB for Cloudflare Stream)
  getMaxFileSize(): number {
    return 100 * 1024 * 1024; // 100MB
  }
}

export const cloudflareStream = new CloudflareStreamService();
export default cloudflareStream;
