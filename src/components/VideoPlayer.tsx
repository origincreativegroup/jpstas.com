import { component$, useSignal } from '@builder.io/qwik';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  autoplay?: boolean;
  loop?: boolean;
}

export const VideoPlayer = component$<VideoPlayerProps>(({ 
  src, 
  poster,
  title,
  autoplay = false,
  loop = false
}) => {
  const isPlaying = useSignal(false);
  const showControls = useSignal(true);

  return (
    <div class="group relative w-full overflow-hidden rounded-2xl bg-charcoal shadow-2xl">
      {/* Video Element */}
      <video
        class="w-full h-full object-cover"
        src={src}
        poster={poster}
        controls={showControls.value}
        autoplay={autoplay}
        loop={loop}
        onPlay$={() => (isPlaying.value = true)}
        onPause$={() => (isPlaying.value = false)}
        preload="metadata"
      >
        Your browser does not support the video tag.
      </video>

      {/* Overlay with Play Button (shown when not playing) */}
      {!isPlaying.value && (
        <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-charcoal/80 via-charcoal/40 to-transparent pointer-events-none">
          <div class="pointer-events-auto">
            <button
              onClick$={(e) => {
                const video = e.currentTarget.closest('div')?.previousElementSibling as HTMLVideoElement;
                if (video) video.play();
              }}
              class="flex items-center justify-center w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full shadow-2xl hover:bg-white hover:scale-110 transition-all duration-300 group"
              aria-label="Play video"
            >
              <svg class="w-8 h-8 text-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
          
          {/* Title Overlay */}
          {title && (
            <div class="absolute bottom-6 left-6 right-6">
              <h3 class="text-white text-2xl font-bold drop-shadow-lg">{title}</h3>
            </div>
          )}
        </div>
      )}

      {/* Video Quality Badge (optional) */}
      <div class="absolute top-4 right-4 glass rounded-lg px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <span class="text-xs font-semibold text-white">HD</span>
      </div>
    </div>
  );
});

