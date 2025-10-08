import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  category?: string;
}

interface MasonryGalleryProps {
  images: GalleryImage[];
  columns?: number;
  gap?: number;
  className?: string;
  showCaptions?: boolean;
  enableLightbox?: boolean;
  filterByCategory?: boolean;
}

export default function MasonryGallery({
  images,
  columns = 3,
  gap = 16,
  className = '',
  showCaptions = true,
  enableLightbox = true,
  filterByCategory = false
}: MasonryGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [imageColumns, setImageColumns] = useState<GalleryImage[][]>([]);

  React.useEffect(() => {
    // Filter images by category
    const filteredImages = selectedCategory === 'all'
      ? images
      : images.filter(img => img.category === selectedCategory);

    // Distribute images into columns
    const cols: GalleryImage[][] = Array.from({ length: columns }, () => []);
    filteredImages.forEach((img, index) => {
      const col = cols[index % columns];
      if (col) {
        col.push(img);
      }
    });
    setImageColumns(cols);
  }, [images, columns, selectedCategory]);

  const categories = React.useMemo(() => {
    const cats = new Set(images.map(img => img.category).filter(Boolean));
    return Array.from(cats) as string[];
  }, [images]);

  const handleImageClick = (image: GalleryImage) => {
    if (enableLightbox) {
      setSelectedImage(image);
    }
  };

  const handleCloseLightbox = () => {
    setSelectedImage(null);
  };

  const handleNext = () => {
    if (!selectedImage) return;
    const currentIndex = images.findIndex(img => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % images.length;
    const nextImage = images[nextIndex];
    if (nextImage) {
      setSelectedImage(nextImage);
    }
  };

  const handlePrevious = () => {
    if (!selectedImage) return;
    const currentIndex = images.findIndex(img => img.id === selectedImage.id);
    const previousIndex = (currentIndex - 1 + images.length) % images.length;
    const prevImage = images[previousIndex];
    if (prevImage) {
      setSelectedImage(prevImage);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" } as any
    }
  };

  return (
    <div className={className}>
      {/* Category Filter */}
      {filterByCategory && categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Masonry Grid */}
      <motion.div
        className="flex gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {imageColumns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex-1 flex flex-col" style={{ gap: `${gap}px` }}>
            {column.map((image) => (
              <motion.div
                key={image.id}
                className="group relative cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                variants={itemVariants}
                onClick={() => handleImageClick(image)}
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    {showCaptions && image.caption && (
                      <p className="text-sm font-medium">{image.caption}</p>
                    )}
                  </div>

                  {/* View icon */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseLightbox}
          >
            <button
              onClick={handleCloseLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Close lightbox"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Previous button */}
            <button
              onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
              className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Previous image"
            >
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next button */}
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Next image"
            >
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Image */}
            <motion.div
              className="relative max-w-7xl max-h-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.alt}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />

              {/* Caption */}
              {showCaptions && selectedImage.caption && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-white text-center font-medium">{selectedImage.caption}</p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
