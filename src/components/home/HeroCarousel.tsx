import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

interface CarouselProject {
  title: string;
  slug: string;
  description: string;
  image: string;
  category: string;
}

interface HeroCarouselProps {
  projects: CarouselProject[];
}

export const HeroCarousel = component$<HeroCarouselProps>(({ projects }) => {
  const currentSlide = useSignal(0);
  const isTransitioning = useSignal(false);

  // Auto-advance carousel
  useVisibleTask$(({ cleanup }) => {
    const interval = setInterval(() => {
      if (!isTransitioning.value) {
        isTransitioning.value = true;
        currentSlide.value = (currentSlide.value + 1) % projects.length;

        setTimeout(() => {
          isTransitioning.value = false;
        }, 1000);
      }
    }, 5000); // Change slide every 5 seconds

    cleanup(() => clearInterval(interval));
  });

  return (
    <section class="relative w-full h-screen overflow-hidden bg-charcoal">
      {/* Slides */}
      <div class="relative w-full h-full">
        {projects.map((project, index) => (
          <Link
            key={index}
            href={`/portfolio/${project.slug}`}
            class={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide.value ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Image with Ken Burns effect */}
            <div class="absolute inset-0 overflow-hidden">
              <div
                class={`w-full h-full transition-transform duration-[8000ms] ease-out ${
                  index === currentSlide.value ? 'scale-110' : 'scale-100'
                }`}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  class="w-full h-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </div>
            </div>

            {/* Dark overlay gradient */}
            <div class="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent opacity-90" />

            {/* Content overlay - bottom corner */}
            <div class="absolute bottom-0 left-0 right-0 p-8 lg:p-16 z-20">
              <div class="max-w-7xl mx-auto">
                {/* Category badge */}
                <div
                  class={`inline-block mb-4 px-4 py-2 bg-primary/30 backdrop-blur-md rounded-lg border border-white/30 transition-all duration-1000 delay-300 ${
                    index === currentSlide.value
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                >
                  <span class="text-sm font-bold text-white uppercase tracking-wide">
                    {project.category}
                  </span>
                </div>

                {/* Title */}
                <h2
                  class={`text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl max-w-4xl transition-all duration-1000 delay-500 ${
                    index === currentSlide.value
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                >
                  {project.title}
                </h2>

                {/* Description */}
                <p
                  class={`text-lg md:text-xl lg:text-2xl text-white/90 drop-shadow-xl max-w-3xl transition-all duration-1000 delay-700 ${
                    index === currentSlide.value
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                >
                  {project.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Navigation dots */}
      <div class="absolute bottom-8 right-8 z-30 flex gap-3">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick$={() => {
              if (!isTransitioning.value && index !== currentSlide.value) {
                isTransitioning.value = true;
                currentSlide.value = index;
                setTimeout(() => {
                  isTransitioning.value = false;
                }, 1000);
              }
            }}
            class={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide.value
                ? 'bg-white w-12'
                : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 animate-bounce">
        <div class="flex flex-col items-center gap-2 text-white/70">
          <span class="text-xs uppercase tracking-widest">Scroll to explore</span>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
});
