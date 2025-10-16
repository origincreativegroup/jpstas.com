import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { type DocumentHead, Link, routeLoader$ } from '@builder.io/qwik-city';
import type { CaseStudy } from '~/types/case-study';

// Import all case study JSON files
import formstackData from '~/data/formstack.json';
import caribbeanpoolsData from '~/data/caribbeanpools.json';
import deckhandData from '~/data/deckhand.json';
import mindforgeData from '~/data/mindforge.json';
import printstudioData from '~/data/printstudio.json';
import brandEvolutionData from '~/data/brand-evolution.json';
import droneMediaData from '~/data/drone-media.json';
import emailMarketingData from '~/data/email-marketing.json';
import ivrSystemData from '~/data/ivr-system.json';

// Map case studies with their categories and featured status
const caseStudyMapping = [
  { data: formstackData as CaseStudy, category: 'process', featured: true },
  { data: caribbeanpoolsData as CaseStudy, category: 'development', featured: true },
  { data: deckhandData as CaseStudy, category: 'development', featured: true },
  { data: mindforgeData as CaseStudy, category: 'development', featured: true },
  { data: printstudioData as CaseStudy, category: 'process', featured: true },
  { data: brandEvolutionData as CaseStudy, category: 'design', featured: true },
  { data: droneMediaData as CaseStudy, category: 'design', featured: false },
  { data: emailMarketingData as CaseStudy, category: 'design', featured: false },
  { data: ivrSystemData as CaseStudy, category: 'process', featured: false },
];

export default component$(() => {
  const selectedFilter = useSignal('all');
  const isAnimating = useSignal(false);

  // Transform case study data into project format
  const projects = caseStudyMapping.map(({ data, category, featured }) => ({
    id: data.slug,
    title: data.title,
    category,
    tags: data.meta?.tags || [],
    description: data.tagline,
    image: data.cardImage?.src || data.hero?.src || '',
    alt: data.cardImage?.alt || data.hero?.alt || data.title,
    slug: data.slug,
    featured,
  }));

  const categories = [
    {
      id: 'all',
      label: 'All Projects',
      icon: <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
    },
    {
      id: 'design',
      label: 'Design',
      icon: <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" /></svg>
    },
    {
      id: 'development',
      label: 'Development',
      icon: <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
    },
    {
      id: 'process',
      label: 'Process & Operations',
      icon: <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    },
  ];

  const filteredProjects = selectedFilter.value === 'all'
    ? projects
    : projects.filter(p => p.category === selectedFilter.value);

  // Scroll reveal animation
  useVisibleTask$(() => {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  });

  return (
    <div class="min-h-screen bg-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <section class="text-center mb-16 scroll-reveal">
          <div class="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full">
            <span class="text-sm font-semibold text-primary uppercase tracking-wide">Selected Work</span>
          </div>
          <h1 class="text-5xl lg:text-6xl font-bold mb-6 text-primary">
            Portfolio
          </h1>
          <p class="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            A showcase of projects spanning design, development, and operational excellence
          </p>
        </section>

        {/* Filter with Glassmorphism */}
        <div class="flex justify-center gap-3 mb-16 flex-wrap scroll-reveal">
          {categories.map((cat, index) => (
            <button
              key={cat.id}
              onClick$={() => {
                selectedFilter.value = cat.id;
                isAnimating.value = true;
                setTimeout(() => (isAnimating.value = false), 300);
              }}
              style={{ animationDelay: `${index * 100}ms` }}
              class={`group flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                selectedFilter.value === cat.id
                  ? 'glass scale-105 shadow-glow text-primary'
                  : 'bg-white/80 text-charcoal hover:bg-white hover:shadow-lg hover:scale-105'
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Grid with Image-First Design */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filteredProjects.map((project, index) => (
            <Link
              key={project.id}
              href={`/portfolio/${project.slug}`}
              style={{ animationDelay: `${index * 100}ms` }}
              class={`group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 block scroll-reveal hover:-translate-y-2 flex flex-col ${
                isAnimating.value ? 'opacity-0' : ''
              }`}
            >
              {/* Hero Image Section - 60% of card */}
              <div class="relative aspect-[4/3] overflow-hidden w-full">
                <img
                  src={project.image}
                  alt={project.alt}
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Gradient Overlay for Featured Badge Visibility */}
                <div class="absolute inset-0 bg-gradient-to-b from-charcoal/20 via-transparent to-transparent"></div>
                
                {/* Featured Badge */}
                {project.featured && (
                  <div class="absolute top-4 right-4 z-10 glass rounded-lg px-3 py-2 backdrop-blur-sm">
                    <span class="text-sm font-bold text-highlight">Featured</span>
                  </div>
                )}
              </div>

              {/* Content Section - 40% of card */}
              <div class="p-6 bg-white border border-neutral/10 flex flex-col justify-between min-h-[160px] w-full">
                <div class="flex-1">
                  <h3 class="text-xl font-bold mb-3 text-primary leading-tight">
                    {project.title}
                  </h3>
                  <p class="text-text-secondary leading-relaxed text-sm line-clamp-3">{project.description}</p>
                </div>

                {/* Tags */}
                <div class="flex flex-wrap gap-2 mt-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      class="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section with Glassmorphism */}
        <section class="text-center py-20 relative overflow-hidden rounded-3xl scroll-reveal">
          {/* Animated Background */}
          <div class="absolute inset-0 bg-neutral/5">
            <div class="absolute top-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-float" />
            <div class="absolute bottom-10 right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-float" style="animation-delay: 1s" />
          </div>

          <div class="relative z-10 glass rounded-3xl p-12">
            <h2 class="text-4xl font-bold mb-4 text-text-primary">Interested in working together?</h2>
            <p class="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              Let's discuss how I can help bring your project to life
            </p>
            <Link
              href="/contact"
              class="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-xl hover:shadow-lg transition-all duration-300 text-lg font-semibold transform hover:scale-105"
            >
              Start a Project
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Portfolio - John P. Stas',
  meta: [
    {
      name: 'description',
      content: 'View the portfolio of John P. Stas showcasing design, development, and operational projects.',
    },
  ],
};
