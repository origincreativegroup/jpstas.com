/**
 * Cloudflare R2 Image Optimization Utilities
 *
 * Helper functions for optimizing images served from Cloudflare R2
 * via Cloudflare Image Resizing (requires Cloudflare Images or Pro plan)
 */

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';
  gravity?: 'auto' | 'left' | 'right' | 'top' | 'bottom' | 'center';
  quality?: number; // 1-100
  format?: 'auto' | 'webp' | 'avif' | 'json' | 'jpeg' | 'png';
  blur?: number; // 1-250
  sharpen?: number; // 0-10
}

export interface ResponsiveImageOptions {
  src: string;
  breakpoints?: number[];
  sizes?: string;
  format?: 'auto' | 'webp' | 'avif' | 'jpeg' | 'png';
  quality?: number;
}

/**
 * Build Cloudflare Image Resizing URL
 *
 * @example
 * buildImageUrl('https://media.jpstas.com/image.jpg', { width: 800, format: 'webp' })
 * // Returns: 'https://media.jpstas.com/cdn-cgi/image/width=800,format=webp/image.jpg'
 */
export function buildImageUrl(src: string, options: ImageTransformOptions = {}): string {
  if (!src) return '';

  // Don't transform if it's not from media.jpstas.com or if it's already transformed
  if (!src.includes('media.jpstas.com') || src.includes('/cdn-cgi/image/')) {
    return src;
  }

  const params: string[] = [];

  if (options.width) params.push(`width=${options.width}`);
  if (options.height) params.push(`height=${options.height}`);
  if (options.fit) params.push(`fit=${options.fit}`);
  if (options.gravity) params.push(`gravity=${options.gravity}`);
  if (options.quality) params.push(`quality=${options.quality}`);
  if (options.format) params.push(`format=${options.format}`);
  if (options.blur) params.push(`blur=${options.blur}`);
  if (options.sharpen) params.push(`sharpen=${options.sharpen}`);

  if (params.length === 0) return src;

  // Extract the path after the domain
  const url = new URL(src);
  const path = url.pathname + url.search;

  // Build Cloudflare Image Resizing URL
  return `${url.origin}/cdn-cgi/image/${params.join(',')}${path}`;
}

/**
 * Generate srcset for responsive images
 *
 * @example
 * generateSrcSet('https://media.jpstas.com/image.jpg')
 * // Returns: 'https://media.jpstas.com/cdn-cgi/image/width=640/image.jpg 640w, ...'
 */
export function generateSrcSet(
  src: string,
  options: Partial<ResponsiveImageOptions> = {}
): string {
  const imageSrc = options.src || src;
  const breakpoints = options.breakpoints || [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
  const format = options.format || 'auto';
  const quality = options.quality || 85;

  const srcsetEntries = breakpoints.map(width => {
    const url = buildImageUrl(imageSrc, { width, format, quality });
    return `${url} ${width}w`;
  });

  return srcsetEntries.join(', ');
}

/**
 * Generate sizes attribute for responsive images
 *
 * @example
 * generateSizes('(max-width: 768px) 100vw, 50vw')
 */
export function generateSizes(customSizes?: string): string {
  if (customSizes) return customSizes;

  // Default responsive sizes
  return '(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw';
}

/**
 * Get optimized thumbnail URL
 */
export function getThumbnailUrl(
  src: string,
  size: number = 200,
  format: 'auto' | 'webp' | 'avif' = 'webp'
): string {
  return buildImageUrl(src, {
    width: size,
    height: size,
    fit: 'cover',
    format,
    quality: 80,
  });
}

/**
 * Get blur placeholder URL for progressive loading
 */
export function getBlurPlaceholderUrl(src: string): string {
  return buildImageUrl(src, {
    width: 40,
    quality: 10,
    blur: 50,
  });
}

/**
 * Check if browser supports WebP
 */
export function supportsWebP(): boolean {
  if (typeof window === 'undefined') return false;

  const canvas = document.createElement('canvas');
  if (canvas.getContext && canvas.getContext('2d')) {
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
}

/**
 * Check if browser supports AVIF
 */
export function supportsAVIF(): boolean {
  if (typeof window === 'undefined') return false;

  const canvas = document.createElement('canvas');
  if (canvas.getContext && canvas.getContext('2d')) {
    return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
  }
  return false;
}

/**
 * Get best supported format for current browser
 */
export function getBestFormat(): 'avif' | 'webp' | 'auto' {
  if (supportsAVIF()) return 'avif';
  if (supportsWebP()) return 'webp';
  return 'auto';
}

/**
 * Preload image
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Extract dimensions from URL if present
 */
export function extractDimensionsFromUrl(src: string): { width?: number; height?: number } {
  const widthMatch = src.match(/width[=:](\d+)/);
  const heightMatch = src.match(/height[=:](\d+)/);

  return {
    width: widthMatch ? parseInt(widthMatch[1]) : undefined,
    height: heightMatch ? parseInt(heightMatch[1]) : undefined,
  };
}
