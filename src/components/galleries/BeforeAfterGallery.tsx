import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface BeforeAfterImage {
  id: string;
  before: string;
  after: string;
  alt: string;
  caption?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

interface BeforeAfterGalleryProps {
  images: BeforeAfterImage[];
  className?: string;
  layout?: 'grid' | 'carousel';
  defaultSliderPosition?: number; // 0-100
}

function BeforeAfterSlider({
  image,
  defaultPosition = 50
}: {
  image: BeforeAfterImage;
  defaultPosition?: number;
}) {
  const [sliderPosition, setSliderPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number, containerRect: DOMRect) => {
    const x = clientX - containerRect.left;
    const percentage = Math.max(0, Math.min(100, (x / containerRect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const containerRect = e.currentTarget.getBoundingClientRect();
    handleMove(e.clientX, containerRect);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const containerRect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    if (touch) {
      handleMove(touch.clientX, containerRect);
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="relative w-full aspect-video overflow-hidden rounded-lg cursor-ew-resize select-none"
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchStart={() => setIsDragging(true)}
      onTouchEnd={() => setIsDragging(false)}
    >
      {/* After Image (Full) */}
      <div className="absolute inset-0">
        <img
          src={image.after}
          alt={image.alt}
          className="w-full h-full object-cover"
          draggable={false}
        />
        {image.afterLabel && (
          <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {image.afterLabel || 'After'}
          </div>
        )}
      </div>

      {/* Before Image (Clipped) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={image.before}
          alt={image.alt}
          className="w-full h-full object-cover"
          draggable={false}
        />
        {image.beforeLabel && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {image.beforeLabel || 'Before'}
          </div>
        )}
      </div>

      {/* Slider */}
      <div
        className="absolute inset-y-0 w-1 bg-white shadow-lg"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
      </div>

      {/* Caption */}
      {image.caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <p className="text-white text-sm font-medium text-center">{image.caption}</p>
        </div>
      )}
    </div>
  );
}

export default function BeforeAfterGallery({
  images,
  className = '',
  layout = 'grid',
  defaultSliderPosition = 50
}: BeforeAfterGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" } as any
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (layout === 'carousel') {
    const currentImage = images[currentIndex];
    if (!currentImage) return null;
    
    return (
      <div className={`relative ${className}`}>
        <div className="relative">
          <BeforeAfterSlider
            image={currentImage}
            defaultPosition={defaultSliderPosition}
          />

          {images.length > 1 && (
            <>
              {/* Previous button */}
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-slate-700 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
                aria-label="Previous comparison"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Next button */}
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-slate-700 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
                aria-label="Next comparison"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'w-8 bg-blue-600'
                        : 'bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to comparison ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Grid layout
  return (
    <motion.div
      className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {images.map((image) => (
        <motion.div key={image.id} variants={itemVariants}>
          <BeforeAfterSlider
            image={image}
            defaultPosition={defaultSliderPosition}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
