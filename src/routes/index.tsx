import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { type DocumentHead, Link } from '@builder.io/qwik-city';
import { AnimatedMetric } from '~/components/AnimatedMetric';
import homepageData from '../data/site/homepage.json';

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

  return (
    <div class="min-h-screen bg-white">
      {/* Hero Section */}
      <section class="relative overflow-hidden bg-white py-24 lg:py-32">
        
        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Content */}
            <div class="space-y-8 scroll-reveal">
              <div class="inline-block">
                <span class="px-4 py-2 glass rounded-full text-sm font-semibold text-primary flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Welcome to my portfolio
                </span>
              </div>

              <div class="space-y-6">
                <h1 class="text-5xl lg:text-6xl xl:text-7xl font-bold text-primary leading-tight">
                  {homepageData.title}
                </h1>
                <p class="text-xl lg:text-2xl text-text-secondary font-medium leading-relaxed">
                  {homepageData.subtitle}
                </p>
              </div>
              
              <p class="text-lg text-text-secondary leading-relaxed max-w-2xl">
                {homepageData.description}
              </p>

              <div class="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/portfolio"
                  class="group px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary-hover transition-all duration-300 text-lg font-semibold flex items-center justify-center gap-2"
                >
                  View My Work
                  <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/contact"
                  class="px-8 py-4 bg-white text-primary rounded-xl hover:bg-neutral transition-all duration-300 text-lg font-semibold border-2 border-primary flex items-center justify-center"
                >
                  Get In Touch
                </Link>
              </div>
            </div>

            {/* Right Column - Hero Image/Video */}
            <div class="relative scroll-reveal">
              {/* Hero Image with overlay */}
              <div class="relative rounded-3xl overflow-hidden shadow-2xl group">
                <img
                  src={homepageData.heroImage}
                  alt={homepageData.heroImageAlt}
                  class="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  width="800"
                  height="600"
                />
                {/* Dark overlay */}
                <div class="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Stats overlay on image */}
                <div class="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <div class="grid grid-cols-2 gap-3">
                    {homepageData.metrics.slice(0, 2).map((metric, index) => (
                      <div key={index} class="glass-dark rounded-xl p-4 backdrop-blur-lg border border-white/20">
                        <div class="text-2xl font-bold text-white mb-1">{metric.value}</div>
                        <div class="text-xs text-white/90 font-medium">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div class="absolute -top-4 -right-4 w-24 h-24 bg-highlight/20 rounded-full blur-2xl animate-pulse-slow" />
              <div class="absolute -bottom-8 -left-8 w-32 h-32 bg-secondary/20 rounded-full blur-2xl animate-pulse-slow" style="animation-delay: 1s" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work - Visual Gallery Style */}
      <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16 scroll-reveal">
            <div class="inline-block mb-4 px-4 py-2 bg-secondary/10 rounded-full">
              <span class="text-sm font-semibold text-secondary uppercase tracking-wide">Featured Work</span>
            </div>
            <h2 class="text-4xl lg:text-5xl font-bold text-text-primary mb-4">
              Visual Case Studies
            </h2>
            <p class="text-xl text-text-secondary max-w-3xl mx-auto">
              See the transformation through design, process, and measurable results
            </p>
          </div>

          {/* Large Featured Card - Hero Style */}
          <div class="mb-8 scroll-reveal">
            <Link
              href={`/portfolio/${homepageData.featuredProjects[0].slug}`}
              class="group relative block rounded-3xl overflow-hidden shadow-2xl hover:shadow-2xl transition-all duration-500"
            >
              <div class="relative aspect-[21/9] lg:aspect-[21/8]">
                <img
                  src={homepageData.featuredProjects[0].image}
                  alt={homepageData.featuredProjects[0].title}
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  width="1400"
                  height="600"
                />
                {/* Dark Overlay */}
                <div class="absolute inset-0 bg-charcoal/70"></div>

                {/* Content Overlay */}
                <div class="absolute inset-0 flex flex-col justify-end p-8 lg:p-12">
                  <div class="max-w-3xl">
                    <div class="inline-block mb-4 px-4 py-2 bg-primary/20 backdrop-blur-sm rounded-lg border border-white/20">
                      <span class="text-sm font-bold text-white">{homepageData.featuredProjects[0].category}</span>
                    </div>
                    <h3 class="text-3xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                      {homepageData.featuredProjects[0].title}
                    </h3>
                    <p class="text-lg lg:text-xl text-white/90 mb-6 drop-shadow-lg">
                      {homepageData.featuredProjects[0].description}
                    </p>
                    <div class="flex gap-3 flex-wrap">
                      {homepageData.featuredProjects[0].tags.map((tag, index) => (
                        <span key={index} class="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg text-sm font-semibold border border-white/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Two Column Featured Cards */}
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {homepageData.featuredProjects.slice(1).map((project, index) => (
              <Link
                key={index}
                href={`/portfolio/${project.slug}`}
                class="group relative block rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 scroll-reveal"
                style={`animation-delay: ${index * 100}ms`}
              >
                <div class="relative aspect-[4/3]">
                  <img
                    src={project.image}
                    alt={project.title}
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    width="800"
                    height="600"
                  />
                  <div class="absolute inset-0 bg-charcoal/70"></div>

                  <div class="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
                    <div class="inline-block mb-3 px-3 py-2 bg-secondary/20 backdrop-blur-sm rounded-lg border border-white/20 self-start">
                      <span class="text-sm font-bold text-white">{project.category}</span>
                    </div>
                    <h3 class="text-2xl lg:text-3xl font-bold text-white mb-3 drop-shadow-lg">
                      {project.title}
                    </h3>
                    <p class="text-white/90 mb-4 drop-shadow-lg">
                      {project.description}
                    </p>
                    <div class="flex gap-2 flex-wrap">
                      {project.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} class="px-3 py-1 bg-white/10 backdrop-blur-sm text-white rounded-lg text-xs font-semibold border border-white/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div class="text-center mt-16 scroll-reveal">
            <Link 
              href="/portfolio" 
              class="inline-flex items-center gap-3 px-8 py-4 glass rounded-xl hover:shadow-lg transition-all duration-300 text-lg font-semibold text-charcoal border border-neutral/20"
            >
              View All Case Studies
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

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
              Specialized skills across design, development, and process innovation
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="group rounded-3xl glass p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 scroll-reveal">
              <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-text-primary mb-4">Design & UX</h3>
              <p class="text-text-secondary leading-relaxed">
                Creating intuitive, beautiful interfaces that solve real business problems through user-centered design principles.
              </p>
            </div>
            
            <div class="group rounded-3xl glass p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 scroll-reveal" style="animation-delay: 100ms">
              <div class="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-text-primary mb-4">Development</h3>
              <p class="text-text-secondary leading-relaxed">
                Building scalable, performant web applications with modern technologies and best practices.
              </p>
            </div>
            
            <div class="group rounded-3xl glass p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 scroll-reveal" style="animation-delay: 200ms">
              <div class="w-16 h-16 bg-highlight rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-text-primary mb-4">Process Innovation</h3>
              <p class="text-text-secondary leading-relaxed">
                Optimizing workflows and operations for maximum efficiency and measurable business impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Video/Image Showcase Section */}
      <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16 scroll-reveal">
            <div class="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full">
              <span class="text-sm font-semibold text-primary uppercase tracking-wide">Showcase</span>
            </div>
            <h2 class="text-4xl lg:text-5xl font-bold text-text-primary mb-4">
              Work in Action
            </h2>
            <p class="text-xl text-text-secondary max-w-3xl mx-auto">
              See real projects come to life through visuals and demonstrations
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Video Placeholder 1 */}
            <div class="group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 scroll-reveal">
              <div class="relative aspect-video bg-neutral/10">
                <img
                  src="https://placehold.co/800x450/6B5D3F/FFFFFF?text=Project+Demo+Video"
                  alt="Project Demo Video"
                  class="w-full h-full object-cover"
                  width="800"
                  height="450"
                />
                {/* Play button overlay */}
                <div class="absolute inset-0 flex items-center justify-center bg-charcoal/40 group-hover:bg-charcoal/30 transition-colors">
                  <div class="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                    <svg class="w-8 h-8 text-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div class="p-6 bg-white border border-neutral/10">
                <h3 class="text-xl font-bold text-text-primary mb-2">Process Overview</h3>
                <p class="text-text-secondary">Watch how design thinking transforms complex problems into elegant solutions</p>
              </div>
            </div>

            {/* Image Showcase 2 */}
            <div class="group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 scroll-reveal" style="animation-delay: 100ms">
              <div class="relative aspect-video">
                <img
                  src="https://placehold.co/800x450/D4A14A/FFFFFF?text=Before+%26+After"
                  alt="Before and After Comparison"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  width="800"
                  height="450"
                />
                <div class="absolute top-4 right-4 glass rounded-lg px-3 py-2">
                  <span class="text-sm font-bold text-highlight">Before & After</span>
                </div>
              </div>
              <div class="p-6 bg-white border border-neutral/10">
                <h3 class="text-xl font-bold text-text-primary mb-2">Visual Transformations</h3>
                <p class="text-text-secondary">See the dramatic improvements in user experience and design</p>
              </div>
            </div>

            {/* Image Grid */}
            <div class="lg:col-span-2 grid grid-cols-3 gap-4 scroll-reveal" style="animation-delay: 200ms">
              <div class="relative aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
                <img
                  src="https://placehold.co/400x400/2E3192/FFFFFF?text=Design+System"
                  alt="Design System"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  width="400"
                  height="400"
                />
                <div class="absolute inset-0 bg-charcoal/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span class="text-white font-semibold text-sm">Design System</span>
                </div>
              </div>
              <div class="relative aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
                <img
                  src="https://placehold.co/400x400/6B5D3F/FFFFFF?text=Wireframes"
                  alt="Wireframes"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  width="400"
                  height="400"
                />
                <div class="absolute inset-0 bg-charcoal/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span class="text-white font-semibold text-sm">Wireframes</span>
                </div>
              </div>
              <div class="relative aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
                <img
                  src="https://placehold.co/400x400/D4A14A/FFFFFF?text=Prototypes"
                  alt="Prototypes"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  width="400"
                  height="400"
                />
                <div class="absolute inset-0 bg-charcoal/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span class="text-white font-semibold text-sm">Prototypes</span>
                </div>
              </div>
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

