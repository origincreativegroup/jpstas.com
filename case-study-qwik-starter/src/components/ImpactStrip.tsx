import { component$ } from '@builder.io/qwik';
import type { CaseStudy } from '~/types';

export const ImpactStrip = component$(({ data }: { data: CaseStudy }) => {
  const items = data.impact.length ? data.impact : data.metrics;
  return (
    <section class="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
      <h2 class="text-2xl font-bold mb-3">Impact</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((m, i) => (
          <div key={i} class="rounded-lg border px-4 py-5 text-center">
            <div class="text-2xl font-extrabold">{m.value}</div>
            <div class="text-xs uppercase tracking-wide text-gray-500">{m.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
});
