import { component$ } from '@builder.io/qwik';

interface CloudflareStreamPlayerProps {
  videoId: string;
  poster?: string;
  title?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
}

export const CloudflareStreamPlayer = component$<CloudflareStreamPlayerProps>(({
  videoId,
  poster,
  title,
  autoplay = false,
  loop = false,
  muted = false,
  controls = true,
}) => {
  return (
    <div class="relative mx-auto w-full max-w-4xl overflow-hidden rounded-2xl bg-surface-mid shadow-[0_35px_80px_rgba(0,0,0,0.45)]">
      <div class="relative w-full" style="padding-bottom: 56.25%;">
        <iframe
          src={`https://customer-h044ipu9nb6m47zm.cloudflarestream.com/${videoId}/iframe?${new URLSearchParams({
            poster: poster || `https://customer-h044ipu9nb6m47zm.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg`,
            autoplay: autoplay ? 'true' : 'false',
            loop: loop ? 'true' : 'false',
            muted: muted ? 'true' : 'false',
            controls: controls ? 'true' : 'false',
          }).toString()}`}
          style="border: none; position: absolute; top: 0; left: 0; height: 100%; width: 100%;"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullscreen={true}
          loading="lazy"
          title={title || 'Video player'}
        />
      </div>
      
      {/* Title Overlay */}
      {title && (
        <div class="pointer-events-none absolute bottom-0 left-0 right-0 bg-surface-deep/80 p-6">
          <h3 class="text-cream text-xl font-bold drop-shadow-lg">{title}</h3>
        </div>
      )}
    </div>
  );
});

