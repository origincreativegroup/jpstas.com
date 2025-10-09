import { component$ } from '@builder.io/qwik';
import type { CaseStudy } from '~/types/case-study';
import { HeroUnit } from '~/components/case-study/HeroUnit';
import { ContextPanel } from '~/components/case-study/ContextPanel';
import { SolutionGrid } from '~/components/case-study/SolutionGrid';
import { ImpactStrip } from '~/components/case-study/ImpactStrip';
import { ProcessStepper } from '~/components/case-study/ProcessStepper';
import { QuoteBlock } from '~/components/case-study/QuoteBlock';
import { RelatedCarousel } from '~/components/case-study/RelatedCarousel';

export const CaseStudyPage = component$(({ data }: { data: CaseStudy }) => {
  return (
    <div class="min-h-screen bg-gradient-to-b from-white via-neutral/5 to-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <HeroUnit data={data} />
        <ContextPanel data={data} />
        <SolutionGrid data={data} />
        <ImpactStrip data={data} />
        <ProcessStepper data={data} />
        {data.context.quote && <QuoteBlock quote={data.context.quote} />}
        {data.reflection && (
          <section class="rounded-3xl glass p-8 lg:p-12 shadow-xl">
            <h2 class="text-3xl lg:text-4xl font-bold mb-6 text-charcoal flex items-center gap-3">
              <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-highlight to-amber-600 text-white">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </span>
              Reflection & Learning
            </h2>
            <p class="text-lg text-charcoal/80 mb-6 leading-relaxed">{data.reflection.learning}</p>
            {data.reflection.reuse && (
              <div class="mt-6 rounded-2xl bg-primary/5 p-6 border border-primary/20">
                <h3 class="text-xl font-bold text-charcoal mb-4">Reusable Patterns</h3>
                <ul class="space-y-3">
                  {data.reflection.reuse.map((r) => (
                    <li key={r} class="flex items-start gap-3">
                      <svg class="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span class="text-charcoal/80">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}
        <RelatedCarousel data={data} />
      </div>
    </div>
  );
});

