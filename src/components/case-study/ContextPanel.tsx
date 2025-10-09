import { component$ } from '@builder.io/qwik';
import type { CaseStudy } from '~/types/case-study';

export const ContextPanel = component$(({ data }: { data: CaseStudy }) => {
  return (
    <section class="rounded-xl border border-gray-200 bg-white shadow-sm p-8">
      <h2 class="text-3xl font-bold mb-4">Context & Challenge</h2>
      <p class="text-lg text-gray-700 leading-relaxed">{data.context.problem}</p>
      {data.context.constraints && data.context.constraints.length > 0 && (
        <div class="mt-4">
          <h3 class="font-semibold text-gray-900 mb-2">Key Constraints</h3>
          <ul class="list-disc ml-6 space-y-1 text-gray-700">
            {data.context.constraints.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </div>
      )}
      {data.context.quote && (
        <blockquote class="mt-6 border-l-4 border-blue-600 pl-4 py-2 italic text-gray-600 text-lg">
          "{data.context.quote}"
        </blockquote>
      )}
    </section>
  );
});

