import { useState } from 'react';

interface Media {
  id: string;
  url: string;
  alt: string;
  caption: string;
  type?: 'image' | 'video';
}

interface MediaGalleryProps {
  images: Media[];
  className?: string;
}

export default function MediaGallery({ images, className = '' }: MediaGalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const openLightbox = (media: Media, index: number) => {
    setSelectedMedia(media);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedMedia(null);
  };

  const nextMedia = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    setSelectedMedia(images[nextIndex] || null);
  };

  const prevMedia = () => {
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setSelectedMedia(images[prevIndex] || null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextMedia();
    if (e.key === 'ArrowLeft') prevMedia();
  };

  return (
    <>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
        {images.map((media, index) => (
          <div
            key={media.id}
            className="group cursor-pointer relative overflow-hidden rounded-xl bg-neutral-100"
            onClick={() => openLightbox(media, index)}
          >
            <div className="aspect-video relative">
              {media.type === 'video' ? (
                <video
                  src={media.url}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  preload="metadata"
                />
              ) : (
                <img
                  src={media.url}
                  alt={media.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                    {media.type === 'video' ? (
                      <svg
                        className="w-6 h-6 text-neutral-800"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6 text-neutral-800"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {media.caption && (
              <div className="p-3">
                <p className="text-sm text-neutral-600">{media.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-neutral-300 transition-colors z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    prevMedia();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-neutral-300 transition-colors z-10"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  onClick={e => {
                    e.stopPropagation();
                    nextMedia();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-neutral-300 transition-colors z-10"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}

            <div className="relative max-w-full max-h-full" onClick={e => e.stopPropagation()}>
              {selectedMedia.type === 'video' ? (
                <video
                  src={selectedMedia.url}
                  className="max-w-full max-h-full object-contain"
                  controls
                  autoPlay
                />
              ) : (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.alt}
                  className="max-w-full max-h-full object-contain"
                />
              )}
              {selectedMedia.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4">
                  <p className="text-center">{selectedMedia.caption}</p>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={e => {
                      e.stopPropagation();
                      setCurrentIndex(index);
                      setSelectedMedia(images[index] || null);
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
