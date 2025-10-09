import { component$ } from '@builder.io/qwik';
import type { CaseStudy } from '~/types/case-study';
import { AnimatedMetric } from '~/components/AnimatedMetric';

export const ImpactStrip = component$(({ data }: { data: CaseStudy }) => {
  const items = data.impact.length ? data.impact : data.metrics;
  return (
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-secondary to-highlight shadow-2xl p-8 lg:p-12">
      {/* Clean animated orbs */}
      <div class="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" />
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float" style="animation-delay: 1.5s" />

      <div class="relative z-10">
        {/* Header with icon */}
        <div class="flex items-center gap-4 mb-10">
          <div class="relative group">
            <div class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div class="absolute inset-0 bg-white rounded-2xl opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
          </div>
          <div>
            <h2 class="text-3xl lg:text-4xl font-bold text-white mb-1">Impact & Results</h2>
            <p class="text-sm text-white/70 uppercase tracking-wider font-semibold">Measurable Outcomes</p>
          </div>
        </div>
        
        {/* Metrics grid with stagger animation */}
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {items.map((m, i) => (
            <div 
              key={i} 
              class="group relative overflow-hidden rounded-2xl glass-dark backdrop-blur-lg px-6 py-8 text-center border border-white/30 hover:border-white/60 transition-all duration-300 hover:scale-110 hover:shadow-2xl"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div class="relative z-10">
                <div class="text-3xl md:text-5xl font-extrabold text-white mb-3 group-hover:scale-110 transition-transform">
                  {m.value}
                </div>
                <div class="text-xs md:text-sm uppercase tracking-wider text-white/90 font-semibold">
                  {m.label}
                </div>
              </div>
              {/* Animated gradient on hover */}
              <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

