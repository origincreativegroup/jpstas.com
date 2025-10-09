import { component$ } from '@builder.io/qwik';
import type { CaseStudy } from '~/types/case-study';

export const ProcessStepper = component$(({ data }: { data: CaseStudy }) => {
  return (
    <section class="rounded-xl border border-gray-200 bg-white shadow-sm p-8">
      <h2 class="text-3xl font-bold mb-6">Process & Approach</h2>
      <ol class="relative space-y-8">
        {data.process.map((s, i) => (
          <li key={i} class="relative pl-8">
            {i < data.process.length - 1 && (
              <div class="absolute left-3 top-8 h-full w-0.5 bg-blue-200" />
            )}
            <div class="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">
              {i + 1}
            </div>
            <div class="rounded-lg bg-gray-50 p-4">
              <h3 class="text-lg font-bold text-gray-900 mb-1">{s.title}</h3>
              {s.description && <p class="text-gray-700">{s.description}</p>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
});

