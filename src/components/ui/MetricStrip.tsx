import { component$ } from '@builder.io/qwik';
import type { MetricBlock } from '~/lib/content';

type MetricStripProps = {
  metrics: MetricBlock[];
};

export const MetricStrip = component$<MetricStripProps>(({ metrics }) => {
  if (!metrics?.length) {
    return null;
  }

  return (
    <section class="bg-surface-deep py-16 text-cream md:py-20">
      <div class="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 md:px-6 lg:px-8">
        <div class="grid gap-8 md:grid-cols-3">
          {metrics.map((metric) => (
            <article
              key={metric.title}
              class="flex flex-col gap-4 rounded-3xl border border-cream/10 bg-[#181c27]/80 p-8 backdrop-blur-sm ring-1 ring-black/20"
            >
              <h3 class="font-montserrat text-lg font-bold uppercase tracking-[0.35em] text-gold">
                {metric.title}
              </h3>
              <ul class="space-y-2 font-inter text-sm leading-relaxed text-cream/70">
                {metric.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});


