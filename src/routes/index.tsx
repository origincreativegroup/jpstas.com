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
    title: 'John P. Stas – Creative Systems & Experiential Design',
  meta: [
    {
      name: 'description',
        content:
          'Portfolio homepage for John P. Stas featuring immersive brand systems, generative AI experimentation, motion design, and mixed-media installations.',
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


