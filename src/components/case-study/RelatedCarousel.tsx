import { component$ } from '@builder.io/qwik';
import type { CaseStudy } from '~/types/case-study';
import { Link } from '@builder.io/qwik-city';

export const RelatedCarousel = component$(({ data }: { data: CaseStudy }) => {
  if (!data.related?.length) return null as any;
  return (
    <section class="rounded-xl border border-gray-200 bg-white shadow-sm p-8">
      <h2 class="text-3xl font-bold mb-6">Related Work</h2>
      <div class="grid md:grid-cols-3 gap-6">
        {data.related.map((r) => (
          <Link 
            key={r.href} 
            href={r.href} 
            class="group rounded-lg border border-gray-200 p-6 hover:bg-blue-50 hover:border-blue-300 transition-all"
          >
            <div class="font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
              {r.title}
            </div>
            <div class="text-sm text-blue-600 font-medium">
              View Case Study →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
});

