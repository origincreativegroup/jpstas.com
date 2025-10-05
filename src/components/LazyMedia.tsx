import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MediaFile } from '@/types/media';
import VideoPlayer from '@/components/VideoPlayer';

interface LazyMediaProps {
  mediaFile: MediaFile;
  className?: string;
  placeholder?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  // Image specific props
  alt?: string;
  sizes?: string;
  // Video specific props
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  showThumbnail?: boolean;
}

export default function LazyMedia({
  mediaFile,
  className = '',
  placeholder,
  threshold = 0.1,
  rootMargin = '50px',
  onLoad,
  onError,
  alt,
  sizes,
  autoplay = false,
  controls = true,
  muted = false,
  loop = false,
  showThumbnail = true,
}: LazyMediaProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Default placeholder
  const defaultPlaceholder = (
    <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 mx-auto mb-2 text-neutral-400">
          {mediaFile.type.startsWith('image/') ? (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          ) : mediaFile.type.startsWith('video/') ? (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          ) : (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          )}
        </div>
        <div className="animate-pulse">
          <div className="h-2 bg-neutral-200 rounded w-16 mx-auto"></div>
        </div>
      </div>
    </div>
  );

  // Intersection Observer callback
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && !isInView) {
        setIsInView(true);
        setIsLoading(true);
      }
    },
    [isInView]
  );

  // Set up intersection observer
  useEffect(() => {
    if (!elementRef.current) return;

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observerRef.current.observe(elementRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, threshold, rootMargin]);

  // Handle load events
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(
    (error: Error) => {
      setHasError(true);
      setIsLoading(false);
      onError?.(error);
    },
    [onError]
  );

  // Render content based on media type and loading state
  const renderContent = () => {
    if (hasError) {
      return (
        <div className="w-full h-full bg-red-50 flex items-center justify-center">
          <div className="text-center text-red-600">
            <div className="w-8 h-8 mx-auto mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-sm">Failed to load</p>
          </div>
        </div>
      );
    }

    if (!isInView || isLoading) {
      return placeholder || defaultPlaceholder;
    }

    if (mediaFile.type.startsWith('image/')) {
      return (
        <LazyImage
          mediaFile={mediaFile}
          alt={alt || mediaFile.alt || mediaFile.name}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          className={className}
        />
      );
    }

    if (mediaFile.type.startsWith('video/')) {
      return (
        <LazyVideo
          mediaFile={mediaFile}
          autoplay={autoplay}
          controls={controls}
          muted={muted}
          loop={loop}
          showThumbnail={showThumbnail}
          onLoad={handleLoad}
          onError={handleError}
          className={className}
        />
      );
    }

    // Fallback for other file types
    return (
      <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-2 text-neutral-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-xs text-neutral-500 truncate max-w-full px-2">
            {mediaFile.name}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div ref={elementRef} className={`relative ${className}`}>
      {renderContent()}
    </div>
  );
}

// Lazy Image Component
interface LazyImageProps {
  mediaFile: MediaFile;
  alt: string;
  sizes?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  className?: string;
}

function LazyImage({
  mediaFile,
  alt,
  sizes,
  onLoad,
  onError,
  className = '',
}: LazyImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleImageError = () => {
    setImageError(true);
    onError?.(new Error('Failed to load image'));
  };

  if (imageError) {
    return (
      <div className="w-full h-full bg-red-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <div className="w-8 h-8 mx-auto mb-2">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-sm">Image failed to load</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {!imageLoaded && (
        <div className="absolute inset-0 bg-neutral-100 animate-pulse" />
      )}
      <img
        src={mediaFile.url}
        alt={alt}
        sizes={sizes}
        loading="lazy"
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}

// Lazy Video Component
interface LazyVideoProps {
  mediaFile: MediaFile;
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  showThumbnail?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  className?: string;
}

function LazyVideo({
  mediaFile,
  autoplay = false,
  controls = true,
  muted = false,
  loop = false,
  showThumbnail = true,
  onLoad,
  onError,
  className = '',
}: LazyVideoProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const handleVideoLoad = () => {
    setVideoLoaded(true);
    onLoad?.();
  };

  const handleVideoError = () => {
    setVideoError(true);
    onError?.(new Error('Failed to load video'));
  };

  if (videoError) {
    return (
      <div className="w-full h-full bg-red-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <div className="w-8 h-8 mx-auto mb-2">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-sm">Video failed to load</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {!videoLoaded && (
        <div className="absolute inset-0 bg-neutral-100 animate-pulse" />
      )}
      <VideoPlayer
        mediaFile={mediaFile}
        autoplay={autoplay}
        controls={controls}
        muted={muted}
        loop={loop}
        showThumbnail={showThumbnail}
        onPlay={handleVideoLoad}
        onEnded={handleVideoLoad}
        className={`w-full h-full transition-opacity duration-300 ${
          videoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}

// Hook for lazy loading
export function useLazyLoading(
  threshold: number = 0.1,
  rootMargin: string = '50px'
) {
  const [isInView, setIsInView] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observerRef.current = observer;
    observer.observe(elementRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin]);

  return { elementRef, isInView };
}

export default LazyMedia;
