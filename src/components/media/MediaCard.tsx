import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import type { MediaAsset, ProjectSummary } from '~/lib/content';
import { useInView } from '~/hooks/useInView';

type MediaCardProps = {
  project: ProjectSummary;
  media?: MediaAsset;
  class?: string;
};

export const MediaCard = component$<MediaCardProps>(({ project, media = project.thumbnail, class: className }) => {
  const { target, inView } = useInView<HTMLAnchorElement>({ threshold: 0.5 });
  const videoRef = useSignal<HTMLVideoElement>();

  useVisibleTask$(({ track }) => {
    const isVisible = track(() => inView.value);
    const videoEl = track(() => videoRef.value);
    if (!videoEl || (media.type && media.type !== 'video')) {
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
        'group relative flex h-full flex-col overflow-hidden rounded-3xl bg-sand shadow-[0_24px_60px_rgba(0,0,0,0.25)] ring-1 ring-surface-deep/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(185,143,69,0.25)] focus-visible:-translate-y-1 focus-visible:shadow-[0_30px_70px_rgba(185,143,69,0.25)] focus-visible:outline-none',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div class="relative aspect-[4/3] overflow-hidden">
        {media.type === 'video' ? (
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
        <span class="pointer-events-none absolute inset-0 bg-[rgba(108,55,39,0)] transition-colors duration-500 group-hover:bg-[rgba(108,55,39,0.2)]" />
      </div>
      <div class="flex flex-1 flex-col gap-2 p-6">
        <span class="text-xs font-semibold uppercase tracking-[0.3em] text-surface-olive">{project.category}</span>
        <h3 class="font-montserrat text-xl font-semibold text-surface-deep md:text-2xl">{project.title}</h3>
        <p class="font-inter text-sm text-surface-deep/70">{project.summary}</p>
      </div>
    </a>
  );
});


