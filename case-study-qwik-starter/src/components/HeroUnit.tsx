import { component$ } from '@builder.io/qwik';
import type { CaseStudy } from '~/types';

export const HeroUnit = component$(({ data }: { data: CaseStudy }) => {
  return (
    <section class="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div class="space-y-4">
          <h1 class="text-3xl font-extrabold tracking-tight">{data.title}</h1>
          <p class="text-lg text-gray-600">{data.tagline}</p>
          <div class="flex flex-wrap gap-4">
            {data.metrics.slice(0,3).map((m, i) => (
              <div key={i} class="rounded-lg border px-4 py-3">
                <div class="text-xl font-bold">{m.value}</div>
                <div class="text-xs uppercase tracking-wide text-gray-500">{m.label}</div>
              </div>
            ))}
          </div>
          {data.meta?.tags && (
            <div class="flex flex-wrap gap-2 pt-2">
              {data.meta.tags.map((t) => (
                <span key={t} class="rounded-full bg-gray-100 px-3 py-1 text-xs">{t}</span>
              ))}
            </div>
          )}
        </div>
        <div class="aspect-video w-full overflow-hidden rounded-lg bg-gray-50">
          {data.hero?.type === 'video' ? (
            <video class="h-full w-full object-cover" src={data.hero.src} controls />
          ) : (
            <img class="h-full w-full object-cover" src={data.hero?.src} alt={data.hero?.alt || ''} />
          )}
        </div>
      </div>
    </section>
  );
});
