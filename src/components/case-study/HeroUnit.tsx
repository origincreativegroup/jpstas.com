import { component$ } from '@builder.io/qwik';
import type { CaseStudy } from '~/types/case-study';

export const HeroUnit = component$(({ data }: { data: CaseStudy }) => {
  return (
    <section class="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
        <div class="space-y-4">
          <h1 class="text-4xl font-extrabold tracking-tight text-gray-900">{data.title}</h1>
          <p class="text-xl text-gray-600">{data.tagline}</p>
          <div class="flex flex-wrap gap-4">
            {data.metrics.slice(0,3).map((m, i) => (
              <div key={i} class="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
                <div class="text-2xl font-bold text-blue-900">{m.value}</div>
                <div class="text-xs uppercase tracking-wide text-blue-600">{m.label}</div>
              </div>
            ))}
          </div>
          {data.meta?.tags && (
            <div class="flex flex-wrap gap-2 pt-2">
              {data.meta.tags.map((t) => (
                <span key={t} class="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">{t}</span>
              ))}
            </div>
          )}
        </div>
        <div class="aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
          {data.hero?.type === 'video' ? (
            <video class="h-full w-full object-cover" src={data.hero.src} controls />
          ) : (
            <img class="h-full w-full object-cover" src={data.hero?.src || '/images/placeholder.svg'} alt={data.hero?.alt || ''} />
          )}
        </div>
      </div>
    </section>
  );
});

