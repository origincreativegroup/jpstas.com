import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { type DocumentHead, Link } from '@builder.io/qwik-city';
import { AnimatedMetric } from '~/components/AnimatedMetric';

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
      <section class="relative overflow-hidden bg-gradient-to-br from-white via-neutral/10 to-primary/5 py-24 lg:py-32">
        {/* Animated Background Elements */}
        <div class="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div class="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float" style="animation-delay: 2s" />
        
        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Content */}
            <div class="space-y-8 scroll-reveal">
              <div class="inline-block">
                <span class="px-4 py-2 glass rounded-full text-sm font-semibold text-primary">
                  👋 Welcome to my portfolio
                </span>
              </div>

              <div class="space-y-6">
                <h1 class="text-5xl lg:text-6xl xl:text-7xl font-bold text-charcoal leading-tight">
                  Creative Technologist
                  <span class="block bg-gradient-to-r from-primary via-secondary to-highlight bg-clip-text text-transparent">
                    & Designer
                  </span>
                </h1>
                <p class="text-xl lg:text-2xl text-charcoal/70 font-medium leading-relaxed">
                  Transforming business challenges into elegant solutions
                </p>
              </div>
              
              <p class="text-lg text-charcoal/60 leading-relaxed max-w-2xl">
                I specialize in design thinking, technical expertise, and operational excellence 
                to deliver measurable results across digital products and business processes.
              </p>

              <div class="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  href="/portfolio" 
                  class="group px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-glow-lg transition-all duration-300 text-lg font-semibold transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  View My Work
                  <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link 
                  href="/contact" 
                  class="px-8 py-4 glass text-primary rounded-xl hover:shadow-lg transition-all duration-300 text-lg font-semibold border border-primary/20 flex items-center justify-center"
                >
                  Get In Touch
                </Link>
              </div>
            </div>

            {/* Right Column - Stats Cards */}
            <div class="relative scroll-reveal">
              <div class="grid grid-cols-2 gap-6">
                <AnimatedMetric value="80%" label="Paper Reduction" />
                <div class="mt-8">
                  <AnimatedMetric value="$100k+" label="Revenue Generated" />
                </div>
                <AnimatedMetric value="70%" label="Time Reduction" />
                <div class="glass rounded-2xl p-6 bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30">
                  <div class="text-3xl font-bold text-primary mb-2">3</div>
                  <div class="text-sm text-charcoal/80 font-medium">Featured Projects</div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div class="absolute -top-4 -right-4 w-24 h-24 bg-highlight/20 rounded-full blur-2xl animate-pulse-slow" />
              <div class="absolute -bottom-8 -left-8 w-32 h-32 bg-secondary/20 rounded-full blur-2xl animate-pulse-slow" style="animation-delay: 1s" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section class="py-20 bg-gradient-to-b from-white to-neutral/5">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16 scroll-reveal">
            <div class="inline-block mb-4 px-4 py-2 bg-secondary/10 rounded-full">
              <span class="text-sm font-semibold text-secondary uppercase tracking-wide">Featured Work</span>
            </div>
            <h2 class="text-4xl lg:text-5xl font-bold text-charcoal mb-4">
              Case Studies
            </h2>
            <p class="text-xl text-charcoal/60 max-w-3xl mx-auto">
              Real projects, measurable impact, and the process behind them
            </p>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Card 1 - Formstack */}
            <Link
              href="/portfolio/formstack-integration"
              class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-neutral/10 hover:border-primary/30 transform hover:-translate-y-2 scroll-reveal"
            >
              <div class="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden">
                <img 
                  src="https://fa917615d33ac203929027798644acef.r2.cloudflarestorage.com/jpstas-media/formstack-hero.jpg"
                  alt="Formstack Digital Transformation"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div class="absolute top-4 left-4 glass rounded-lg px-3 py-1">
                  <span class="text-sm font-medium text-primary">Process</span>
                </div>
              </div>
              <div class="p-6">
                <h3 class="text-xl font-bold text-charcoal mb-3 group-hover:text-primary transition-colors">
                  Formstack Digital Forms
                </h3>
                <p class="text-charcoal/60 mb-4 leading-relaxed">
                  80% paper reduction, 1,000+ submissions per season
                </p>
                <div class="flex gap-2 flex-wrap">
                  <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    Automation
                  </span>
                  <span class="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
                    Process
                  </span>
                </div>
              </div>
            </Link>

            {/* Card 2 - Caribbean Pools */}
            <Link
              href="/portfolio/caribbeanpools-redesign"
              class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-neutral/10 hover:border-secondary/30 transform hover:-translate-y-2 scroll-reveal"
              style="animation-delay: 100ms"
            >
              <div class="aspect-video bg-gradient-to-br from-highlight/10 to-primary/10 relative overflow-hidden">
                <img 
                  src="https://fa917615d33ac203929027798644acef.r2.cloudflarestorage.com/jpstas-media/caribbean-hero.jpg"
                  alt="Caribbean Pools E-Commerce"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div class="absolute top-4 left-4 glass rounded-lg px-3 py-1">
                  <span class="text-sm font-medium text-highlight">Design</span>
                </div>
              </div>
              <div class="p-6">
                <h3 class="text-xl font-bold text-charcoal mb-3 group-hover:text-secondary transition-colors">
                  E-Commerce Platform
                </h3>
                <p class="text-charcoal/60 mb-4 leading-relaxed">
                  $100k+ revenue in first year from complete redesign
                </p>
                <div class="flex gap-2 flex-wrap">
                  <span class="px-3 py-1 bg-highlight/10 text-highlight rounded-full text-sm font-medium">
                    E-Commerce
                  </span>
                  <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    Design
                  </span>
                </div>
              </div>
            </Link>

            {/* Card 3 - DeckHand */}
            <Link
              href="/portfolio/deckhand-prototype"
              class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-neutral/10 hover:border-highlight/30 transform hover:-translate-y-2 scroll-reveal"
              style="animation-delay: 200ms"
            >
              <div class="aspect-video bg-gradient-to-br from-secondary/10 to-highlight/10 relative overflow-hidden">
                <img 
                  src="https://fa917615d33ac203929027798644acef.r2.cloudflarestorage.com/jpstas-media/deckhand-hero.jpg"
                  alt="DeckHand Field Service App"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div class="absolute top-4 left-4 glass rounded-lg px-3 py-1">
                  <span class="text-sm font-medium text-secondary">Mobile</span>
                </div>
              </div>
              <div class="p-6">
                <h3 class="text-xl font-bold text-charcoal mb-3 group-hover:text-highlight transition-colors">
                  Field Service App
                </h3>
                <p class="text-charcoal/60 mb-4 leading-relaxed">
                  70% time reduction with offline-first mobile app
                </p>
                <div class="flex gap-2 flex-wrap">
                  <span class="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
                    Mobile
                  </span>
                  <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    Development
                  </span>
                </div>
              </div>
            </Link>
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
            <h2 class="text-4xl lg:text-5xl font-bold text-charcoal mb-4">
              Core Skills
            </h2>
            <p class="text-xl text-charcoal/60 max-w-3xl mx-auto">
              Specialized skills across design, development, and process innovation
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="group rounded-3xl glass p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 scroll-reveal">
              <div class="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-charcoal mb-4">Design & UX</h3>
              <p class="text-charcoal/70 leading-relaxed">
                Creating intuitive, beautiful interfaces that solve real business problems through user-centered design principles.
              </p>
            </div>
            
            <div class="group rounded-3xl glass p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 scroll-reveal" style="animation-delay: 100ms">
              <div class="w-16 h-16 bg-gradient-to-br from-secondary to-secondary/60 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-charcoal mb-4">Development</h3>
              <p class="text-charcoal/70 leading-relaxed">
                Building scalable, performant web applications with modern technologies and best practices.
              </p>
            </div>
            
            <div class="group rounded-3xl glass p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 scroll-reveal" style="animation-delay: 200ms">
              <div class="w-16 h-16 bg-gradient-to-br from-highlight to-highlight/60 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-charcoal mb-4">Process Innovation</h3>
              <p class="text-charcoal/70 leading-relaxed">
                Optimizing workflows and operations for maximum efficiency and measurable business impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section class="py-20 relative overflow-hidden scroll-reveal">
        <div class="absolute inset-0 bg-gradient-to-br from-charcoal via-primary to-secondary" />
        <div class="absolute inset-0 opacity-10">
          <div class="absolute inset-0" style="background-image: radial-gradient(circle, #FFFFFF 1px, transparent 1px); background-size: 40px 40px;" />
        </div>
        
        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-4xl lg:text-5xl font-bold mb-6 text-white">
            Let's Build Something Great
          </h2>
          <p class="text-xl mb-12 text-white/80 max-w-3xl mx-auto leading-relaxed">
            I'm always interested in hearing about new projects and opportunities. 
            Let's discuss how we can create meaningful impact together.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              class="inline-flex items-center gap-3 px-8 py-4 bg-white text-charcoal rounded-xl hover:shadow-2xl transition-all duration-300 text-lg font-semibold transform hover:scale-105"
            >
              Start a Conversation
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </Link>
            <Link 
              href="/portfolio" 
              class="inline-flex items-center gap-3 px-8 py-4 glass-dark text-white rounded-xl hover:bg-white/20 transition-all duration-300 text-lg font-semibold border border-white/20"
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

