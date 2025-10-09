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
    <div class="space-y-8 py-8">
      <HeroUnit data={data} />
      <ContextPanel data={data} />
      <SolutionGrid data={data} />
      <ImpactStrip data={data} />
      <ProcessStepper data={data} />
      {data.context.quote && <QuoteBlock quote={data.context.quote} />}
      {data.reflection && (
        <section class="rounded-xl border border-gray-200 bg-white shadow-sm p-8">
          <h2 class="text-2xl font-bold mb-4">Reflection & Learning</h2>
          <p class="text-gray-700 mb-4">{data.reflection.learning}</p>
          {data.reflection.reuse && (
            <div>
              <h3 class="font-semibold mb-2">Reusable Patterns:</h3>
              <ul class="list-disc ml-6 text-gray-700">
                {data.reflection.reuse.map((r) => <li key={r}>{r}</li>)}
              </ul>
            </div>
          )}
        </section>
      )}
      <RelatedCarousel data={data} />
    </div>
  );
});

