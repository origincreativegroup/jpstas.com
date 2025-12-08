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
      return item.poster || `https://placehold.co/300x300/b98f45/f2efe6?text=Video`;
    }
    return item.src;
  };

  const renderMediaItem = (item: Media, isThumbnail = false) => {
    if (item.type === 'video') {
      // Check if it's a Cloudflare Stream video ID (32 char hex) or iframe URL
      const videoIdMatch = item.src.match(/([a-f0-9]{32})/i);
      const isCloudflareStream = videoIdMatch !== null || item.src.includes('cloudflarestream.com');
      const videoId = videoIdMatch ? videoIdMatch[1] : item.src;
      
      const aspectRatio = item.aspectRatio || '16:9';
      
      if (isThumbnail) {
        // Determine thumbnail aspect class based on video aspect ratio
        const isVertical = aspectRatio === '9:16' || aspectRatio === '1:2' || aspectRatio === '3:4';
        const thumbnailAspectClass = isVertical ? 'aspect-[9/16]' : 'aspect-square';
        
        return (
          <div class={`relative ${thumbnailAspectClass} overflow-hidden rounded-xl bg-surface-mid/40`}>
            <img
              src={getThumbnailSrc(item)}
              alt={item.alt || 'Video thumbnail'}
              class="h-full w-full object-cover"
              loading="lazy"
            />
            {/* Video play icon overlay */}
            <div class="absolute inset-0 flex items-center justify-center bg-surface-deep/40">
              <div class="w-12 h-12 rounded-full bg-cream/90 flex items-center justify-center">
                <svg class="w-6 h-6 text-surface-deep ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </div>
        );
      }

      // Calculate padding-bottom percentage from aspect ratio
      const getAspectRatioPadding = (ratio: string = '16:9'): string => {
        const [width, height] = ratio.split(':').map(Number);
        return `${(height / width) * 100}%`;
      };
      
      // For the main player, use a more flexible container that adapts to content
      // If aspectRatio is provided, use it; otherwise let the video determine its own size
      return (
        <div class="w-full flex items-center justify-center">
          {isCloudflareStream ? (
            <div class="w-full max-w-full">
              <CloudflareStreamPlayer
                videoId={videoId}
                poster={item.poster}
                title={item.caption}
                aspectRatio={aspectRatio}
              />
            </div>
          ) : (
            <div class="w-full max-w-full">
              <VideoPlayer
                src={item.src}
                poster={item.poster}
                title={item.caption}
                aspectRatio={aspectRatio}
              />
            </div>
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
        class="max-h-[85vh] max-w-full w-auto mx-auto rounded-lg shadow-2xl"
      />
    );
  };

  return (
    <div>
      {/* Thumbnail Grid */}
      <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {media.map((item, index) => {
          // Determine aspect class based on media type and aspect ratio
          const isVerticalVideo = item.type === 'video' && (item.aspectRatio === '9:16' || item.aspectRatio === '1:2' || item.aspectRatio === '3:4');
          const aspectClass = isVerticalVideo ? 'aspect-[9/16]' : 'aspect-square';
          
          return (
            <button
              key={index}
              onClick$={() => openGallery(index)}
              class={`group relative ${aspectClass} overflow-hidden rounded-xl bg-surface-mid/40 transition-all duration-300 hover:scale-105 hover:shadow-[0_25px_50px_rgba(0,0,0,0.35)] focus:ring-2 focus:ring-gold/50`}
            >
              {renderMediaItem(item, true)}
            <div class="absolute inset-0 bg-surface-deep/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div class="absolute bottom-3 left-3 right-3">
                <p class="text-sm font-medium text-cream line-clamp-2">{item.alt}</p>
                {item.type === 'video' && (
                  <div class="flex items-center gap-1 mt-1">
                    <svg class="w-3 h-3 text-cream" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    <span class="text-xs text-cream/80">Video</span>
                  </div>
                )}
              </div>
            </div>
            {/* Expand Icon */}
            <div class="absolute right-2 top-2 rounded-full bg-cream/90 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <svg class="h-4 w-4 text-surface-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
            </div>
          </button>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {isOpen.value && (
        <div
          class="fixed inset-0 z-[9999] flex items-center justify-center bg-surface-deep/95 backdrop-blur-sm animate-fadeIn"
          onClick$={closeGallery}
          onTouchStart$={handleTouchStart}
          onTouchMove$={handleTouchMove}
          onTouchEnd$={handleTouchEnd}
        >
          {/* Close Button */}
          <button
            onClick$={closeGallery}
            class="absolute right-6 top-20 z-[10000] rounded-full bg-cream/15 p-4 text-cream backdrop-blur-md transition-all hover:bg-cream/25 hover:scale-110 shadow-lg"
            aria-label="Close gallery"
          >
            <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Media Counter */}
          <div class="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-cream/10 px-4 py-2 text-sm font-medium text-cream backdrop-blur-md">
            {currentIndex.value + 1} / {media.length}
            {media[currentIndex.value].type === 'video' && (
              <span class="ml-2 text-xs opacity-75">Video</span>
            )}
          </div>

          {/* Main Media Container */}
          <div
            class="relative flex h-full w-full items-center justify-center p-4 md:p-12 pointer-events-none"
          >
            {(() => {
              const currentMedia = media[currentIndex.value];
              const isVerticalVideo = currentMedia.type === 'video' && (currentMedia.aspectRatio === '9:16' || currentMedia.aspectRatio === '1:2' || currentMedia.aspectRatio === '3:4');
              const containerClass = isVerticalVideo 
                ? 'relative max-h-[90vh] w-full max-w-md animate-scaleIn flex flex-col items-center pointer-events-auto'
                : 'relative max-h-[90vh] w-full max-w-6xl animate-scaleIn flex flex-col items-center pointer-events-auto';
              
              return (
                <div class={containerClass} onClick$={(e) => e.stopPropagation()}>
                  <div class="relative z-10 w-full flex flex-col items-center">
                    {renderMediaItem(currentMedia)}
                  </div>
                  
                  {/* Caption */}
                  {currentMedia.caption && (
                    <div class="mt-4 rounded-lg bg-cream/10 p-4 text-center backdrop-blur-md relative z-10">
                      <p class="text-sm text-cream md:text-base">{currentMedia.caption}</p>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Navigation Buttons */}
            {media.length > 1 && (
              <>
                <button
                  onClick$={(e) => {
                    e.stopPropagation();
                    prevMedia();
                  }}
                  class="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-cream/10 p-3 text-cream backdrop-blur-md transition-all hover:bg-cream/20 hover:scale-110 md:left-8 pointer-events-auto"
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
                  class="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-cream/10 p-3 text-cream backdrop-blur-md transition-all hover:bg-cream/20 hover:scale-110 md:right-8 pointer-events-auto"
                  aria-label="Next media"
                >
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Thumbnail Strip */}
            {media.length > 1 && (
              <div class="absolute bottom-4 left-1/2 z-20 flex max-w-full -translate-x-1/2 gap-2 overflow-x-auto rounded-lg bg-cream/10 p-3 backdrop-blur-md pointer-events-auto">
                {media.map((item, index) => {
                  // Determine thumbnail size based on aspect ratio
                  const isVerticalVideo = item.type === 'video' && (item.aspectRatio === '9:16' || item.aspectRatio === '1:2' || item.aspectRatio === '3:4');
                  const thumbnailSizeClass = isVerticalVideo ? 'h-20 w-11' : 'h-16 w-16';
                  
                  return (
                    <button
                      key={index}
                      onClick$={(e) => {
                        e.stopPropagation();
                        currentIndex.value = index;
                      }}
                      class={`${thumbnailSizeClass} flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                        index === currentIndex.value
                          ? 'border-primary scale-110'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      {renderMediaItem(item, true)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});
