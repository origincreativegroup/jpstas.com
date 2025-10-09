import { component$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import { Link } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <div class="min-h-screen">
      {/* Hero Section - Wireframe Inspired */}
      <section class="relative bg-gradient-to-br from-neutral/5 to-lavender/30 py-24 lg:py-32">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div class="space-y-8">
              <div class="space-y-4">
                <h1 class="text-5xl lg:text-6xl xl:text-7xl font-bold text-charcoal leading-tight">
                  Creative Technologist
                  <span class="block text-primary">& Designer</span>
                </h1>
                <p class="text-xl lg:text-2xl text-charcoal/70 font-medium">
                  Transforming business challenges into elegant solutions
                </p>
              </div>
              
              <p class="text-lg text-charcoal/60 leading-relaxed max-w-xl">
                I specialize in design thinking, technical expertise, and operational excellence 
                to deliver measurable results across digital products and business processes.
              </p>

              <div class="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/portfolio" 
                  class="px-8 py-4 bg-primary text-white rounded-xl hover:bg-secondary transition-all text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
                >
                  View My Work
                  <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link 
                  href="/contact" 
                  class="px-8 py-4 bg-white text-primary rounded-xl hover:bg-neutral/10 transition-all text-lg font-semibold shadow-lg border-2 border-primary flex items-center justify-center"
                >
                  Get In Touch
                </Link>
              </div>
            </div>

            {/* Right Column - Visual Elements */}
            <div class="relative">
              <div class="grid grid-cols-2 gap-6">
                {/* Stats Cards */}
                <div class="bg-white rounded-2xl p-6 shadow-lg border border-neutral/10">
                  <div class="text-3xl font-bold text-primary mb-2">80%</div>
                  <div class="text-sm text-charcoal/60">Paper Reduction</div>
                </div>
                <div class="bg-white rounded-2xl p-6 shadow-lg border border-neutral/10 mt-8">
                  <div class="text-3xl font-bold text-secondary mb-2">$100k+</div>
                  <div class="text-sm text-charcoal/60">Revenue Generated</div>
                </div>
                <div class="bg-white rounded-2xl p-6 shadow-lg border border-neutral/10">
                  <div class="text-3xl font-bold text-highlight mb-2">70%</div>
                  <div class="text-sm text-charcoal/60">Time Reduction</div>
                </div>
                <div class="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-white">
                  <div class="text-3xl font-bold mb-2">3</div>
                  <div class="text-sm opacity-90">Case Studies</div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div class="absolute -top-4 -right-4 w-20 h-20 bg-amber/20 rounded-full blur-xl"></div>
              <div class="absolute -bottom-8 -left-8 w-32 h-32 bg-secondary/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work Preview - Wireframe Card Layout */}
      <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-4xl lg:text-5xl font-bold text-charcoal mb-4">
              Featured Case Studies
            </h2>
            <p class="text-xl text-charcoal/60 max-w-3xl mx-auto">
              Real projects, measurable impact, and the process behind them
            </p>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Card 1 - Formstack */}
            <Link
              href="/portfolio/formstack-integration"
              class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-neutral/10 hover:border-primary/20"
            >
              <div class="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden">
                <img 
                  src="https://fa917615d33ac203929027798644acef.r2.cloudflarestorage.com/jpstas-media/formstack-hero.jpg"
                  alt="Formstack Digital Transformation"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
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
              class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-neutral/10 hover:border-primary/20"
            >
              <div class="aspect-video bg-gradient-to-br from-highlight/10 to-primary/10 relative overflow-hidden">
                <img 
                  src="https://fa917615d33ac203929027798644acef.r2.cloudflarestorage.com/jpstas-media/caribbean-hero.jpg"
                  alt="Caribbean Pools E-Commerce"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span class="text-sm font-medium text-highlight">Design</span>
                </div>
              </div>
              <div class="p-6">
                <h3 class="text-xl font-bold text-charcoal mb-3 group-hover:text-primary transition-colors">
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
              class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-neutral/10 hover:border-primary/20"
            >
              <div class="aspect-video bg-gradient-to-br from-secondary/10 to-highlight/10 relative overflow-hidden">
                <img 
                  src="https://fa917615d33ac203929027798644acef.r2.cloudflarestorage.com/jpstas-media/deckhand-hero.jpg"
                  alt="DeckHand Field Service App"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span class="text-sm font-medium text-secondary">Mobile</span>
                </div>
              </div>
              <div class="p-6">
                <h3 class="text-xl font-bold text-charcoal mb-3 group-hover:text-primary transition-colors">
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
          
          <div class="text-center mt-16">
            <Link 
              href="/portfolio" 
              class="inline-flex items-center px-8 py-4 bg-charcoal text-white rounded-xl hover:bg-primary transition-all text-lg font-semibold shadow-lg hover:shadow-xl"
            >
              View All Case Studies
              <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Dashboard Metrics Section */}
      <section class="py-20 bg-neutral/5">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-4xl lg:text-5xl font-bold text-charcoal mb-4">
              Impact Metrics
            </h2>
            <p class="text-xl text-charcoal/60 max-w-3xl mx-auto">
              Quantifiable results from design and development projects
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div class="bg-white rounded-2xl p-6 shadow-lg border border-neutral/10">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span class="text-2xl font-bold text-primary">80%</span>
              </div>
              <h3 class="font-semibold text-charcoal mb-1">Paper Reduction</h3>
              <p class="text-sm text-charcoal/60">Digital transformation impact</p>
            </div>

            <div class="bg-white rounded-2xl p-6 shadow-lg border border-neutral/10">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <span class="text-2xl font-bold text-secondary">$100k+</span>
              </div>
              <h3 class="font-semibold text-charcoal mb-1">Revenue Generated</h3>
              <p class="text-sm text-charcoal/60">E-commerce platform results</p>
            </div>

            <div class="bg-white rounded-2xl p-6 shadow-lg border border-neutral/10">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-highlight/10 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span class="text-2xl font-bold text-highlight">70%</span>
              </div>
              <h3 class="font-semibold text-charcoal mb-1">Time Reduction</h3>
              <p class="text-sm text-charcoal/60">Mobile app efficiency gains</p>
            </div>

            <div class="bg-white rounded-2xl p-6 shadow-lg border border-neutral/10">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span class="text-2xl font-bold text-primary">1000+</span>
              </div>
              <h3 class="font-semibold text-charcoal mb-1">Submissions</h3>
              <p class="text-sm text-charcoal/60">Per season processing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Expertise */}
      <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-4xl lg:text-5xl font-bold text-charcoal mb-4">
              Core Expertise
            </h2>
            <p class="text-xl text-charcoal/60 max-w-3xl mx-auto">
              Specialized skills across design, development, and process innovation
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20">
              <div class="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-charcoal mb-4">Design & UX</h3>
              <p class="text-charcoal/70 leading-relaxed">
                Creating intuitive, beautiful interfaces that solve real business problems through user-centered design principles.
              </p>
            </div>
            
            <div class="bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-2xl p-8 border border-secondary/20">
              <div class="w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center mb-6">
                <svg class="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-charcoal mb-4">Development</h3>
              <p class="text-charcoal/70 leading-relaxed">
                Building scalable, performant web applications with modern technologies and best practices.
              </p>
            </div>
            
            <div class="bg-gradient-to-br from-highlight/5 to-highlight/10 rounded-2xl p-8 border border-highlight/20">
              <div class="w-16 h-16 bg-highlight/20 rounded-2xl flex items-center justify-center mb-6">
                <svg class="w-8 h-8 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* CTA Section - Wireframe Style */}
      <section class="py-20 bg-gradient-to-br from-charcoal to-primary text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <h2 class="text-4xl lg:text-5xl font-bold mb-6">
              Let's Build Something Great
            </h2>
            <p class="text-xl mb-12 text-white/80 max-w-3xl mx-auto">
              I'm always interested in hearing about new projects and opportunities. 
              Let's discuss how we can create meaningful impact together.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                class="inline-flex items-center px-8 py-4 bg-white text-charcoal rounded-xl hover:bg-neutral/10 transition-all text-lg font-semibold shadow-lg hover:shadow-xl"
              >
                Start a Conversation
                <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </Link>
              <Link 
                href="/portfolio" 
                class="inline-flex items-center px-8 py-4 bg-primary/20 text-white rounded-xl hover:bg-primary/30 transition-all text-lg font-semibold border border-white/20"
              >
                View My Work
                <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
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

