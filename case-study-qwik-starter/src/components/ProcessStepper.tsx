import { component$ } from '@builder.io/qwik';
import type { CaseStudy } from '~/types';

export const ProcessStepper = component$(({ data }: { data: CaseStudy }) => {
  return (
    <section class="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
      <h2 class="text-2xl font-bold mb-3">Process</h2>
      <ol class="relative ml-4">
        {data.process.map((s, i) => (
          <li key={i} class="mb-6">
            <div class="absolute -left-4 top-1 h-full w-px bg-gray-300" />
            <div class="rounded-md bg-gray-50 p-3 inline-block font-semibold">{i+1}. {s.title}</div>
            {s.description && <p class="mt-2 text-gray-700">{s.description}</p>}
          </li>
        ))}
      </ol>
    </section>
  );
});
