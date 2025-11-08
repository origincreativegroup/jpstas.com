import { component$, useSignal } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

interface BentoProject {
  title: string;
  slug: string;
  image: string;
  category: string;
}

interface BentoGridProps {
  projects: BentoProject[];
}

export const BentoGrid = component$<BentoGridProps>(({ projects }) => {
  const hoveredIndex = useSignal<number | null>(null);

  // Define grid layout patterns - adjust based on number of projects
  // For 6 items: 1 large (2x2), 2 medium (1x2), 3 small (1x1)
  const getGridItemClass = (index: number) => {
    const patterns = [
      // Index 0: Large signature project (spans 2 columns and 2 rows on large screens)
      'col-span-1 row-span-1 md:col-span-2 md:row-span-2',
      // Index 1: Medium vertical
      'col-span-1 row-span-1 md:row-span-2',
      // Index 2: Small square
      'col-span-1 row-span-1',
      // Index 3: Medium horizontal
      'col-span-1 row-span-1 md:col-span-2',
      // Index 4: Small square
      'col-span-1 row-span-1',
      // Index 5: Small square
      'col-span-1 row-span-1',
    ];

    return patterns[index] || 'col-span-1 row-span-1';
  };

  return (
    <section class="py-20 bg-neutral">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid container - Bento box style */}
        <div class="grid grid-cols-1 md:grid-cols-4 auto-rows-[280px] gap-4">
          {projects.map((project, index) => (
            <Link
              key={index}
              href={`/portfolio/${project.slug}`}
              class={`group relative overflow-hidden rounded-3xl ${getGridItemClass(index)}`}
              onMouseEnter$={() => (hoveredIndex.value = index)}
              onMouseLeave$={() => (hoveredIndex.value = null)}
            >
              {/* Image */}
              <div class="absolute inset-0">
                <img
                  src={project.image}
                  alt={project.title}
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              {/* Overlay - always visible on mobile, hover on desktop */}
              <div
                class={`absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent transition-opacity duration-500 ${
                  hoveredIndex.value === index ? 'opacity-90 md:opacity-90' : 'opacity-70 md:opacity-0'
                }`}
              />

              {/* Content - shows on hover */}
              <div
                class={`absolute inset-0 p-6 flex flex-col justify-end transition-all duration-500 ${
                  hoveredIndex.value === index
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-100 md:opacity-0 translate-y-0 md:translate-y-4'
                }`}
              >
                {/* Category badge */}
                <div class="inline-block mb-3 px-3 py-1 bg-primary/30 backdrop-blur-md rounded-lg border border-white/30 self-start">
                  <span class="text-xs font-bold text-white uppercase tracking-wide">
                    {project.category}
                  </span>
                </div>

                {/* Title */}
                <h3
                  class={`font-bold text-white drop-shadow-2xl ${
                    index === 0 ? 'text-3xl lg:text-4xl' : 'text-xl lg:text-2xl'
                  }`}
                >
                  {project.title}
                </h3>

                {/* View arrow - appears on hover */}
                <div
                  class={`mt-4 flex items-center gap-2 text-white/90 font-semibold transition-all duration-300 ${
                    hoveredIndex.value === index ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}
                >
                  <span class="text-sm">View Project</span>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>

              {/* Subtle border glow on hover */}
              <div
                class={`absolute inset-0 rounded-3xl border-2 transition-all duration-500 ${
                  hoveredIndex.value === index
                    ? 'border-primary/60 shadow-2xl shadow-primary/20'
                    : 'border-transparent'
                }`}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
});
