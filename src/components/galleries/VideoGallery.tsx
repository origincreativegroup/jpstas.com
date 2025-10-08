import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface VideoItem {
  id: string;
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  duration?: string;
  category?: string;
  cloudflareId?: string; // For Cloudflare Stream integration
}

interface VideoGalleryProps {
  videos: VideoItem[];
  columns?: number;
  className?: string;
  layout?: 'grid' | 'list';
  autoplay?: boolean;
  showDescription?: boolean;
  useCloudflareStream?: boolean;
}

export default function VideoGallery({
  videos,
  columns = 3,
  className = '',
  layout = 'grid',
  autoplay = false,
  showDescription = true,
  useCloudflareStream = false
}: VideoGalleryProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [, setPlayingVideo] = useState<string | null>(null); // Used for video state management

  const handleVideoClick = (video: VideoItem) => {
    setSelectedVideo(video);
    setPlayingVideo(video.id);
  };

  const handleCloseLightbox = () => {
    setSelectedVideo(null);
    setPlayingVideo(null);
  };

  const getVideoEmbedUrl = (video: VideoItem) => {
    if (useCloudflareStream && video.cloudflareId) {
      return `https://iframe.cloudflare.stream/${video.cloudflareId}`;
    }
    return video.url;
  };

  const getThumbnailUrl = (video: VideoItem) => {
    if (video.thumbnail) return video.thumbnail;
    if (useCloudflareStream && video.cloudflareId) {
      return `https://videodelivery.net/${video.cloudflareId}/thumbnails/thumbnail.jpg`;
    }
    return '/images/placeholder.svg';
  };

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
      transition: { duration: 0.4, ease: "easeOut" } as any
    }
  };

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[Math.min(columns, 4)] || 'grid-cols-3';

  const renderGridLayout = () => (
    <motion.div
      className={`grid ${gridCols} gap-6`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {videos.map((video) => (
        <motion.div
          key={video.id}
          className="group cursor-pointer"
          variants={itemVariants}
          onClick={() => handleVideoClick(video)}
          whileHover={{ y: -5 }}
        >
          <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            {/* Thumbnail */}
            <div className="relative aspect-video bg-slate-200">
              <img
                src={getThumbnailUrl(video)}
                alt={video.title || 'Video thumbnail'}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Play button overlay */}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                  <svg className="w-8 h-8 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Duration badge */}
              {video.duration && (
                <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-semibold">
                  {video.duration}
                </div>
              )}
            </div>

            {/* Video info */}
            {(video.title || showDescription) && (
              <div className="p-4 bg-white">
                {video.title && (
                  <h4 className="font-semibold text-slate-800 mb-1 line-clamp-2">
                    {video.title}
                  </h4>
                )}
                {showDescription && video.description && (
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {video.description}
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  const renderListLayout = () => (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {videos.map((video) => (
        <motion.div
          key={video.id}
          className="group cursor-pointer bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          variants={itemVariants}
          onClick={() => handleVideoClick(video)}
          whileHover={{ x: 5 }}
        >
          <div className="flex gap-4">
            {/* Thumbnail */}
            <div className="relative w-64 flex-shrink-0">
              <div className="relative aspect-video bg-slate-200">
                <img
                  src={getThumbnailUrl(video)}
                  alt={video.title || 'Video thumbnail'}
                  className="w-full h-full object-cover"
                />

                {/* Play button overlay */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl">
                    <svg className="w-6 h-6 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* Duration badge */}
                {video.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-semibold">
                    {video.duration}
                  </div>
                )}
              </div>
            </div>

            {/* Video info */}
            <div className="flex-1 p-4">
              {video.title && (
                <h4 className="font-semibold text-lg text-slate-800 mb-2">
                  {video.title}
                </h4>
              )}
              {showDescription && video.description && (
                <p className="text-slate-600 line-clamp-3">
                  {video.description}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <div className={className}>
      {layout === 'grid' ? renderGridLayout() : renderListLayout()}

      {/* Video Lightbox */}
      <AnimatePresence>
        {selectedVideo && (
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
              aria-label="Close video"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Player */}
            <motion.div
              className="relative w-full max-w-6xl aspect-video"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {useCloudflareStream ? (
                <iframe
                  src={getVideoEmbedUrl(selectedVideo)}
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen
                />
              ) : (
                <video
                  src={selectedVideo.url}
                  controls
                  autoPlay={autoplay}
                  className="w-full h-full rounded-lg"
                >
                  Your browser does not support the video tag.
                </video>
              )}

              {/* Video info below player */}
              {(selectedVideo.title || selectedVideo.description) && (
                <motion.div
                  className="mt-4 text-white"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {selectedVideo.title && (
                    <h3 className="text-2xl font-bold mb-2">{selectedVideo.title}</h3>
                  )}
                  {selectedVideo.description && (
                    <p className="text-gray-300">{selectedVideo.description}</p>
                  )}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
