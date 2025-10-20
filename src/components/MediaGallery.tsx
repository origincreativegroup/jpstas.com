import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';
import type { Media } from '~/types/case-study';
import { CloudflareStreamPlayer } from '~/components/CloudflareStreamPlayer';
import { VideoPlayer } from '~/components/VideoPlayer';

interface MediaGalleryProps {
  media: Media[];
  initialIndex?: number;
}

export const MediaGallery = component$<MediaGalleryProps>(({ media, initialIndex = 0 }) => {
  const isOpen = useSignal(false);
  const currentIndex = useSignal(initialIndex);
  const touchStartX = useSignal(0);
  const touchEndX = useSignal(0);

  const openGallery = $((index: number) => {
    currentIndex.value = index;
    isOpen.value = true;
    // Prevent background scrolling
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  });

  const closeGallery = $(() => {
    isOpen.value = false;
    // Restore background scrolling
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  });

  const nextMedia = $(() => {
    currentIndex.value = (currentIndex.value + 1) % media.length;
  });

  const prevMedia = $(() => {
    currentIndex.value = (currentIndex.value - 1 + media.length) % media.length;
  });

  const handleTouchStart = $((e: TouchEvent) => {
    touchStartX.value = e.touches[0].clientX;
  });

  const handleTouchMove = $((e: TouchEvent) => {
    touchEndX.value = e.touches[0].clientX;
  });

  const handleTouchEnd = $(() => {
    if (touchStartX.value - touchEndX.value > 50) {
      nextMedia();
    }
    if (touchEndX.value - touchStartX.value > 50) {
      prevMedia();
    }
  });

  // Keyboard navigation and scroll lock cleanup
  useVisibleTask$(({ cleanup }) => {
    if (typeof window === 'undefined') return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen.value) return;
      
      if (e.key === 'Escape') {
        closeGallery();
      } else if (e.key === 'ArrowRight') {
        currentIndex.value = (currentIndex.value + 1) % media.length;
      } else if (e.key === 'ArrowLeft') {
        currentIndex.value = (currentIndex.value - 1 + media.length) % media.length;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    cleanup(() => {
      window.removeEventListener('keydown', handleKeyDown);
      // Ensure scroll is restored on cleanup
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    });
  });

  const getThumbnailSrc = (item: Media) => {
    if (item.type === 'video') {
      return item.poster || `https://placehold.co/300x300/2E3192/FFFFFF?text=Video`;
    }
    return item.src;
  };

  const renderMediaItem = (item: Media, isThumbnail = false) => {
    if (item.type === 'video') {
      // Check if it's a Cloudflare Stream video ID (32 char hex) or iframe URL
      const videoIdMatch = item.src.match(/([a-f0-9]{32})/i);
      const isCloudflareStream = videoIdMatch !== null || item.src.includes('cloudflarestream.com');
      const videoId = videoIdMatch ? videoIdMatch[1] : item.src;
      
      if (isThumbnail) {
        return (
          <div class="relative aspect-square overflow-hidden rounded-xl bg-neutral/20">
            <img
              src={getThumbnailSrc(item)}
              alt={item.alt || 'Video thumbnail'}
              class="h-full w-full object-cover"
              loading="lazy"
            />
            {/* Video play icon overlay */}
            <div class="absolute inset-0 flex items-center justify-center bg-charcoal/20">
              <div class="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                <svg class="w-6 h-6 text-charcoal ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div class="w-full">
          {isCloudflareStream ? (
            <div class="relative w-full overflow-hidden rounded-2xl bg-charcoal shadow-2xl">
              <div class="relative w-full" style="padding-bottom: 56.25%;">
                <iframe
                  src={`https://customer-h044ipu9nb6m47zm.cloudflarestream.com/${videoId}/iframe?${new URLSearchParams({
                    poster: item.poster || `https://customer-h044ipu9nb6m47zm.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg`,
                    autoplay: 'false',
                    loop: 'false',
                    muted: 'false',
                    controls: 'true',
                  }).toString()}`}
                  style="border: none; position: absolute; top: 0; left: 0; height: 100%; width: 100%;"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullscreen={true}
                  loading="lazy"
                  title={item.caption || 'Video player'}
                />
              </div>
            </div>
          ) : (
            <VideoPlayer
              src={item.src}
              poster={item.poster}
              title={item.caption}
            />
          )}
        </div>
      );
    }

    // Image handling
    if (isThumbnail) {
      return (
        <img
          src={item.src}
          alt={item.alt || 'Gallery image'}
          class="h-full w-full object-cover"
          loading="lazy"
        />
      );
    }

    return (
      <img
        src={item.src}
        alt={item.alt || 'Gallery image'}
        class="max-h-[80vh] w-auto rounded-lg shadow-2xl"
      />
    );
  };

  return (
    <div>
      {/* Thumbnail Grid */}
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map((item, index) => (
          <button
            key={index}
            onClick$={() => openGallery(index)}
            class="group relative aspect-square overflow-hidden rounded-xl bg-neutral/20 transition-all duration-300 hover:scale-105 hover:shadow-xl focus:ring-2 focus:ring-primary"
          >
            {renderMediaItem(item, true)}
            <div class="absolute inset-0 bg-charcoal/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div class="absolute bottom-3 left-3 right-3">
                <p class="text-sm font-medium text-white line-clamp-2">{item.alt}</p>
                {item.type === 'video' && (
                  <div class="flex items-center gap-1 mt-1">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    <span class="text-xs text-white/80">Video</span>
                  </div>
                )}
              </div>
            </div>
            {/* Expand Icon */}
            <div class="absolute right-2 top-2 rounded-full bg-white/90 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <svg class="h-4 w-4 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {isOpen.value && (
        <div
          class="fixed inset-0 z-[9999] flex items-center justify-center bg-charcoal/95 backdrop-blur-sm animate-fadeIn"
          onClick$={closeGallery}
          onTouchStart$={handleTouchStart}
          onTouchMove$={handleTouchMove}
          onTouchEnd$={handleTouchEnd}
        >
          {/* Close Button */}
          <button
            onClick$={closeGallery}
            class="absolute right-6 top-20 z-[10000] rounded-full bg-white/20 p-4 text-white backdrop-blur-md transition-all hover:bg-white/30 hover:scale-110 shadow-lg"
            aria-label="Close gallery"
          >
            <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Media Counter */}
          <div class="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
            {currentIndex.value + 1} / {media.length}
            {media[currentIndex.value].type === 'video' && (
              <span class="ml-2 text-xs opacity-75">Video</span>
            )}
          </div>

          {/* Main Media Container */}
          <div
            class="relative flex h-full w-full items-center justify-center p-4 md:p-12"
            onClick$={(e) => e.stopPropagation()}
          >
            <div class="relative max-h-[90vh] max-w-6xl w-full animate-scaleIn">
              {renderMediaItem(media[currentIndex.value])}
              
              {/* Caption */}
              {media[currentIndex.value].caption && (
                <div class="mt-4 rounded-lg bg-white/10 p-4 text-center backdrop-blur-md">
                  <p class="text-sm text-white md:text-base">{media[currentIndex.value].caption}</p>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            {media.length > 1 && (
              <>
                <button
                  onClick$={(e) => {
                    e.stopPropagation();
                    prevMedia();
                  }}
                  class="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-110 md:left-8"
                  aria-label="Previous media"
                >
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick$={(e) => {
                    e.stopPropagation();
                    nextMedia();
                  }}
                  class="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-110 md:right-8"
                  aria-label="Next media"
                >
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {media.length > 1 && (
            <div class="absolute bottom-4 left-1/2 z-10 flex max-w-full -translate-x-1/2 gap-2 overflow-x-auto rounded-lg bg-white/10 p-3 backdrop-blur-md">
              {media.map((item, index) => (
                <button
                  key={index}
                  onClick$={(e) => {
                    e.stopPropagation();
                    currentIndex.value = index;
                  }}
                  class={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                    index === currentIndex.value
                      ? 'border-primary scale-110'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  {renderMediaItem(item, true)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
