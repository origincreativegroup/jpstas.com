/**
 * Cloudflare Stream Utilities
 *
 * Helper functions for working with Cloudflare Stream videos
 */

export interface StreamVideoOptions {
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  controls?: boolean;
  defaultTextTrack?: string;
  poster?: string;
  primaryColor?: string;
  letterboxColor?: string;
}

/**
 * Validate Cloudflare Stream video ID format
 * Video IDs are 32-character hexadecimal strings
 */
export function isValidStreamVideoId(videoId: string): boolean {
  return /^[0-9a-f]{32}$/i.test(videoId);
}

/**
 * Build Cloudflare Stream iframe URL
 *
 * @example
 * buildStreamIframeUrl('af4889355cd0d36bac6722871cb2bcb3', { autoplay: true })
 * // Returns: 'https://customer-h044ipu9nb6m47zm.cloudflarestream.com/af4889.../iframe?autoplay=true'
 */
export function buildStreamIframeUrl(videoId: string, options: StreamVideoOptions = {}): string {
  if (!videoId) return '';

  // Use the customer subdomain from your Cloudflare Stream account
  const baseUrl = `https://customer-h044ipu9nb6m47zm.cloudflarestream.com/${videoId}/iframe`;

  const params = new URLSearchParams();

  if (options.autoplay) params.set('autoplay', 'true');
  if (options.loop) params.set('loop', 'true');
  if (options.muted) params.set('muted', 'true');
  if (options.preload) params.set('preload', options.preload);
  if (options.controls === false) params.set('controls', 'false'); // Controls are on by default
  if (options.defaultTextTrack) params.set('defaultTextTrack', options.defaultTextTrack);
  if (options.poster) params.set('poster', encodeURIComponent(options.poster));
  if (options.primaryColor) params.set('primaryColor', options.primaryColor.replace('#', ''));
  if (options.letterboxColor) params.set('letterboxColor', options.letterboxColor.replace('#', ''));

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Build Cloudflare Stream direct video URL (HLS/DASH)
 *
 * @example
 * buildStreamVideoUrl('af4889355cd0d36bac6722871cb2bcb3')
 * // Returns: 'https://customer-h044ipu9nb6m47zm.cloudflarestream.com/af4889.../manifest/video.m3u8'
 */
export function buildStreamVideoUrl(videoId: string, format: 'hls' | 'dash' = 'hls'): string {
  if (!videoId) return '';

  const baseUrl = `https://customer-h044ipu9nb6m47zm.cloudflarestream.com/${videoId}/manifest`;

  return format === 'hls' ? `${baseUrl}/video.m3u8` : `${baseUrl}/video.mpd`;
}

/**
 * Get Cloudflare Stream thumbnail URL
 *
 * @example
 * getStreamThumbnailUrl('af4889355cd0d36bac6722871cb2bcb3')
 * // Returns: 'https://videodelivery.net/af4889.../thumbnails/thumbnail.jpg'
 */
export function getStreamThumbnailUrl(
  videoId: string,
  options: {
    time?: string; // Time offset (e.g., '10s', '1m30s')
    width?: number;
    height?: number;
    fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';
  } = {}
): string {
  if (!videoId) return '';

  let url = `https://videodelivery.net/${videoId}/thumbnails/thumbnail.jpg`;

  const params = new URLSearchParams();
  if (options.time) params.set('time', options.time);
  if (options.width) params.set('width', options.width.toString());
  if (options.height) params.set('height', options.height.toString());
  if (options.fit) params.set('fit', options.fit);

  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
}

/**
 * Get Stream video poster/preview image
 */
export function getStreamPosterUrl(videoId: string): string {
  return getStreamThumbnailUrl(videoId);
}

/**
 * Get Stream animated GIF preview
 */
export function getStreamAnimatedPreviewUrl(videoId: string, options: { width?: number; height?: number } = {}): string {
  if (!videoId) return '';

  let url = `https://videodelivery.net/${videoId}/thumbnails/thumbnail.gif`;

  const params = new URLSearchParams();
  if (options.width) params.set('width', options.width.toString());
  if (options.height) params.set('height', options.height.toString());

  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
}

/**
 * Extract video ID from various Stream URL formats
 */
export function extractVideoIdFromUrl(url: string): string | null {
  // Match video ID from iframe URL
  const iframeMatch = url.match(/cloudflarestream\.com\/([0-9a-f]{32})\//i);
  if (iframeMatch) return iframeMatch[1];

  // Match video ID from videodelivery.net URL
  const deliveryMatch = url.match(/videodelivery\.net\/([0-9a-f]{32})\//i);
  if (deliveryMatch) return deliveryMatch[1];

  // Match video ID from manifest URL
  const manifestMatch = url.match(/cloudflarestream\.com\/([0-9a-f]{32})\/manifest/i);
  if (manifestMatch) return manifestMatch[1];

  // If it's already just a video ID
  if (isValidStreamVideoId(url)) return url;

  return null;
}

/**
 * Build Stream video metadata URL (for API)
 * Note: Requires authentication
 */
export function buildStreamMetadataUrl(videoId: string, accountId: string): string {
  return `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/${videoId}`;
}

/**
 * Calculate aspect ratio padding for responsive video embed
 */
export function getAspectRatioPadding(aspectRatio: string): string {
  const [width, height] = aspectRatio.split('/').map(Number);
  if (!width || !height) return '56.25%'; // Default 16:9

  return `${(height / width) * 100}%`;
}

/**
 * Common aspect ratios
 */
export const ASPECT_RATIOS = {
  '16:9': '16/9',
  '4:3': '4/3',
  '1:1': '1/1',
  '9:16': '9/16', // Vertical/portrait
  '21:9': '21/9', // Ultrawide
} as const;
