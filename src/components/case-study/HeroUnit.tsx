import { component$ } from '@builder.io/qwik';
import type { CaseStudy } from '~/types/case-study';
import { AnimatedMetric } from '~/components/AnimatedMetric';
import { VideoPlayer } from '~/components/VideoPlayer';

export const HeroUnit = component$(({ data }: { data: CaseStudy }) => {
  return (
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-neutral/10 to-primary/5 shadow-2xl">
      {/* Decorative Background Elements */}
      <div class="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-float" />
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-float" style="animation-delay: 2s" />
      
      <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-8 lg:p-12">
        {/* Content */}
        <div class="space-y-6 flex flex-col justify-center">
          <div class="inline-block">
            <span class="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold uppercase tracking-wide">
              Case Study
            </span>
          </div>
          
          <h1 class="text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-charcoal leading-tight">
            {data.title}
          </h1>
          
          <p class="text-xl lg:text-2xl text-charcoal/70 leading-relaxed">
            {data.tagline}
          </p>

          {/* Animated Metrics */}
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
            {data.metrics.slice(0, 3).map((m, i) => (
              <AnimatedMetric 
                key={i}
                value={m.value}
                label={m.label}
              />
            ))}
          </div>

          {/* Tags */}
          {data.meta?.tags && (
            <div class="flex flex-wrap gap-2 pt-2">
              {data.meta.tags.map((t) => (
                <span 
                  key={t} 
                  class="px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary rounded-full text-sm font-semibold border border-primary/20 hover:scale-105 transition-transform"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Meta Information */}
          {data.meta && (
            <div class="flex flex-wrap gap-6 pt-4 text-sm text-charcoal/60">
              {data.meta.year && (
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="font-medium">{data.meta.year}</span>
                </div>
              )}
              {data.meta.client && (
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span class="font-medium">{data.meta.client}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hero Media - Enhanced */}
        <div class="relative group">
          <div class="w-full overflow-hidden rounded-2xl shadow-2xl">
            {data.hero?.type === 'video' ? (
              <VideoPlayer 
                src={data.hero.src} 
                poster={data.hero.poster}
                title={data.title}
              />
            ) : (
              <div class="aspect-video w-full overflow-hidden bg-gradient-to-br from-neutral/20 to-primary/10">
                <img 
                  class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  src={data.hero?.src || '/images/placeholder.svg'} 
                  alt={data.hero?.alt || data.title} 
                />
              </div>
            )}
          </div>
          
          {/* Decorative frame */}
          <div class="absolute -inset-4 border-2 border-primary/20 rounded-3xl -z-10 group-hover:border-primary/40 transition-colors" />
          
          {/* Floating Badge */}
          {data.meta?.year && (
            <div class="absolute -top-4 -right-4 glass rounded-full px-4 py-2 shadow-lg">
              <span class="text-sm font-bold text-primary">{data.meta.year}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

