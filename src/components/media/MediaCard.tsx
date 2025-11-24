import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import type { MediaAsset, ProjectSummary } from '~/lib/content';
import { useInView } from '~/hooks/useInView';
import { CloudflareStreamPlayer } from '~/components/CloudflareStreamPlayer';

type MediaCardProps = {
  project: ProjectSummary;
  media?: MediaAsset;
  class?: string;
};

export const MediaCard = component$<MediaCardProps>(({ project, media = project.thumbnail, class: className }) => {
  const { target, inView } = useInView<HTMLAnchorElement>({ threshold: 0.5 });
  const videoRef = useSignal<HTMLVideoElement>();

  // Check if it's a Cloudflare Stream video ID (32 char hex)
  const videoIdMatch = media.type === 'video' ? media.src.match(/([a-f0-9]{32})/i) : null;
  const isCloudflareStream = videoIdMatch !== null;
  const videoId = videoIdMatch ? videoIdMatch[1] : null;

  useVisibleTask$(({ track }) => {
    const isVisible = track(() => inView.value);
    const videoEl = track(() => videoRef.value);
    if (!videoEl || (media.type && media.type !== 'video') || isCloudflareStream) {
      return;
    }

    if (isVisible) {
      videoEl.play().catch(() => {
        /* no-op */
      });
    } else {
      videoEl.pause();
      videoEl.currentTime = 0;
    }
  });

  return (
    <a
      ref={target}
      href={`/portfolio/${project.slug}`}
      class={[
        'group relative flex h-full overflow-hidden rounded-3xl bg-sand shadow-[0_24px_60px_rgba(0,0,0,0.25)] ring-1 ring-surface-deep/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(185,143,69,0.25)] focus-visible:-translate-y-1 focus-visible:shadow-[0_30px_70px_rgba(185,143,69,0.25)] focus-visible:outline-none',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div class="absolute inset-0">
        {media.type === 'video' && isCloudflareStream && videoId ? (
          <CloudflareStreamPlayer
            videoId={videoId}
            poster={media.poster}
            autoplay={true}
            loop={true}
            muted={true}
            controls={false}
            fill={true}
            class="h-full w-full"
          />
        ) : media.type === 'video' ? (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            poster={media.poster}
            class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          >
            <source src={media.src} />
          </video>
        ) : (
          <img
            src={media.src}
            alt={media.alt ?? project.title}
            loading="lazy"
            class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <span class="pointer-events-none absolute inset-0 bg-[rgba(0,0,0,0)] transition-colors duration-500 group-hover:bg-[rgba(0,0,0,0.1)]" />
      </div>
      <div class="relative mt-auto flex w-full flex-col">
        <div class="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
        <div class="relative mt-auto w-full bg-cream/95 p-5 md:p-6 transform-gpu translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          <span class="text-xs font-semibold uppercase tracking-[0.3em] text-surface-olive">{project.category}</span>
          <h3 class="mt-1 font-montserrat text-xl font-semibold text-surface-deep md:text-2xl">{project.title}</h3>
          <p class="mt-1 line-clamp-3 font-inter text-sm text-surface-deep/70">{project.summary}</p>
        </div>
      </div>
    </a>
  );
});


