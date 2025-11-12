import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { MediaCard } from '~/components/media/MediaCard';
import { getAllProjectSummaries } from '~/lib/content';

const PROJECT_ORDER = [
  'brand-evolution',
  'caribbeanpools-redesign',
  'generative-ai',
  'mixed-media',
  'motion-systems',
  'print-systems',
  'drone-media',
  'print-studio',
] as const;

export default component$(() => {
  const projects = getAllProjectSummaries().sort((a, b) => {
    const indexA = PROJECT_ORDER.indexOf(a.slug as (typeof PROJECT_ORDER)[number]);
    const indexB = PROJECT_ORDER.indexOf(b.slug as (typeof PROJECT_ORDER)[number]);
    return (indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA) - (indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB);
  });

  const heroProject = projects.find((project) => project.slug === 'brand-evolution') ?? projects[0];

  return (
    <main class="min-h-screen bg-[#0E0E12] text-[#F6F5F2]">
      <section class="relative overflow-hidden bg-[#0E0E12] py-20 md:py-28">
        <div class="absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-tr from-[#5A3CF4]/20 via-transparent to-transparent lg:block" />
        <div class="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 md:px-6 lg:px-8">
          <div class="space-y-6 max-w-3xl">
            <span class="font-montserrat text-sm font-semibold uppercase tracking-[0.35em] text-[#F59E0B]">
              Selected Work
            </span>
            <h1 class="font-montserrat text-4xl font-bold leading-tight text-[#F6F5F2] md:text-5xl lg:text-6xl">
              Systems-led storytelling across brand, media, and production.
            </h1>
            <p class="font-inter text-lg text-[#F6F5F2]/70 md:text-xl">
              Each case study pairs a focused hero narrative with the gallery and operations that brought it to life—
              from brand governance to generative workflows and immersive installations.
            </p>
          </div>
          {heroProject ? (
            <figure class="relative overflow-hidden rounded-3xl border border-[#F6F5F2]/10 bg-[#15151F] shadow-[0_40px_80px_rgba(0,0,0,0.4)]">
              <img
                src={heroProject.hero.src}
                alt={heroProject.hero.alt ?? heroProject.title}
                class="h-full w-full object-cover"
                loading="lazy"
              />
              <figcaption class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0E0E12]/80 via-[#0E0E12]/40 to-transparent p-6 sm:p-8 md:p-10">
                <div class="space-y-3 max-w-2xl">
                  <span class="font-montserrat text-xs font-semibold uppercase tracking-[0.3em] text-[#F59E0B]">
                    {heroProject.category}
                  </span>
                  <h2 class="font-montserrat text-2xl font-bold text-[#F6F5F2] md:text-3xl">
                    {heroProject.title}
                  </h2>
                  <p class="font-inter text-sm text-[#F6F5F2]/70 md:text-base">{heroProject.summary}</p>
                  <a
                    href={`/portfolio/${heroProject.slug}`}
                    class="inline-flex items-center gap-2 rounded-full border border-[#F6F5F2]/40 bg-[#5A3CF4] px-6 py-3 font-montserrat text-xs uppercase tracking-[0.3em] text-[#F6F5F2] transition hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(90,60,244,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F6F5F2]/80"
                  >
                    View Case Study
                  </a>
                </div>
              </figcaption>
            </figure>
          ) : null}
        </div>
      </section>

      <section class="bg-[#F6F5F2] py-16 md:py-24">
        <div class="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">
          <div class="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div class="space-y-3">
              <h2 class="font-montserrat text-3xl font-semibold text-[#0E0E12] md:text-4xl">
                Case Study Gallery
              </h2>
              <p class="font-inter text-base text-[#0E0E12]/70 md:max-w-xl">
                Explore the projects shaping experiential brand systems, AI-enabled production, motion toolkits, and
                large-format print programs. Each card links to a streamlined hero and gallery experience.
              </p>
            </div>
            <a
              href="/contact"
              class="inline-flex items-center gap-2 rounded-full border border-[#0E0E12]/15 bg-[#5A3CF4] px-6 py-3 font-montserrat text-xs uppercase tracking-[0.3em] text-[#F6F5F2] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(90,60,244,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E0E12]/40"
            >
              Start a project
            </a>
          </div>
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <MediaCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
});

export const head: DocumentHead = {
  title: 'Work & Case Studies – John P. Stas',
  meta: [
    {
      name: 'description',
      content:
        'Browse systems-driven case studies spanning brand evolution, generative AI, motion design, mixed media, and large-format print operations from John P. Stas.',
    },
  ],
};
