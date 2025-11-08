import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { type DocumentHead, Link } from '@builder.io/qwik-city';
import homepageData from '../data/site/homepage.json';
import { HeroCarousel } from '../components/home/HeroCarousel';
import { BentoGrid } from '../components/home/BentoGrid';

export default component$(() => {
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

  // Prepare data for carousel (first 3 projects) and Bento grid (next 6 projects)
  const carouselProjects = homepageData.featuredProjects.slice(0, 3);
  const bentoProjects = homepageData.featuredProjects.slice(3, 9);

  return (
    <div class="min-h-screen bg-white">
      {/* Hero Carousel - Cinematic showcase of top 3 projects */}
      <HeroCarousel projects={carouselProjects} />

      {/* Bento Grid - Mosaic of featured works */}
      <BentoGrid projects={bentoProjects} />

      {/* Core Expertise */}
      <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16 scroll-reveal">
            <div class="inline-block mb-4 px-4 py-2 bg-highlight/10 rounded-full">
              <span class="text-sm font-semibold text-highlight uppercase tracking-wide">Expertise</span>
            </div>
            <h2 class="text-4xl lg:text-5xl font-bold text-text-primary mb-4">
              Core Skills
            </h2>
            <p class="text-xl text-text-secondary max-w-3xl mx-auto">
              Specialized skills across brand design, media production, and operational systems
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="group rounded-3xl glass p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 scroll-reveal">
              <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-text-primary mb-4">Brand & Visual Design</h3>
              <p class="text-text-secondary leading-relaxed">
                Creating unified brand identities and scalable design systems that bring consistency across print, digital, fleet, and apparel.
              </p>
            </div>

            <div class="group rounded-3xl glass p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 scroll-reveal" style="animation-delay: 100ms">
              <div class="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-text-primary mb-4">Media Production</h3>
              <p class="text-text-secondary leading-relaxed">
                Producing cinematic photography, drone videography, and motion graphics that tell compelling brand stories across all channels.
              </p>
            </div>

            <div class="group rounded-3xl glass p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 scroll-reveal" style="animation-delay: 200ms">
              <div class="w-16 h-16 bg-highlight rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-text-primary mb-4">Process & Systems</h3>
              <p class="text-text-secondary leading-relaxed">
                Engineering production workflows, digital platforms, and automation systems that scale operations and deliver measurable results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section class="py-20 bg-neutral">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-4xl lg:text-5xl font-bold mb-6 text-primary">
            Let's Build Something Great
          </h2>
          <p class="text-xl mb-12 text-text-secondary max-w-3xl mx-auto leading-relaxed">
            I'm always interested in hearing about new projects and opportunities.
            Let's discuss how we can create meaningful impact together.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              class="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary-hover transition-all duration-300 text-lg font-semibold"
            >
              Start a Conversation
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </Link>
            <Link
              href="/portfolio"
              class="inline-flex items-center gap-3 px-8 py-4 bg-white text-primary rounded-xl hover:bg-neutral transition-all duration-300 text-lg font-semibold border-2 border-primary"
            >
              View My Work
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'John P. Stas - Creative Technologist & Designer',
  meta: [
    {
      name: 'description',
      content: 'Portfolio of John P. Stas - Creative Technologist, Designer, and Process Innovator specializing in design, development, and operational excellence.',
    },
  ],
};

