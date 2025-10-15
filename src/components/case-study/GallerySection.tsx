import { component$ } from '@builder.io/qwik';
import { ImageGallery, type GalleryImage } from '~/components/ImageGallery';

interface GallerySectionProps {
  images: GalleryImage[];
  layout?: 'grid' | 'masonry' | 'carousel';
  title?: string;
  description?: string;
}

export const GallerySection = component$<GallerySectionProps>(({ 
  images, 
  layout = 'grid',
  title,
  description 
}) => {
  return (
    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {(title || description) && (
        <div class="mb-8 text-center">
          {title && (
            <h2 class="mb-3 text-3xl font-bold text-charcoal lg:text-4xl">
              {title}
            </h2>
          )}
          {description && (
            <p class="mx-auto max-w-3xl text-lg text-charcoal/70">
              {description}
            </p>
          )}
        </div>
      )}

      {layout === 'grid' && (
        <ImageGallery images={images} />
      )}

      {layout === 'masonry' && (
        <div class="columns-1 gap-4 md:columns-2 lg:columns-3">
          {images.map((image, index) => (
            <div key={index} class="mb-4 break-inside-avoid">
              <div class="group relative overflow-hidden rounded-xl bg-neutral/20 shadow-lg transition-all duration-300 hover:shadow-2xl">
                <img
                  src={image.src}
                  alt={image.alt}
                  class="w-full transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {image.caption && (
                  <div class="absolute inset-x-0 bottom-0 bg-charcoal/80 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p class="text-sm text-white">{image.caption}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {layout === 'carousel' && (
        <div class="relative overflow-hidden rounded-2xl bg-neutral/5 p-8">
          <div class="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {images.map((image, index) => (
              <div
                key={index}
                class="flex-shrink-0 w-[85vw] md:w-[70vw] lg:w-[50vw] snap-center"
              >
                <div class="group relative overflow-hidden rounded-xl bg-white shadow-xl transition-all duration-300 hover:shadow-2xl">
                  <div class="aspect-video overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.alt}
                      class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  {(image.alt || image.caption) && (
                    <div class="p-6">
                      <h3 class="mb-2 text-lg font-semibold text-charcoal">{image.alt}</h3>
                      {image.caption && (
                        <p class="text-sm text-charcoal/70">{image.caption}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
});






