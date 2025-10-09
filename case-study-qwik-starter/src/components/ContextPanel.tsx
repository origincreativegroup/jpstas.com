import { component$ } from '@builder.io/qwik';
import type { CaseStudy } from '~/types';

export const ContextPanel = component$(({ data }: { data: CaseStudy }) => {
  return (
    <section class="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
      <h2 class="text-2xl font-bold mb-3">Context & Challenge</h2>
      <p class="text-gray-700">{data.context.problem}</p>
      {data.context.constraints && data.context.constraints.length > 0 && (
        <ul class="list-disc ml-6 mt-3 text-gray-700">
          {data.context.constraints.map((c) => <li key={c}>{c}</li>)}
        </ul>
      )}
      {data.context.quote && (
        <blockquote class="mt-4 border-l-4 pl-4 italic text-gray-600">“{data.context.quote}”</blockquote>
      )}
    </section>
  );
});
