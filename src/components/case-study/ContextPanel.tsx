import { component$ } from '@builder.io/qwik';
import type { CaseStudy } from '~/types/case-study';

export const ContextPanel = component$(({ data }: { data: CaseStudy }) => {
  return (
    <section class="relative overflow-hidden rounded-3xl bg-white shadow-xl p-8 lg:p-12">
      {/* Animated gradient orbs */}
      <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-highlight/10 to-transparent rounded-full blur-3xl animate-float" />
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl animate-float" style="animation-delay: 2s" />

      <div class="relative z-10">
        {/* Header with animated icon */}
        <div class="mb-8">
          <div class="flex items-start gap-4 mb-6">
            <div class="relative group">
              <div class="w-14 h-14 bg-gradient-to-br from-highlight to-amber-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="absolute inset-0 bg-gradient-to-br from-highlight to-amber-600 rounded-2xl opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
            </div>
            <div>
              <h2 class="text-3xl lg:text-4xl font-bold text-charcoal mb-2">
                The Challenge
              </h2>
              <p class="text-sm text-charcoal/50 uppercase tracking-wider font-semibold">Context & Problem Space</p>
            </div>
          </div>
          
          <p class="text-lg lg:text-xl text-charcoal/80 leading-relaxed pl-18">
            {data.context.problem}
          </p>
        </div>

        {/* Constraints - Modern card grid */}
        {data.context.constraints && data.context.constraints.length > 0 && (
          <div class="mt-10">
            <h3 class="text-xl font-bold text-charcoal mb-6 flex items-center gap-3">
              <div class="w-2 h-8 bg-gradient-to-b from-highlight to-amber-600 rounded-full" />
              Key Constraints
            </h3>
            <div class="grid sm:grid-cols-2 gap-4">
              {data.context.constraints.map((c, index) => (
                <div 
                  key={c} 
                  class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-neutral/30 p-6 border border-neutral/20 hover:border-highlight/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div class="flex items-start gap-4">
                    <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-highlight/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg class="w-5 h-5 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <p class="text-charcoal/80 leading-relaxed font-medium">{c}</p>
                  </div>
                  <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-highlight/5 to-transparent rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quote Block - Modern design */}
        {data.context.quote && (
          <blockquote class="mt-10 relative rounded-2xl bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent p-8 lg:p-10 border-l-4 border-primary">
            <div class="flex items-start gap-4">
              <svg class="w-12 h-12 text-primary/30 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p class="text-xl lg:text-2xl italic text-charcoal/90 leading-relaxed font-medium">
                {data.context.quote}
              </p>
            </div>
          </blockquote>
        )}
      </div>
    </section>
  );
});

