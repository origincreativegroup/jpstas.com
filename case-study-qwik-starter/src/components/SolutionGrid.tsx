import { component$ } from '@builder.io/qwik';
import type { CaseStudy } from '~/types';

export const SolutionGrid = component$(({ data }: { data: CaseStudy }) => {
  const g = data.solution;
  return (
    <section class="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
      <h2 class="text-2xl font-bold mb-3">Design & Solution</h2>
      <p class="text-gray-700">{g.approach}</p>
      {g.bullets && (
        <ul class="grid md:grid-cols-2 gap-2 mt-3">
          {g.bullets.map((b) => <li key={b} class="rounded-lg bg-gray-50 p-3">{b}</li>)}
        </ul>
      )}
      {g.beforeAfter && (
        <div class="grid md:grid-cols-2 gap-4 mt-4">
          <div class="space-y-2">
            <div class="text-sm font-semibold">Before</div>
            <img class="rounded-lg border" src={g.beforeAfter.before.src} alt={g.beforeAfter.before.alt || ''} />
          </div>
          <div class="space-y-2">
            <div class="text-sm font-semibold">After</div>
            <img class="rounded-lg border" src={g.beforeAfter.after.src} alt={g.beforeAfter.after.alt || ''} />
          </div>
        </div>
      )}
      {g.gallery && g.gallery.length > 0 && (
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {g.gallery.map((m, i) => (
            <img key={i} class="rounded-lg border" src={m.src} alt={m.alt || ''} />
          ))}
        </div>
      )}
    </section>
  );
});
