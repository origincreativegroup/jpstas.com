import { component$ } from '@builder.io/qwik';
import type { CaseStudy } from '~/types/case-study';
import { AnimatedMetric } from '~/components/AnimatedMetric';

export const ImpactStrip = component$(({ data }: { data: CaseStudy }) => {
  const items = data.impact.length ? data.impact : data.metrics;
  return (
    <section class="rounded-3xl bg-neutral shadow-xl p-6 lg:p-10">
      <div>
        {/* Header with icon */}
        <div class="flex items-center gap-4 mb-10">
          <div class="relative group">
            <div class="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div>
            <h2 class="text-3xl lg:text-4xl font-bold text-primary mb-1">Impact & Results</h2>
            <p class="text-sm text-text-secondary uppercase tracking-wider font-semibold">Measurable Outcomes</p>
          </div>
        </div>

        {/* Metrics grid with stagger animation */}
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {items.map((m, i) => (
            <div
              key={i}
              class="group rounded-2xl bg-white px-6 py-8 text-center border-2 border-primary/20 hover:border-primary transition-all duration-300 hover:shadow-lg"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div>
                <div class="text-3xl md:text-5xl font-extrabold text-primary mb-3">
                  {m.value}
                </div>
                <div class="text-xs md:text-sm uppercase tracking-wider text-text-secondary font-semibold">
                  {m.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

