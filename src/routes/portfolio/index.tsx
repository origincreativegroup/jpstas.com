import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { BentoGrid } from '~/components/grid/BentoGrid';
import { getProjectSummary, type BentoItem, type BentoLayout } from '~/lib/content';

const createPortfolioBentoItems = (): BentoItem[] => {
  const portfolioLayout: Array<{ slug: string; layout: BentoLayout }> = [
    {
      slug: 'caribbeanpools-redesign',
      layout: {
        md: { colSpan: 8, rowSpan: 2 },
        xl: { colSpan: 6, rowSpan: 2 },
      },
    },
    {
      slug: 'generative-ai',
      layout: {
        md: { colSpan: 4, rowSpan: 1 },
        xl: { colSpan: 3, rowSpan: 1 },
      },
    },
    {
      slug: 'motion-systems',
      layout: {
        md: { colSpan: 4, rowSpan: 2 },
        xl: { colSpan: 6, rowSpan: 2 },
      },
    },
    {
      slug: 'drone-media',
      layout: {
        md: { colSpan: 4, rowSpan: 1 },
        xl: { colSpan: 3, rowSpan: 1 },
      },
    },
    {
      slug: 'brand-evolution',
      layout: {
        md: { colSpan: 4, rowSpan: 1 },
        xl: { colSpan: 3, rowSpan: 1 },
      },
    },
    {
      slug: 'mixed-media',
      layout: {
        md: { colSpan: 4, rowSpan: 1 },
        xl: { colSpan: 3, rowSpan: 1 },
      },
    },
    {
      slug: 'print-studio',
      layout: {
        md: { colSpan: 4, rowSpan: 1 },
        xl: { colSpan: 3, rowSpan: 1 },
      },
    },
  ];

  return portfolioLayout
    .map((item) => {
      const project = getProjectSummary(item.slug);
      if (!project) return undefined;
      return {
        ...item,
        project,
      } as BentoItem;
    })
    .filter((item): item is BentoItem => Boolean(item));
};

export default component$(() => {
  const bentoItems = createPortfolioBentoItems();

  return (
    <main class="min-h-screen bg-surface-deep text-cream">
      <section class="relative overflow-hidden py-20 md:py-28">
        <div class="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 md:px-6 lg:px-8">
          <div class="space-y-6 max-w-3xl">
            <span class="font-montserrat text-sm font-semibold uppercase tracking-[0.35em] text-gold">
              Selected Work
            </span>
            <h1 class="font-montserrat text-4xl font-bold leading-tight text-cream md:text-5xl lg:text-6xl">
              Intelligent Systems for Human Creativity
            </h1>
            <p class="font-inter text-lg text-cream/75 md:text-xl">
            Most people drown in digital tools.  
            They chase the newest app, the latest cloud service, the hottest AI model.  
            Their world becomes more fragmented, not less. I build the opposite. 
            Designing cohesive systems where creativity, automation, and technology finally work in harmony. 
            </p>
          </div>
        </div>
      </section>

      <BentoGrid
        items={bentoItems}
        cta={{
          label: 'Start a project',
          href: '/contact',
        }}
      />
    </main>
  );
});

export const head: DocumentHead = {
  title: 'Work & Case Studies – John P. Stas',
  meta: [
    {
      name: 'description',
      content:
        'Browse systems-driven case studies spanning brand evolution, generative AI, motion design, mixed media, and large-format print operations from John P. Stas.',
    },
  ],
};
