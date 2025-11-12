import { component$ } from '@builder.io/qwik';
import type { CaseStudy } from '~/types/case-study';
import { MediaGallery } from '~/components/MediaGallery';

const badgeClass =
  'inline-flex items-center justify-center rounded-full border border-[#0E0E12]/15 bg-[#F6F5F2] px-3 py-1 font-inter text-xs uppercase tracking-[0.2em] text-[#0E0E12]/70';

export const CaseStudyPage = component$(({ data }: { data: CaseStudy }) => {
  const metrics = data.metrics ?? [];
  const impactMetrics = data.impact ?? [];
  const gallery = data.solution?.gallery ?? [];
  const tools = data.meta?.tools ?? [];
  const tags = data.meta?.tags ?? [];
  const process = data.process ?? [];

  return (
    <main class="min-h-screen bg-[#0E0E12] text-[#F6F5F2]">
      <section class="relative overflow-hidden bg-[#0E0E12] pb-20 pt-16 md:pb-28 md:pt-24">
        <div class="absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-tr from-[#5A3CF4]/25 via-transparent to-transparent lg:block" />
        <div class="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 md:px-6 lg:px-8">
          <div class="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div class="space-y-6">
              <div class="flex flex-wrap gap-3">
                {data.meta?.year && (
                  <span class="font-montserrat text-sm font-semibold uppercase tracking-[0.35em] text-[#F59E0B]">
                    {data.meta.year}
                  </span>
                )}
                {data.meta?.client && (
                  <span class="font-montserrat text-xs uppercase tracking-[0.3em] text-[#F6F5F2]/50">
                    {data.meta.client}
                  </span>
                )}
              </div>
              <h1 class="font-montserrat text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">{data.title}</h1>
              <p class="font-inter text-base text-[#F6F5F2]/70 md:text-lg">{data.tagline}</p>
              <div class="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} class="rounded-full border border-[#F6F5F2]/20 bg-white/5 px-3 py-1 text-xs font-medium text-[#F6F5F2]/70">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {data.hero?.src ? (
              <div class="relative overflow-hidden rounded-3xl border border-[#F6F5F2]/15 bg-[#15151F] shadow-[0_40px_80px_rgba(0,0,0,0.45)]">
                <img
                  src={data.hero.src}
                  alt={data.hero.alt ?? data.title}
                  class="h-full w-full object-cover"
                  loading="lazy"
                />
                <span class="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#0E0E12]/40 via-transparent to-[#5A3CF4]/15" />
              </div>
            ) : null}
          </div>

          {metrics.length ? (
            <div class="grid gap-6 md:grid-cols-3">
              {metrics.map((metric) => (
                <article
                  key={metric.label}
                  class="rounded-3xl border border-[#F6F5F2]/15 bg-[#15151F]/70 p-6 backdrop-blur-sm ring-1 ring-white/5"
                >
                  <span class="font-montserrat text-xs font-semibold uppercase tracking-[0.3em] text-[#CBC0FF]">
                    {metric.label}
                  </span>
                  <p class="mt-3 font-montserrat text-3xl font-semibold text-[#F6F5F2]">{metric.value}</p>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section class="bg-[#F6F5F2] py-16 text-[#0E0E12] md:py-24">
        <div class="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 md:px-6 lg:px-8">
          <div class="grid gap-10 md:grid-cols-2">
            <div class="space-y-5">
              <h2 class="font-montserrat text-2xl font-semibold text-[#0E0E12] md:text-3xl">Context</h2>
              <p class="font-inter text-base leading-relaxed text-[#0E0E12]/80">{data.context.problem}</p>
              {data.context.constraints?.length ? (
                <ul class="space-y-2 font-inter text-sm text-[#0E0E12]/60">
                  {data.context.constraints.map((item) => (
                    <li key={item} class="flex items-start gap-3">
                      <span class="mt-1 h-2 w-2 rounded-full bg-[#5A3CF4]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <div class="space-y-5">
              <h2 class="font-montserrat text-2xl font-semibold text-[#0E0E12] md:text-3xl">Approach</h2>
              <p class="font-inter text-base leading-relaxed text-[#0E0E12]/80">{data.solution.approach}</p>
              {data.solution.bullets?.length ? (
                <ul class="space-y-3 font-inter text-sm text-[#0E0E12]/70">
                  {data.solution.bullets.map((item) => (
                    <li key={item} class="rounded-2xl bg-white p-3 shadow-[0_15px_40px_rgba(14,14,18,0.08)]">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>

          {tools.length ? (
            <div class="space-y-4">
              <h3 class="font-montserrat text-sm font-semibold uppercase tracking-[0.3em] text-[#6B7D57]">
                Tools & Platforms
              </h3>
              <div class="flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    class="rounded-full border border-[#0E0E12]/10 bg-white px-4 py-2 font-inter text-sm text-[#0E0E12]/70 shadow-[0_12px_30px_rgba(14,14,18,0.08)]"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {gallery.length ? (
        <section class="bg-[#F6F5F2] pb-16 text-[#0E0E12] md:pb-24">
          <div class="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 md:px-6 lg:px-8">
            <div class="space-y-3">
              <h2 class="font-montserrat text-2xl font-semibold text-[#0E0E12] md:text-3xl">Gallery</h2>
              <p class="font-inter text-sm text-[#0E0E12]/70">
                Selected visuals and motion captures from the engagement. Tap any thumbnail to explore full-scale.
              </p>
            </div>
            <MediaGallery media={gallery} />
          </div>
        </section>
      ) : null}

      {(impactMetrics.length || process.length) && (
        <section class="bg-[#0E0E12] py-16 text-[#F6F5F2] md:py-24">
          <div class="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 md:px-6 lg:px-8">
            {impactMetrics.length ? (
              <div class="space-y-6">
                <h2 class="font-montserrat text-2xl font-semibold md:text-3xl">Impact</h2>
                <div class="grid gap-6 md:grid-cols-3">
                  {impactMetrics.map((metric) => (
                    <article
                      key={`${metric.label}-${metric.value}`}
                      class="rounded-3xl border border-[#F6F5F2]/15 bg-[#15151F]/70 p-6 backdrop-blur-sm ring-1 ring-white/5"
                    >
                      <span class="font-montserrat text-xs font-semibold uppercase tracking-[0.3em] text-[#CBC0FF]">
                        {metric.label}
                      </span>
                      <p class="mt-3 font-montserrat text-3xl font-semibold text-[#F6F5F2]">{metric.value}</p>
                      {metric.description ? (
                        <p class="mt-3 font-inter text-sm text-[#F6F5F2]/60">{metric.description}</p>
                      ) : null}
                    </article>
                  ))}
                </div>
              </div>
            ) : null}

            {process.length ? (
              <div class="space-y-6">
                <h2 class="font-montserrat text-2xl font-semibold md:text-3xl">Process</h2>
                <div class="relative grid gap-6 md:grid-cols-2">
                  {process.map((step, index) => (
                    <div
                      key={step.title}
                      class="rounded-3xl border border-[#F6F5F2]/10 bg-[#15151F]/60 p-6 backdrop-blur-sm ring-1 ring-white/5"
                    >
                      <span class={badgeClass}>{String(index + 1).padStart(2, '0')}</span>
                      <h3 class="mt-4 font-montserrat text-lg font-semibold text-[#F6F5F2]">{step.title}</h3>
                      {step.description ? (
                        <p class="mt-3 font-inter text-sm leading-relaxed text-[#F6F5F2]/70">{step.description}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      )}

      {(data.reflection || data.related?.length) && (
        <section class="bg-[#0E0E12] pb-24 text-[#F6F5F2]">
          <div class="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 md:px-6 lg:px-8">
            {data.reflection && (
              <article class="rounded-3xl border border-[#F6F5F2]/15 bg-[#15151F]/70 p-8 backdrop-blur-sm ring-1 ring-white/5">
                <h2 class="font-montserrat text-2xl font-semibold text-[#F6F5F2] md:text-3xl">Reflection</h2>
                <p class="mt-4 font-inter text-base leading-relaxed text-[#F6F5F2]/70">{data.reflection.learning}</p>
                {data.reflection.reuse?.length ? (
                  <ul class="mt-6 grid gap-3 md:grid-cols-2">
                    {data.reflection.reuse.map((item) => (
                      <li
                        key={item}
                        class="rounded-2xl border border-[#F6F5F2]/15 bg-[#0E0E12]/60 px-4 py-3 font-inter text-sm text-[#F6F5F2]/70"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            )}

            {data.related?.length ? (
              <div class="space-y-4">
                <h3 class="font-montserrat text-sm font-semibold uppercase tracking-[0.3em] text-[#CBC0FF]">
                  Related Projects
                </h3>
                <ul class="flex flex-wrap gap-3">
                  {data.related.map((related) => (
                    <li key={related.href}>
                      <a
                        href={related.href}
                        class="inline-flex items-center gap-2 rounded-full border border-[#F6F5F2]/15 bg-[#15151F]/80 px-4 py-2 font-inter text-sm text-[#F6F5F2]/80 transition hover:-translate-y-0.5 hover:border-[#5A3CF4]/40 hover:bg-[#5A3CF4]/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CBC0FF]/50"
                      >
                        {related.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      )}
    </main>
  );
});

