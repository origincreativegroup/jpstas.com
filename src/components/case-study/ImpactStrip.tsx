import { component$ } from '@builder.io/qwik';
import type { CaseStudy } from '~/types/case-study';

export const ImpactStrip = component$(({ data }: { data: CaseStudy }) => {
  const items = data.impact.length ? data.impact : data.metrics;
  return (
    <section class="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg p-8">
      <h2 class="text-3xl font-bold mb-6 text-white">Impact & Results</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((m, i) => (
          <div key={i} class="rounded-lg bg-white/10 backdrop-blur px-6 py-6 text-center border border-white/20">
            <div class="text-3xl md:text-4xl font-extrabold text-white mb-2">{m.value}</div>
            <div class="text-sm uppercase tracking-wide text-blue-100">{m.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
});

