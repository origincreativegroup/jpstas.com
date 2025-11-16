import { $, component$, useComputed$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import type { HeroSlide } from '~/lib/content';
import { ProgressDots } from '~/components/ui/ProgressDots';

type CarouselHeroProps = {
  slides: HeroSlide[];
};

const ANIMATION_INTERVAL = 7000;

export const CarouselHero = component$<CarouselHeroProps>(({ slides }) => {
  const activeIndex = useSignal(0);
  const isHovered = useSignal(false);
  const documentHidden = useSignal(false);
  const prefersReducedMotion = useSignal(true);

  const totalSlides = slides.length;

  const setSlide = $((nextIndex: number) => {
    if (!totalSlides) return;
    const normalized = (nextIndex + totalSlides) % totalSlides;
    activeIndex.value = normalized;
  });

  const goNext = $(() => setSlide(activeIndex.value + 1));
  const goPrev = $(() => setSlide(activeIndex.value - 1));

  useVisibleTask$(({ cleanup }) => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => {
      prefersReducedMotion.value = mq.matches;
    };
    updatePreference();
    mq.addEventListener('change', updatePreference);
    cleanup(() => mq.removeEventListener('change', updatePreference));
  });

  useVisibleTask$(({ cleanup }) => {
    const handleVisibility = () => {
      documentHidden.value = document.hidden;
    };
    handleVisibility();
    document.addEventListener('visibilitychange', handleVisibility);
    cleanup(() => document.removeEventListener('visibilitychange', handleVisibility));
  });

  useVisibleTask$(({ cleanup, track }) => {
    track(() => prefersReducedMotion.value);
    track(() => isHovered.value);
    track(() => documentHidden.value);
    track(() => totalSlides);

    if (prefersReducedMotion.value || isHovered.value || documentHidden.value || totalSlides <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      activeIndex.value = (activeIndex.value + 1) % totalSlides;
    }, ANIMATION_INTERVAL);

    cleanup(() => window.clearInterval(timer));
  });

  const animationClass = useComputed$(() =>
    prefersReducedMotion.value ? 'transition-none' : 'transition-opacity duration-700 ease-out',
  );

  return (
    <section
      class="relative flex min-h-[90vh] w-full items-center justify-center overflow-hidden bg-surface-deep text-cream"
      onMouseEnter$={() => (isHovered.value = true)}
      onMouseLeave$={() => (isHovered.value = false)}
    >
      <div class="absolute inset-0">
        {slides.map((slide, index) => (
          <article
            key={slide.slug}
            class={[
              'absolute inset-0 flex flex-col items-center justify-center px-4 md:px-10 lg:px-16',
              animationClass.value,
              index === activeIndex.value ? 'opacity-100' : 'pointer-events-none opacity-0',
            ].join(' ')}
          >
            <div class="grid w-full max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
              <div class="space-y-6">
                <div class="space-y-3">
                  <span class="font-montserrat text-sm font-semibold uppercase tracking-[0.35em] text-gold">
                    {slide.category}
                  </span>
                  <h1 class="font-montserrat text-4xl font-bold leading-tight text-cream md:text-5xl lg:text-6xl">
                    {slide.headline}
                  </h1>
                </div>
                <p class="font-inter text-base text-cream/70 md:text-lg">{slide.description}</p>
                <div class="flex flex-wrap gap-4 pt-2">
                  <a
                    href={`/portfolio/${slide.slug}`}
                    class="inline-flex items-center gap-2 rounded-full border border-cream/10 bg-gold px-6 py-3 font-montserrat text-sm font-semibold uppercase tracking-[0.3em] text-surface-deep transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(185,143,69,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold/60"
                  >
                    View Case Study
                  </a>
                  <a
                    href="/portfolio"
                    class="inline-flex items-center gap-2 rounded-full border border-cream/30 px-6 py-3 font-montserrat text-sm uppercase tracking-[0.3em] text-cream transition hover:-translate-y-0.5 hover:bg-cream/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/60"
                  >
                    Explore Work
                  </a>
                </div>
              </div>
              <div class="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-cream/10 bg-[#181c27] shadow-[0_40px_80px_rgba(0,0,0,0.55)]">
                {slide.media.type === 'video' ? (
                  <video
                    muted
                    loop
                    playsInline
                    aria-hidden="true"
                    poster={slide.media.poster}
                    class="h-full w-full object-cover"
                  >
                    <source src={slide.media.src} />
                  </video>
                ) : (
                  <img
                    src={slide.media.src}
                    alt={slide.media.alt ?? slide.headline}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    class="h-full w-full object-cover"
                  />
                )}
                <span class="pointer-events-none absolute inset-0 bg-surface-deep/50" />
              </div>
            </div>
          </article>
        ))}
      </div>

      <div class="pointer-events-none absolute inset-0 flex items-center justify-between px-4 md:px-10 lg:px-16">
        <button
          type="button"
          aria-label="Previous slide"
          class="pointer-events-auto rounded-full border border-cream/20 bg-[#181c27]/70 p-3 text-cream transition hover:-translate-x-1 hover:bg-cream/10 focus-visible:-translate-x-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold/60"
          onClick$={goPrev}
        >
          <span aria-hidden="true" class="block text-2xl leading-none">
            ‹
          </span>
        </button>
        <button
          type="button"
          aria-label="Next slide"
          class="pointer-events-auto rounded-full border border-cream/20 bg-[#181c27]/70 p-3 text-cream transition hover:translate-x-1 hover:bg-cream/10 focus-visible:translate-x-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold/60"
          onClick$={goNext}
        >
          <span aria-hidden="true" class="block text-2xl leading-none">
            ›
          </span>
        </button>
      </div>

      <div class="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center">
        <ProgressDots
          count={totalSlides}
          currentIndex={activeIndex.value}
          onSelect$={setSlide}
          class="pointer-events-auto"
        />
      </div>
    </section>
  );
});


