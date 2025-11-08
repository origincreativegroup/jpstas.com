import { component$, useSignal, useVisibleTask$, useComputed$ } from '@builder.io/qwik';
import { type DocumentHead, Link } from '@builder.io/qwik-city';
import homepageData from '../data/site/homepage.json';

const allVideos = [
  {
    id: 'af4889355cd0d36bac6722871cb2bcb3',
    title: 'FPV Drone Flythrough',
    aspectRatio: '16:9',
    tags: ['Drone', 'Marketing'],
  },
  {
    id: 'placeholder_id_2',
    title: 'Vertical Reel 3',
    aspectRatio: '16:9',
    tags: ['Social Media'],
  },
  {
    id: 'placeholder_id_3',
    title: 'Square Social Reel 1',
    aspectRatio: '9:16',
    tags: ['Social Media'],
  },
  {
    id: 'placeholder_id_4',
    title: 'Square Social Reel 2',
    aspectRatio: '9:16',
    tags: ['Social Media'],
  },
  {
    id: 'placeholder_id_5',
    title: 'Square Social Reel 3',
    aspectRatio: '1:1',
    tags: ['Social Media', 'Educational'],
  },
  {
    id: 'placeholder_id_6',
    title: 'Square Social Reel 4',
    aspectRatio: '1:1',
    tags: ['Social Media', 'Training'],
  },
  {
    id: '0bb120ea124abda2d3354c5dad0b880c',
    title: 'Landscape Showcase',
    aspectRatio: '16:9',
    tags: ['Drone', 'Marketing'],
  },
];
const allTags = ['All', 'Social Media', 'Educational', 'Training', 'Drone', 'Marketing'];

export default component$(() => {
  const featuredVideo = useSignal(allVideos[0]);
  const selectedTag = useSignal('All');

  const filteredVideos = useComputed$(() => {
    if (selectedTag.value === 'All') {
      return allVideos;
    }
    return allVideos.filter((video) => video.tags.includes(selectedTag.value));
  });

  const getPaddingBottom = (aspectRatio: string) => {
    const [width, height] = aspectRatio.split(':').map(Number);
    return `${(height / width) * 100}%`;
  };

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

      {/* Video Media Gallery */}
      <section class="py-20 bg-gradient-to-b from-white via-neutral/20 to-white relative overflow-hidden">
        {/* Animated background elements */}
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
          <div class="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 1s" />
        </div>

        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div class="text-center mb-12 scroll-reveal">
            <div class="inline-flex items-center gap-2 mb-6 px-5 py-2 glass rounded-full border border-primary/20">
              <div class="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span class="text-sm font-bold text-primary uppercase tracking-wider">Featured Work</span>
            </div>
            <h2 class="text-5xl lg:text-7xl font-black text-charcoal mb-6">
              Visual Stories
            </h2>
            <p class="text-xl text-text-secondary max-w-2xl mx-auto">
              Immersive content that captivates and inspires
            </p>
          </div>
          
          {/* Tag Filter */}
          <div class="flex justify-center flex-wrap gap-4 mb-8 scroll-reveal">
            {allTags.map((tag) => (
              <button
                key={tag}
                class={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  selectedTag.value === tag
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white text-text-secondary hover:bg-neutral/50'
                }`}
                onClick$={() => selectedTag.value = tag}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Featured Video Player */}
          <div class="mb-8 scroll-reveal">
            <div class="group relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-700 max-w-4xl mx-auto">
              <div class="relative w-full" style={{ paddingBottom: getPaddingBottom(featuredVideo.value.aspectRatio) }}>
                <iframe
                  src={`https://customer-h044ipu9nb6m47zm.cloudflarestream.com/${featuredVideo.value.id}/iframe`}
                  class="absolute inset-0 w-full h-full"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullscreen
                  title={featuredVideo.value.title}
                />
              </div>
            </div>
          </div>

          {/* Video Thumbnail Gallery */}
          <div class="scroll-reveal">
            <div class="flex justify-center gap-4 pb-4 overflow-x-auto">
              {filteredVideos.value.map((video) => {
                const [width, height] = video.aspectRatio.split(':').map(Number);
                return (
                  <div
                    key={video.id}
                    class="flex-none rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 relative"
                    style={{ width: `${(144 * width) / height}px`, height: '144px' }}
                    onClick$={() => featuredVideo.value = video}
                  >
                    <img
                      src={`https://customer-h044ipu9nb6m47zm.cloudflarestream.com/${video.id}/thumbnails/thumbnail.jpg`}
                      alt={video.title}
                      class="w-full h-full object-cover"
                      width={(144 * width) / height}
                      height={144}
                    />
                    <div class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Section */}
          <div class="mt-16 text-center scroll-reveal">
            <Link
              href="/media-gallery"
              class="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-primary to-primary-hover text-white rounded-2xl hover:shadow-2xl transition-all duration-500 text-lg font-bold hover:scale-105"
            >
              <span>Explore Full Gallery</span>
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <p class="mt-4 text-text-secondary text-sm">View all 11 videos in our collection</p>
          </div>

          {/* Stats/Context */}
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-20 scroll-reveal">
            <div class="group rounded-2xl glass p-6 hover:shadow-xl transition-all duration-300 border border-primary/10">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
                <h3 class="font-bold text-text-primary">Cinematic Production</h3>
              </div>
              <p class="text-sm text-text-secondary">
                Professional drone cinematography and FPV videography for marketing and storytelling
              </p>
            </div>

            <div class="group rounded-2xl glass p-6 hover:shadow-xl transition-all duration-300 border border-secondary/10">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 class="font-bold text-text-primary">Workflow Documentation</h3>
              </div>
              <p class="text-sm text-text-secondary">
                Visual storytelling that documents processes and showcases operational excellence
              </p>
            </div>

            <div class="group rounded-2xl glass p-6 hover:shadow-xl transition-all duration-300 border border-highlight/10">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 bg-highlight/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 class="font-bold text-text-primary">Visual Impact</h3>
              </div>
              <p class="text-sm text-text-secondary">
                Professional video content that elevates brand perception and drives engagement
              </p>
            </div>
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

