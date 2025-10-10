import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  initialIndex?: number;
}

export const ImageGallery = component$<ImageGalleryProps>(({ images, initialIndex = 0 }) => {
  const isOpen = useSignal(false);
  const currentIndex = useSignal(initialIndex);
  const touchStartX = useSignal(0);
  const touchEndX = useSignal(0);

  const openGallery = $((index: number) => {
    currentIndex.value = index;
    isOpen.value = true;
  });

  const closeGallery = $(() => {
    isOpen.value = false;
  });

  const nextImage = $(() => {
    currentIndex.value = (currentIndex.value + 1) % images.length;
  });

  const prevImage = $(() => {
    currentIndex.value = (currentIndex.value - 1 + images.length) % images.length;
  });

  const handleTouchStart = $((e: TouchEvent) => {
    touchStartX.value = e.touches[0].clientX;
  });

  const handleTouchMove = $((e: TouchEvent) => {
    touchEndX.value = e.touches[0].clientX;
  });

  const handleTouchEnd = $(() => {
    if (touchStartX.value - touchEndX.value > 50) {
      nextImage();
    }
    if (touchEndX.value - touchStartX.value > 50) {
      prevImage();
    }
  });

  // Keyboard navigation
  useVisibleTask$(({ cleanup }) => {
    if (typeof window === 'undefined') return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen.value) return;
      
      if (e.key === 'Escape') {
        isOpen.value = false;
      } else if (e.key === 'ArrowRight') {
        currentIndex.value = (currentIndex.value + 1) % images.length;
      } else if (e.key === 'ArrowLeft') {
        currentIndex.value = (currentIndex.value - 1 + images.length) % images.length;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    cleanup(() => window.removeEventListener('keydown', handleKeyDown));
  });

  return (
    <div>
      {/* Thumbnail Grid */}
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick$={() => openGallery(index)}
            class="group relative aspect-square overflow-hidden rounded-xl bg-neutral/20 transition-all duration-300 hover:scale-105 hover:shadow-xl focus:ring-2 focus:ring-primary"
          >
            <img
              src={image.src}
              alt={image.alt}
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div class="absolute bottom-3 left-3 right-3">
                <p class="text-sm font-medium text-white line-clamp-2">{image.alt}</p>
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
          class="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/95 backdrop-blur-sm animate-fadeIn"
          onClick$={closeGallery}
          onTouchStart$={handleTouchStart}
          onTouchMove$={handleTouchMove}
          onTouchEnd$={handleTouchEnd}
        >
          {/* Close Button */}
          <button
            onClick$={closeGallery}
            class="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-110"
            aria-label="Close gallery"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image Counter */}
          <div class="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
            {currentIndex.value + 1} / {images.length}
          </div>

          {/* Main Image Container */}
          <div
            class="relative flex h-full w-full items-center justify-center p-4 md:p-12"
            onClick$={(e) => e.stopPropagation()}
          >
            <div class="relative max-h-full max-w-5xl animate-scaleIn">
              <img
                src={images[currentIndex.value].src}
                alt={images[currentIndex.value].alt}
                class="max-h-[80vh] w-auto rounded-lg shadow-2xl"
              />
              
              {/* Caption */}
              {images[currentIndex.value].caption && (
                <div class="mt-4 rounded-lg bg-white/10 p-4 text-center backdrop-blur-md">
                  <p class="text-sm text-white md:text-base">{images[currentIndex.value].caption}</p>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick$={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  class="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-110 md:left-8"
                  aria-label="Previous image"
                >
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick$={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  class="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-110 md:right-8"
                  aria-label="Next image"
                >
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div class="absolute bottom-4 left-1/2 z-10 flex max-w-full -translate-x-1/2 gap-2 overflow-x-auto rounded-lg bg-white/10 p-3 backdrop-blur-md">
              {images.map((image, index) => (
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
                  <img src={image.src} alt={image.alt} class="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});



