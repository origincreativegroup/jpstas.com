/**
 * Cloudflare Stream Video Component
 *
 * Video player component for Cloudflare Stream
 * Works standalone and integrates with Builder.io visual editor
 */

import { component$, useSignal, type Signal } from '@builder.io/qwik';
import {
  buildStreamIframeUrl,
  getStreamThumbnailUrl,
  extractVideoIdFromUrl,
  isValidStreamVideoId,
  type StreamVideoOptions,
  ASPECT_RATIOS,
} from '~/lib/cloudflare-stream';

export interface CloudflareStreamVideoProps {
  /** Cloudflare Stream video ID or URL */
  videoId: string;

  /** Video title */
  title?: string;

  /** Custom poster image URL (overrides Stream thumbnail) */
  poster?: string;

  /** Aspect ratio (default: '16/9') */
  aspectRatio?: '16:9' | '4:3' | '1:1' | '9:16' | '21:9' | string;

  /** Autoplay video (default: false) */
  autoplay?: boolean;

  /** Loop video (default: false) */
  loop?: boolean;

  /** Muted by default (default: false) */
  muted?: boolean;

  /** Show player controls (default: true) */
  controls?: boolean;

  /** Preload strategy */
  preload?: 'auto' | 'metadata' | 'none';

  /** Player primary color (hex without #) */
  primaryColor?: string;

  /** Letterbox color for padding (hex without #) */
  letterboxColor?: string;

  /** CSS class names */
  class?: string;

  /** Allow fullscreen (default: true) */
  allowFullscreen?: boolean;

  /** Default text track language */
  defaultTextTrack?: string;

  /** Loading strategy */
  loading?: 'lazy' | 'eager';
}

/**
 * CloudflareStreamVideo Component
 *
 * Features:
 * - Cloudflare Stream iframe player
 * - Responsive aspect ratios
 * - Customizable controls and appearance
 * - Lazy loading support
 * - Automatic thumbnail poster
 * - Builder.io compatible
 *
 * @example
 * <CloudflareStreamVideo
 *   videoId="af4889355cd0d36bac6722871cb2bcb3"
 *   title="Demo Video"
 *   aspectRatio="16:9"
 *   autoplay={false}
 * />
 */
export const CloudflareStreamVideo = component$<CloudflareStreamVideoProps>((props) => {
  const {
    videoId: rawVideoId,
    title = 'Video',
    poster,
    aspectRatio = '16:9',
    autoplay = false,
    loop = false,
    muted = false,
    controls = true,
    preload = 'metadata',
    primaryColor,
    letterboxColor,
    class: className = '',
    allowFullscreen = true,
    defaultTextTrack,
    loading = 'lazy',
  } = props;

  // Extract video ID if URL was provided
  const videoId = extractVideoIdFromUrl(rawVideoId) || rawVideoId;

  // Validate video ID
  if (!videoId || !isValidStreamVideoId(videoId)) {
    return (
      <div class={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <p class="text-gray-600">Invalid Cloudflare Stream video ID: {rawVideoId}</p>
        <p class="text-sm text-gray-500 mt-2">
          Video ID should be a 32-character hexadecimal string
        </p>
      </div>
    );
  }

  const isLoaded = useSignal(false);

  // Build Stream options
  const streamOptions: StreamVideoOptions = {
    autoplay,
    loop,
    muted,
    preload,
    controls,
    defaultTextTrack,
    poster,
    primaryColor,
    letterboxColor,
  };

  // Get iframe URL
  const iframeUrl = buildStreamIframeUrl(videoId, streamOptions);

  // Get poster URL if not provided
  const posterUrl = poster || getStreamThumbnailUrl(videoId);

  // Get aspect ratio value
  const aspectRatioValue = ASPECT_RATIOS[aspectRatio as keyof typeof ASPECT_RATIOS] || aspectRatio;

  return (
    <div
      class={`relative w-full overflow-hidden rounded-lg bg-black ${className}`}
      style={{
        aspectRatio: aspectRatioValue,
      }}
    >
      {/* Poster image before video loads (for lazy loading) */}
      {loading === 'lazy' && !isLoaded.value && (
        <div
          class="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${posterUrl})`,
          }}
        >
          <div class="absolute inset-0 flex items-center justify-center bg-black/30">
            <button
              onClick$={() => {
                isLoaded.value = true;
              }}
              class="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
              aria-label={`Play ${title}`}
            >
              <svg
                class="w-8 h-8 text-gray-900 ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Cloudflare Stream iframe */}
      {(loading === 'eager' || isLoaded.value) && (
        <iframe
          src={iframeUrl}
          title={title}
          class="absolute inset-0 w-full h-full border-0"
          allow={`accelerometer; gyroscope; ${autoplay ? 'autoplay;' : ''} encrypted-media; picture-in-picture;`}
          allowFullscreen={allowFullscreen}
          loading={loading}
        />
      )}
    </div>
  );
});

/**
 * Stream Video Grid Component
 * Display multiple Stream videos in a grid
 */
export interface StreamVideoGridProps {
  videos: Array<{
    videoId: string;
    title?: string;
    poster?: string;
  }>;
  columns?: 1 | 2 | 3 | 4;
  aspectRatio?: CloudflareStreamVideoProps['aspectRatio'];
  class?: string;
}

export const StreamVideoGrid = component$<StreamVideoGridProps>((props) => {
  const { videos, columns = 2, aspectRatio = '16:9', class: className = '' } = props;

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div class={`grid gap-6 ${gridCols[columns]} ${className}`}>
      {videos.map((video) => (
        <CloudflareStreamVideo
          key={video.videoId}
          videoId={video.videoId}
          title={video.title}
          poster={video.poster}
          aspectRatio={aspectRatio}
        />
      ))}
    </div>
  );
});

/**
 * Stream Video with Custom Overlay
 */
export interface StreamVideoWithOverlayProps extends CloudflareStreamVideoProps {
  overlayTitle?: string;
  overlayDescription?: string;
  showOverlay?: Signal<boolean>;
}

export const StreamVideoWithOverlay = component$<StreamVideoWithOverlayProps>((props) => {
  const { overlayTitle, overlayDescription, showOverlay, ...videoProps } = props;

  const defaultShowOverlay = useSignal(true);
  const overlayVisible = showOverlay || defaultShowOverlay;

  return (
    <div class="relative">
      <CloudflareStreamVideo {...videoProps} />

      {overlayVisible.value && (overlayTitle || overlayDescription) && (
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <button
            onClick$={() => {
              overlayVisible.value = false;
            }}
            class="absolute top-4 right-4 text-white hover:text-gray-300"
            aria-label="Close overlay"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {overlayTitle && (
            <h3 class="text-white text-xl font-bold mb-2">{overlayTitle}</h3>
          )}

          {overlayDescription && (
            <p class="text-white/90 text-sm">{overlayDescription}</p>
          )}
        </div>
      )}
    </div>
  );
});
