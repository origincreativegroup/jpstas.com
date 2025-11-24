import { component$ } from '@builder.io/qwik';
import type { CaseStudy } from '~/types/case-study';
import { MediaGallery } from '~/components/MediaGallery';
import { CloudflareStreamPlayer } from '~/components/CloudflareStreamPlayer';

const badgeClass =
  'inline-flex items-center justify-center rounded-full border border-gold/30 bg-gold/10 px-3 py-1 font-inter text-xs uppercase tracking-[0.2em] text-gold';

export const CaseStudyPage = component$(({ data }: { data: CaseStudy }) => {
  const metrics = data.metrics ?? [];
  const impactMetrics = data.impact ?? [];
  const gallery = data.solution?.gallery ?? [];
  const tools = data.meta?.tools ?? [];
  const tags = data.meta?.tags ?? [];
  const process = data.process ?? [];

  return (
    <main class="min-h-screen bg-surface-deep text-cream">
      <section class="relative overflow-hidden pb-20 pt-16 md:pb-28 md:pt-24">
        {data.hero?.src && (
          <>
            {data.hero.type === 'video' && data.hero.poster ? (
              <img
                src={data.hero.poster}
                alt={data.hero.alt ?? data.title}
                class="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            ) : data.hero.type !== 'video' ? (
              <img
                src={data.hero.src}
                alt={data.hero.alt ?? data.title}
                class="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            ) : null}
            <div class="absolute inset-0 bg-surface-deep/80" />
          </>
        )}
        <div class="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 md:px-6 lg:px-8">
          <div class="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div class="space-y-6">
              <div class="flex flex-wrap gap-3">
                {data.meta?.year && (
                  <span class="font-montserrat text-sm font-semibold uppercase tracking-[0.35em] text-gold">
                    {data.meta.year}
                  </span>
                )}
                {data.meta?.client && (
                  <span class="font-montserrat text-xs uppercase tracking-[0.3em] text-cream/60">
                    {data.meta.client}
                  </span>
                )}
              </div>
              <h1 class="font-montserrat text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">{data.title}</h1>
              <p class="font-inter text-base text-cream/75 md:text-lg">{data.tagline}</p>
              <div class="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} class="rounded-full border border-cream/20 bg-surface-mid/70 px-3 py-1 text-xs font-medium text-cream/80">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {data.hero?.src ? (
              <div class="relative overflow-hidden rounded-3xl border border-cream/15 bg-surface-mid/80 shadow-[0_40px_80px_rgba(0,0,0,0.55)]">
                {data.hero.type === 'video' && /^[a-f0-9]{32}$/i.test(data.hero.src) ? (
                  <CloudflareStreamPlayer
                    videoId={data.hero.src}
                    poster={data.hero.poster}
                    autoplay={true}
                    loop={true}
                    muted={true}
                    controls={true}
                    fill={false}
                    class="w-full"
                  />
                ) : data.hero.type === 'video' ? (
                  <video
                    src={data.hero.src}
                    poster={data.hero.poster}
                    autoplay
                    loop
                    muted
                    controls
                    class="h-full w-full object-cover"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img src={data.hero.src} alt={data.hero.alt ?? data.title} class="h-full w-full object-cover" loading="lazy" />
                )}
              </div>
            ) : null}
          </div>

          {metrics.length ? (
            <div class="grid gap-6 md:grid-cols-3">
              {metrics.map((metric) => (
                <article
                  key={metric.label}
                  class="rounded-3xl border border-cream/15 bg-surface-mid/70 p-6 backdrop-blur-sm ring-1 ring-black/20"
                >
                  <span class="font-montserrat text-xs font-semibold uppercase tracking-[0.3em] text-gold">
                    {metric.label}
                  </span>
                  <p class="mt-3 font-montserrat text-3xl font-semibold text-cream">{metric.value}</p>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section class="bg-sand py-16 text-surface-deep md:py-24">
        <div class="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 md:px-6 lg:px-8">
          <div class="grid gap-10 md:grid-cols-2">
            <div class="space-y-5">
              <h2 class="font-montserrat text-2xl font-semibold text-surface-deep md:text-3xl">Context</h2>
              <p class="font-inter text-base leading-relaxed text-surface-olive">{data.context.problem}</p>
              {data.context.constraints?.length ? (
                <ul class="space-y-2 font-inter text-sm text-surface-olive/80">
                  {data.context.constraints.map((item) => (
                    <li key={item} class="flex items-start gap-3">
                      <span class="mt-1 h-2 w-2 rounded-full bg-gold" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <div class="space-y-5">
              <h2 class="font-montserrat text-2xl font-semibold text-surface-deep md:text-3xl">Approach</h2>
              <p class="font-inter text-base leading-relaxed text-surface-olive">{data.solution.approach}</p>
              {data.solution.bullets?.length ? (
                <ul class="space-y-3 font-inter text-sm text-surface-olive/90">
                  {data.solution.bullets.map((item) => (
                    <li key={item} class="rounded-2xl bg-cream p-3 text-surface-deep shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>

          {tools.length ? (
            <div class="space-y-4">
              <h3 class="font-montserrat text-sm font-semibold uppercase tracking-[0.3em] text-surface-olive">
                Tools & Platforms
              </h3>
              <div class="flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    class="rounded-full border border-surface-deep/10 bg-cream px-4 py-2 font-inter text-sm text-surface-olive shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
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
        <section class="bg-cream pb-16 text-surface-deep md:pb-24">
          <div class="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 md:px-6 lg:px-8">
            <div class="space-y-3">
              <h2 class="font-montserrat text-2xl font-semibold text-surface-deep md:text-3xl">Gallery</h2>
              <p class="font-inter text-sm text-surface-olive/90">
                Selected visuals and motion captures from the engagement. Tap any thumbnail to explore full-scale.
              </p>
            </div>
            <MediaGallery media={gallery} />
          </div>
        </section>
      ) : null}

      {(impactMetrics.length || process.length) && (
        <section class="bg-surface-deep py-16 text-cream md:py-24">
          <div class="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 md:px-6 lg:px-8">
            {impactMetrics.length ? (
              <div class="space-y-6">
                <h2 class="font-montserrat text-2xl font-semibold md:text-3xl">Impact</h2>
                <div class="grid gap-6 md:grid-cols-3">
                  {impactMetrics.map((metric) => (
                    <article
                      key={`${metric.label}-${metric.value}`}
                      class="rounded-3xl border border-cream/15 bg-surface-mid/70 p-6 backdrop-blur-sm ring-1 ring-black/20"
                    >
                      <span class="font-montserrat text-xs font-semibold uppercase tracking-[0.3em] text-gold">
                        {metric.label}
                      </span>
                      <p class="mt-3 font-montserrat text-3xl font-semibold text-cream">{metric.value}</p>
                      {metric.description ? (
                        <p class="mt-3 font-inter text-sm text-cream/70">{metric.description}</p>
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
                      class="rounded-3xl border border-cream/10 bg-surface-mid/60 p-6 backdrop-blur-sm ring-1 ring-black/20"
                    >
                      <span class={badgeClass}>{String(index + 1).padStart(2, '0')}</span>
                      <h3 class="mt-4 font-montserrat text-lg font-semibold text-cream">{step.title}</h3>
                      {step.description ? (
                        <p class="mt-3 font-inter text-sm leading-relaxed text-cream/75">{step.description}</p>
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
        <section class="bg-surface-deep pb-24 text-cream">
          <div class="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 md:px-6 lg:px-8">
            {data.reflection && (
              <article class="rounded-3xl border border-cream/15 bg-surface-mid/70 p-8 backdrop-blur-sm ring-1 ring-black/20">
                <h2 class="font-montserrat text-2xl font-semibold text-cream md:text-3xl">Reflection</h2>
                <p class="mt-4 font-inter text-base leading-relaxed text-cream/75">{data.reflection.learning}</p>
                {data.reflection.reuse?.length ? (
                  <ul class="mt-6 grid gap-3 text-surface-deep md:grid-cols-2">
                    {data.reflection.reuse.map((item) => (
                      <li
                        key={item}
                        class="rounded-2xl border border-cream/15 bg-surface-deep/70 px-4 py-3 font-inter text-sm text-cream/75"
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
                <h3 class="font-montserrat text-sm font-semibold uppercase tracking-[0.3em] text-gold">
                  Related Projects
                </h3>
                <ul class="flex flex-wrap gap-3">
                  {data.related.map((related) => (
                    <li key={related.href}>
                      <a
                        href={related.href}
                        class="inline-flex items-center gap-2 rounded-full border border-cream/15 bg-surface-mid/80 px-4 py-2 font-inter text-sm text-cream/80 transition hover:-translate-y-0.5 hover:border-gold/40 hover:bg-gold/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold/60"
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

