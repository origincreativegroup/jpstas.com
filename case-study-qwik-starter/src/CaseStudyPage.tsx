import { component$ } from '@builder.io/qwik';
import type { CaseStudy } from '~/types';
import { HeroUnit } from '~/components/HeroUnit';
import { ContextPanel } from '~/components/ContextPanel';
import { SolutionGrid } from '~/components/SolutionGrid';
import { ImpactStrip } from '~/components/ImpactStrip';
import { ProcessStepper } from '~/components/ProcessStepper';
import { QuoteBlock } from '~/components/QuoteBlock';
import { RelatedCarousel } from '~/components/RelatedCarousel';

export const CaseStudyPage = component$(({ data }: { data: CaseStudy }) => {
  return (
    <div class="space-y-6">
      <HeroUnit data={data} />
      <ContextPanel data={data} />
      <SolutionGrid data={data} />
      <ImpactStrip data={data} />
      <ProcessStepper data={data} />
      {data.context.quote && <QuoteBlock quote={data.context.quote} />}
      <RelatedCarousel data={data} />
    </div>
  );
});
