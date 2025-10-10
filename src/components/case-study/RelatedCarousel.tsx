import { component$ } from '@builder.io/qwik';
import type { CaseStudy } from '~/types/case-study';
import { Link } from '@builder.io/qwik-city';

export const RelatedCarousel = component$(({ data }: { data: CaseStudy }) => {
  if (!data.related?.length) return null as any;
  return (
    <section class="relative overflow-hidden rounded-3xl bg-white shadow-xl p-8 lg:p-12">
      <div class="relative z-10">
        <div class="flex items-center justify-center gap-3 mb-10">
          <div class="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 class="text-3xl lg:text-4xl font-bold text-charcoal">Explore More Projects</h2>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.related.map((r, index) => (
            <Link
              key={r.href}
              href={r.href}
              style={{ animationDelay: `${index * 100}ms` }}
              class="group relative overflow-hidden rounded-2xl bg-white border border-neutral/20 p-6 lg:p-8 hover:border-primary/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div class="relative z-10">
                <div class="flex items-start justify-between gap-3 mb-3">
                  <h3 class="font-bold text-lg text-charcoal group-hover:text-primary transition-colors">
                    {r.title}
                  </h3>
                  <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all group-hover:scale-110">
                    <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                <div class="flex items-center gap-2 text-sm text-primary font-semibold group-hover:gap-3 transition-all">
                  View Case Study
                  <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
});

