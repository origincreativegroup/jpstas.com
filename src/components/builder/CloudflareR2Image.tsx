/**
 * Cloudflare R2 Image Component
 *
 * Optimized image component for Cloudflare R2 with automatic image resizing
 * Works standalone and integrates with Builder.io visual editor
 */

import { component$, useSignal, useVisibleTask$, type QRL } from '@builder.io/qwik';
import {
  buildImageUrl,
  generateSrcSet,
  generateSizes,
  getBlurPlaceholderUrl,
  getBestFormat,
  type ImageTransformOptions,
} from '~/lib/cloudflare-image';

export interface CloudflareR2ImageProps {
  /** Image source URL (from Cloudflare R2) */
  src: string;

  /** Alt text for accessibility */
  alt: string;

  /** Image width (used for optimization) */
  width?: number;

  /** Image height (used for optimization) */
  height?: number;

  /** Responsive sizes attribute */
  sizes?: string;

  /** CSS class names */
  class?: string;

  /** Enable automatic optimization (default: true) */
  optimize?: boolean;

  /** Image quality (1-100, default: 85) */
  quality?: number;

  /** Force specific format */
  format?: 'auto' | 'webp' | 'avif' | 'jpeg' | 'png';

  /** Image fit mode */
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';

  /** Gravity/focus point */
  gravity?: 'auto' | 'left' | 'right' | 'top' | 'bottom' | 'center';

  /** Enable lazy loading (default: true) */
  lazy?: boolean;

  /** Enable blur placeholder (default: false) */
  blurPlaceholder?: boolean;

  /** Loading priority */
  priority?: 'high' | 'low' | 'auto';

  /** onClick handler */
  onClick$?: QRL<() => void>;

  /** Title attribute */
  title?: string;
}

/**
 * CloudflareR2Image Component
 *
 * Features:
 * - Automatic image optimization via Cloudflare Image Resizing
 * - Responsive srcset generation
 * - Lazy loading with Intersection Observer
 * - Blur placeholder support
 * - Format detection (WebP, AVIF)
 * - Builder.io compatible
 *
 * @example
 * <CloudflareR2Image
 *   src="https://media.jpstas.com/portfolio/image.jpg"
 *   alt="Portfolio image"
 *   width={800}
 *   height={600}
 * />
 */
export const CloudflareR2Image = component$<CloudflareR2ImageProps>((props) => {
  const {
    src,
    alt,
    width,
    height,
    sizes,
    class: className = '',
    optimize = true,
    quality = 85,
    format,
    fit = 'scale-down',
    gravity = 'auto',
    lazy = true,
    blurPlaceholder = false,
    priority = 'auto',
    onClick$,
    title,
  } = props;

  const isLoaded = useSignal(false);
  // For SSR and non-lazy, start as in view. Otherwise wait for intersection
  const isInView = useSignal(typeof window === 'undefined' || !lazy);
  const imgRef = useSignal<HTMLImageElement>();

  // Set up intersection observer for lazy loading
  useVisibleTask$(({ track, cleanup }) => {
    track(() => lazy);

    if (!lazy || typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isInView.value = true;
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px' }
    );

    if (imgRef.value) {
      observer.observe(imgRef.value);
    }

    cleanup(() => observer.disconnect());
  });

  // Build optimized image options
  const imageOptions: ImageTransformOptions = optimize
    ? {
        width,
        height,
        fit,
        gravity,
        quality,
        format: format || getBestFormat(),
      }
    : {};

  // Get optimized URLs
  const optimizedSrc = optimize ? buildImageUrl(src, imageOptions) : src;
  const srcSet = optimize && width ? generateSrcSet(src, { src, quality, format: format || 'auto' }) : undefined;
  const sizesAttr = sizes || generateSizes(sizes);
  const placeholderSrc = blurPlaceholder ? getBlurPlaceholderUrl(src) : undefined;

  // Current src to display
  const currentSrc = isInView.value ? optimizedSrc : (placeholderSrc || optimizedSrc);

  return (
    <img
      ref={imgRef}
      src={currentSrc}
      srcset={isInView.value ? srcSet : undefined}
      sizes={sizesAttr}
      alt={alt}
      title={title}
      width={width}
      height={height}
      class={`${className} ${isLoaded.value ? 'loaded' : 'loading'} ${blurPlaceholder && !isLoaded.value ? 'blur' : ''}`}
      loading={lazy ? 'lazy' : priority === 'high' ? 'eager' : 'lazy'}
      decoding="async"
      onLoad$={() => {
        isLoaded.value = true;
      }}
      onClick$={onClick$}
      style={{
        transition: blurPlaceholder ? 'filter 0.3s ease-in-out' : undefined,
        filter: blurPlaceholder && !isLoaded.value ? 'blur(20px)' : undefined,
      }}
    />
  );
});

/**
 * CloudflareR2Image with aspect ratio container
 */
export interface R2ImageWithAspectRatioProps extends CloudflareR2ImageProps {
  aspectRatio?: string; // e.g., "16/9", "4/3", "1/1"
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

export const CloudflareR2ImageWithAspectRatio = component$<R2ImageWithAspectRatioProps>((props) => {
  const { aspectRatio = '16/9', objectFit = 'cover', class: className, ...imageProps } = props;

  return (
    <div
      class="relative w-full"
      style={{
        aspectRatio,
      }}
    >
      <img
        {...imageProps as any}
        class={`absolute inset-0 w-full h-full ${className || ''}`}
        style={{
          objectFit,
        }}
      />
    </div>
  );
});
