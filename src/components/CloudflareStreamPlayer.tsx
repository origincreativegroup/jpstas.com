import { component$ } from '@builder.io/qwik';

interface CloudflareStreamPlayerProps {
  videoId: string;
  poster?: string;
  title?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  fill?: boolean;
  aspectRatio?: string; // Aspect ratio (e.g., "9:16" for portrait, "16:9" for landscape)
  class?: string;
}

export const CloudflareStreamPlayer = component$<CloudflareStreamPlayerProps>(
  ({
    videoId,
    poster,
    title,
    autoplay = false,
    loop = false,
    muted = false,
    controls = true,
    fill = false,
    aspectRatio = '16:9',
    class: className,
  }) => {
    // Calculate padding-bottom percentage from aspect ratio
    const getAspectRatioPadding = (ratio: string): string => {
      const [width, height] = ratio.split(':').map(Number);
      return `${(height / width) * 100}%`;
    };
    
    // Build iframe URL with aspect ratio parameter to help Stream handle sizing
    const iframeParams = new URLSearchParams({
      poster:
        poster ||
        `https://customer-h044ipu9nb6m47zm.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg`,
      autoplay: autoplay ? 'true' : 'false',
      loop: loop ? 'true' : 'false',
      muted: muted ? 'true' : 'false',
      controls: controls ? 'true' : 'false',
    });
    
    const iframe = (
      <iframe
        src={`https://customer-h044ipu9nb6m47zm.cloudflarestream.com/${videoId}/iframe?${iframeParams.toString()}`}
        style="border: none; position: absolute; top: 0; left: 0; height: 100%; width: 100%; object-fit: contain;"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullscreen={true}
        loading="lazy"
        title={title || 'Video player'}
      />
    );

    return (
      <div
        class={[
          'relative mx-auto w-full overflow-hidden rounded-2xl bg-surface-mid shadow-[0_35px_80px_rgba(0,0,0,0.45)] z-10',
          className,
        ].join(' ')}
      >
        {fill ? (
          <div class="absolute inset-0 z-10">{iframe}</div>
        ) : (
          <div class="relative w-full z-10" style={`padding-bottom: ${getAspectRatioPadding(aspectRatio)}`}>
            {iframe}
          </div>
        )}

        {title && (
          <div class="pointer-events-none absolute bottom-0 left-0 right-0 bg-surface-deep/80 p-6">
            <h3 class="text-cream text-xl font-bold drop-shadow-lg">{title}</h3>
          </div>
        )}
      </div>
    );
  },
);

