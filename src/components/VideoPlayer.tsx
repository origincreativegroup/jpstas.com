import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  autoplay?: boolean;
  loop?: boolean;
  aspectRatio?: string; // Aspect ratio (e.g., "9:16" for portrait, "16:9" for landscape)
  class?: string;
}

export const VideoPlayer = component$<VideoPlayerProps>(({ 
  src, 
  poster,
  title,
  autoplay = false,
  loop = false,
  aspectRatio = '16:9',
  class: className,
}) => {
  const isPlaying = useSignal(false);
  const showControls = useSignal(true);
  const videoRef = useSignal<HTMLVideoElement | undefined>(undefined);
  const detectedAspectRatio = useSignal<string | null>(null);

  // Calculate padding-bottom percentage from aspect ratio
  const getAspectRatioPadding = (ratio: string): string => {
    const [width, height] = ratio.split(':').map(Number);
    return `${(height / width) * 100}%`;
  };

  // Detect actual video aspect ratio from video element
  useVisibleTask$(({ track }) => {
    const video = track(() => videoRef.value);
    if (!video) return;

    const handleLoadedMetadata = () => {
      if (video.videoWidth && video.videoHeight) {
        // Calculate aspect ratio from actual video dimensions
        const ratio = video.videoWidth / video.videoHeight;
        // Determine if it's closer to 16:9 (landscape) or 9:16 (portrait)
        if (ratio > 1) {
          // Landscape - use actual ratio or round to 16:9
          const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
          const w = video.videoWidth;
          const h = video.videoHeight;
          const divisor = gcd(w, h);
          detectedAspectRatio.value = `${w / divisor}:${h / divisor}`;
        } else {
          // Portrait - use actual ratio or round to 9:16
          const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
          const w = video.videoWidth;
          const h = video.videoHeight;
          const divisor = gcd(w, h);
          detectedAspectRatio.value = `${w / divisor}:${h / divisor}`;
        }
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    // Also check if metadata is already loaded
    if (video.readyState >= 1) {
      handleLoadedMetadata();
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  });

  const effectiveAspectRatio = detectedAspectRatio.value || aspectRatio;

  return (
    <div class={['group relative w-full overflow-hidden rounded-2xl bg-charcoal shadow-2xl z-10', className].join(' ')}>
      {/* Video Element */}
      <div 
        class="relative w-full z-10" 
        style={`padding-bottom: ${getAspectRatioPadding(effectiveAspectRatio)}`}
        key={effectiveAspectRatio}
      >
        <video
          ref={(el) => (videoRef.value = el)}
          class="absolute top-0 left-0 w-full h-full object-contain z-10 bg-charcoal"
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
      </div>

      {/* Overlay with Play Button (shown when not playing) */}
      {!isPlaying.value && (
        <div class="absolute inset-0 flex items-center justify-center bg-charcoal/60 pointer-events-none">
          <div class="pointer-events-auto">
            <button
              onClick$={() => {
                if (videoRef.value) {
                  videoRef.value.play();
                }
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






