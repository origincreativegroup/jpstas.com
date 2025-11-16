import { component$ } from '@builder.io/qwik';
import type { BentoItem } from '~/lib/content';
import { MediaCard } from '~/components/media/MediaCard';

type BentoGridProps = {
  items: BentoItem[];
  cta: { label: string; href: string };
};

const mdColSpan: Record<number, string> = {
  4: 'md:col-span-4',
  8: 'md:col-span-8',
};

const xlColSpan: Record<number, string> = {
  3: 'xl:col-span-3',
  6: 'xl:col-span-6',
  12: 'xl:col-span-12',
};

const mdRowSpan: Record<number, string> = {
  1: 'md:row-span-1',
  2: 'md:row-span-2',
  3: 'md:row-span-3',
};

const xlRowSpan: Record<number, string> = {
  1: 'xl:row-span-1',
  2: 'xl:row-span-2',
  3: 'xl:row-span-3',
};

const createLayoutClasses = (layout: BentoItem['layout']) =>
  [
    'row-span-1',
    mdColSpan[layout.md.colSpan],
    mdRowSpan[layout.md.rowSpan],
    xlColSpan[layout.xl.colSpan],
    xlRowSpan[layout.xl.rowSpan],
  ]
    .filter(Boolean)
    .join(' ');

export const BentoGrid = component$<BentoGridProps>(({ items, cta }) => {
  return (
    <section class="bg-surface-mid py-16 md:py-24 text-cream">
      <div class="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 md:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-4 md:auto-rows-[240px] md:grid-cols-8 xl:auto-rows-[260px] xl:grid-cols-12">
          {items.map((item) => (
            <div key={item.slug} class={['col-span-1', createLayoutClasses(item.layout)].join(' ')}>
              <MediaCard project={item.project} />
            </div>
          ))}
        </div>
        <div class="flex justify-center">
          <a
            href={cta.href}
            class="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold px-6 py-3 font-montserrat text-sm font-semibold uppercase tracking-[0.3em] text-surface-deep transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(185,143,69,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold/60"
          >
            {cta.label}
          </a>
        </div>
      </div>
    </section>
  );
});


