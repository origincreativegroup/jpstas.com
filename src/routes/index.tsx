import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { CarouselHero } from '~/components/carousel/CarouselHero';
import { BentoGrid } from '~/components/grid/BentoGrid';
import { MetricStrip } from '~/components/ui/MetricStrip';
import { getHomeContent } from '~/lib/content';

export default component$(() => {
  const home = getHomeContent();

  return (
    <main class="min-h-screen bg-surface-deep text-cream">
      <CarouselHero slides={home.hero} />
      <BentoGrid items={home.bento.items} cta={home.bento.cta} />
      <MetricStrip metrics={home.metrics} />
    </main>
  );
});

export const head: DocumentHead = () => {
  const home = getHomeContent();
  const firstSlide = home.hero[0];

  return {
    title: 'John P. Stas – Creative Technologist, Designer & Process Innovator',
    meta: [
    {
      name: 'description',
        content:
          'Portfolio of John P. Stas - Creative Technologist, Designer & Process Innovator specializing in brand systems, generative AI, motion design, web development, and operational excellence.',
      },
    ],
    links: firstSlide
      ? [
          {
            rel: 'preload',
            as: 'image',
            href: firstSlide.media.src,
          },
        ]
      : [],
  };
};


