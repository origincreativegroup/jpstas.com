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
    <main class="min-h-screen bg-surface-deep text-cream">
      <section class="relative overflow-hidden py-20 md:py-28">
        {heroProject && (
          <>
            <img
              src={heroProject.hero.src}
              alt={heroProject.hero.alt ?? heroProject.title}
              class="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-surface-deep/75" />
          </>
        )}
        <div class="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 md:px-6 lg:px-8">
          <div class="space-y-6 max-w-3xl">
            <span class="font-montserrat text-sm font-semibold uppercase tracking-[0.35em] text-gold">
              Selected Work
            </span>
            <h1 class="font-montserrat text-4xl font-bold leading-tight text-cream md:text-5xl lg:text-6xl">
              Systems-led storytelling across brand, media, and production.
            </h1>
            <p class="font-inter text-lg text-cream/75 md:text-xl">
              Each case study pairs a focused hero narrative with the gallery and operations that brought it to life—
              from brand governance to generative workflows and immersive installations.
            </p>
          </div>
          {heroProject ? (
            <div class="grid gap-10 rounded-[32px] border border-cream/10 bg-surface-mid/80 p-8 shadow-[0_40px_80px_rgba(0,0,0,0.55)] lg:grid-cols-[1.5fr,1fr]">
              <div class="space-y-4">
                <span class="font-montserrat text-xs font-semibold uppercase tracking-[0.3em] text-gold">
                  {heroProject.category}
                </span>
                <h2 class="font-montserrat text-3xl font-bold text-cream">
                  {heroProject.title}
                </h2>
                <p class="font-inter text-base text-cream/75">{heroProject.summary}</p>
                <a
                  href={`/portfolio/${heroProject.slug}`}
                  class="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold px-6 py-3 font-montserrat text-xs uppercase tracking-[0.3em] text-surface-deep transition hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(185,143,69,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold/60"
                >
                  View Case Study
                </a>
              </div>
              <div class="relative overflow-hidden rounded-2xl border border-cream/10 bg-surface-deep/40">
                <img
                  src={heroProject.hero.src}
                  alt={heroProject.hero.alt ?? heroProject.title}
                  class="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section class="bg-sand py-16 text-surface-deep md:py-24">
        <div class="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">
          <div class="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div class="space-y-3">
              <h2 class="font-montserrat text-3xl font-semibold text-surface-deep md:text-4xl">
                Case Study Gallery
              </h2>
              <p class="font-inter text-base text-surface-olive md:max-w-xl">
                Explore the projects shaping experiential brand systems, AI-enabled production, motion toolkits, and
                large-format print programs. Each card links to a streamlined hero and gallery experience.
              </p>
            </div>
            <a
              href="/contact"
              class="inline-flex items-center gap-2 rounded-full border border-surface-deep/20 bg-gold px-6 py-3 font-montserrat text-xs uppercase tracking-[0.3em] text-surface-deep transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(185,143,69,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold/60"
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
