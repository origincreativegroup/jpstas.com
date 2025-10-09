import { component$ } from '@builder.io/qwik';
import type { CaseStudy } from '~/types';

export const RelatedCarousel = component$(({ data }: { data: CaseStudy }) => {
  if (!data.related?.length) return null as any;
  return (
    <section class="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
      <h2 class="text-2xl font-bold mb-3">Related Work</h2>
      <div class="grid md:grid-cols-3 gap-4">
        {data.related.map((r) => (
          <a key={r.href} href={r.href} class="rounded-lg border p-4 hover:bg-gray-50">
            <div class="font-semibold">{r.title}</div>
            <div class="text-xs text-blue-600">View →</div>
          </a>
        ))}
      </div>
    </section>
  );
});
