import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { type DocumentHead, Link } from '@builder.io/qwik-city';

export default component$(() => {
  const selectedFilter = useSignal('all');
  const isAnimating = useSignal(false);

  const projects = [
    {
      id: 'formstack-integration',
      title: 'Formstack Digital Transformation',
      category: 'process',
      tags: ['Process Automation', 'Form UX', 'CRM'],
      description: 'Turned paper chaos into a digital command center. 80% paper reduction, 1,000+ submissions per season.',
      image: 'https://media.jpstas.com/formstack-hero.jpg',
      slug: 'formstack-integration',
      featured: true,
    },
    {
      id: 'caribbeanpools-redesign',
      title: 'Caribbean Pools Website Redesign',
      category: 'design',
      tags: ['Web Design', 'UI/UX', 'WordPress'],
      description: 'Website redesign that tells the story of the pool lifecycle with process visualization and improved engagement.',
      image: 'https://media.jpstas.com/caribbean-hero.jpg',
      slug: 'caribbeanpools-redesign',
      featured: true,
    },
    {
      id: 'shopcaribbeanpools',
      title: 'ShopCaribbeanPools.com E-Commerce',
      category: 'development',
      tags: ['E-Commerce', 'UX Design', 'Web Development'],
      description: 'E-commerce platform generating $100K+ in first year by digitizing the Early Buy program.',
      image: 'https://media.jpstas.com/shop-hero.jpg',
      slug: 'shopcaribbeanpools',
      featured: true,
    },
    {
      id: 'deckhand-prototype',
      title: 'DeckHand Field Service App',
      category: 'development',
      tags: ['Mobile App', 'React Native', 'UX'],
      description: 'Field service app prototype reducing report time by 70% with offline-first architecture.',
      image: 'https://media.jpstas.com/deckhand-hero.jpg',
      slug: 'deckhand-prototype',
      featured: true,
    },
    {
      id: 'mindforge',
      title: 'MindForge: AI Process Mapping',
      category: 'development',
      tags: ['AI', 'SaaS', 'Data Visualization'],
      description: 'AI-powered SaaS platform turning text descriptions into interactive workflow visualizations with 80% accuracy.',
      image: 'https://media.jpstas.com/mindforge-hero.jpg',
      slug: 'mindforge',
      featured: true,
    },
    {
      id: 'print-studio',
      title: 'In-House Print Studio Build',
      category: 'process',
      tags: ['Print Production', 'Workflow', 'Process Innovation'],
      description: 'Built in-house print and apparel studio saving $250K+ and producing 100+ fleet wraps and 120+ uniforms annually.',
      image: 'https://media.jpstas.com/portfolio/PrintStudio/IMG_0620.jpeg',
      slug: 'print-studio',
      featured: true,
    },
    {
      id: 'brand-evolution',
      title: 'Caribbean Pools Brand Evolution',
      category: 'design',
      tags: ['Brand Identity', 'Design Systems', 'Creative Direction'],
      description: 'Decade-long brand transformation from $7M to $17M with unified identity across all channels.',
      image: 'https://media.jpstas.com/brand-evolution-hero.jpg',
      slug: 'brand-evolution',
      featured: true,
    },
    {
      id: 'drone-media',
      title: 'Drone Photo & Video Project',
      category: 'design',
      tags: ['Drone Photography', 'FPV', 'Content Production'],
      description: 'Cinematic drone media campaign achieving 400% increase in social engagement and creating reusable media library.',
      image: 'https://media.jpstas.com/drone-hero.jpg',
      slug: 'drone-media',
      featured: false,
    },
    {
      id: 'email-marketing',
      title: 'Email Marketing Campaigns',
      category: 'design',
      tags: ['Email Marketing', 'Automation', 'CRM Integration'],
      description: 'Automated email campaigns achieving 45-60% open rates and 80% automation of customer communications.',
      image: 'https://media.jpstas.com/email-marketing-hero.jpg',
      slug: 'email-marketing',
      featured: false,
    },
    {
      id: 'ivr-system',
      title: 'IVR Call Menu Optimization',
      category: 'process',
      tags: ['IVR System', 'Customer Experience', 'Process Optimization'],
      description: 'Intelligent call routing reducing handling time by 35% and dropped calls by 60%.',
      image: 'https://media.jpstas.com/ivr-hero.jpg',
      slug: 'ivr-system',
      featured: false,
    },
  ];

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
              class={`group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 block scroll-reveal hover:-translate-y-2 ${
                isAnimating.value ? 'opacity-0' : ''
              }`}
            >
              {/* Hero Image Section - 60% of card */}
              <div class="relative aspect-[4/3] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
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
              <div class="p-6 bg-white border border-neutral/10 flex flex-col justify-between min-h-[160px]">
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
