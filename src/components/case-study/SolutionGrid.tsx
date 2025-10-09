import { component$ } from '@builder.io/qwik';
import type { CaseStudy } from '~/types/case-study';

export const SolutionGrid = component$(({ data }: { data: CaseStudy }) => {
  const g = data.solution;
  return (
    <section class="rounded-xl border border-gray-200 bg-white shadow-sm p-8">
      <h2 class="text-3xl font-bold mb-4">Design & Solution</h2>
      <p class="text-lg text-gray-700 leading-relaxed mb-6">{g.approach}</p>
      {g.bullets && (
        <div class="grid md:grid-cols-2 gap-3 mb-6">
          {g.bullets.map((b) => (
            <div key={b} class="flex items-start gap-3 rounded-lg bg-blue-50 p-4">
              <span class="text-blue-600">✓</span>
              <span class="text-gray-700">{b}</span>
            </div>
          ))}
        </div>
      )}
      {g.beforeAfter && (
        <div class="grid md:grid-cols-2 gap-6 mt-8">
          <div class="space-y-2">
            <div class="text-sm font-semibold text-gray-900 uppercase tracking-wide">Before</div>
            <img class="rounded-lg border shadow-md" src={g.beforeAfter.before.src} alt={g.beforeAfter.before.alt || 'Before'} />
          </div>
          <div class="space-y-2">
            <div class="text-sm font-semibold text-gray-900 uppercase tracking-wide">After</div>
            <img class="rounded-lg border shadow-md" src={g.beforeAfter.after.src} alt={g.beforeAfter.after.alt || 'After'} />
          </div>
        </div>
      )}
      {g.gallery && g.gallery.length > 0 && (
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {g.gallery.map((m, i) => (
            <div key={i} class="aspect-video overflow-hidden rounded-lg shadow-md border">
              {m.type === 'video' ? (
                <video class="w-full h-full object-cover" src={m.src} controls />
              ) : (
                <img class="w-full h-full object-cover" src={m.src} alt={m.alt || `Gallery image ${i + 1}`} />
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
});

