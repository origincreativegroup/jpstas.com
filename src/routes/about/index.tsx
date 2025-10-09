import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { type DocumentHead, Link } from '@builder.io/qwik-city';

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
    <div class="min-h-screen bg-gradient-to-b from-white via-neutral/5 to-white py-16">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <section class="mb-16 scroll-reveal">
          <div class="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full">
            <span class="text-sm font-semibold text-primary uppercase tracking-wide">Get to know me</span>
          </div>
          <h1 class="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-highlight bg-clip-text text-transparent">
            About Me
          </h1>
          <p class="text-xl lg:text-2xl text-text-secondary leading-relaxed">
            I'm a Creative Technologist who bridges the gap between design, development, 
            and operations. With a unique blend of technical expertise and creative problem-solving, 
            I help businesses transform their digital presence and operational efficiency.
          </p>
        </section>

        {/* Bio */}
        <section class="mb-16 scroll-reveal">
          <div class="rounded-3xl glass p-8 lg:p-12">
              <h2 class="text-3xl lg:text-4xl font-bold mb-6 text-text-primary flex items-center gap-3">
              <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </span>
              Background
            </h2>
            <div class="space-y-6 text-lg text-text-primary leading-relaxed">
              <p>
                Throughout my career, I've worn many hats: designer, developer, process innovator, 
                and technical leader. This diverse experience has given me a holistic understanding 
                of how digital products come to life and thrive.
              </p>
              <p>
                My approach combines design thinking with technical implementation, ensuring that 
                solutions are not only beautiful and functional, but also scalable and maintainable.
              </p>
              <p>
                I'm passionate about continuous learning, staying current with emerging technologies, 
                and finding innovative ways to solve complex business challenges.
              </p>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section class="mb-16 scroll-reveal">
          <h2 class="text-3xl lg:text-4xl font-bold mb-8 text-text-primary text-center">Skills & Expertise</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="group rounded-2xl glass p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-primary">Design & UX</h3>
              </div>
              <ul class="space-y-3 text-text-primary">
                <li class="flex items-center gap-2">
                  <span class="text-primary">✓</span> UI/UX Design
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-primary">✓</span> Brand Identity
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-primary">✓</span> Design Systems
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-primary">✓</span> User Research
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-primary">✓</span> Prototyping
                </li>
              </ul>
            </div>
            
            <div class="group rounded-2xl glass p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-12 h-12 bg-gradient-to-br from-secondary to-secondary/60 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-secondary">Development</h3>
              </div>
              <ul class="space-y-3 text-text-primary">
                <li class="flex items-center gap-2">
                  <span class="text-secondary">✓</span> React & TypeScript
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-secondary">✓</span> Modern JavaScript
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-secondary">✓</span> Responsive Design
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-secondary">✓</span> API Integration
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-secondary">✓</span> Performance Optimization
                </li>
              </ul>
            </div>
            
            <div class="group rounded-2xl glass p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-12 h-12 bg-gradient-to-br from-highlight to-highlight/60 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-highlight">Operations</h3>
              </div>
              <ul class="space-y-3 text-text-primary">
                <li class="flex items-center gap-2">
                  <span class="text-highlight">✓</span> Process Design
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-highlight">✓</span> Workflow Automation
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-highlight">✓</span> Team Leadership
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-highlight">✓</span> Project Management
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-highlight">✓</span> Quality Assurance
                </li>
              </ul>
            </div>
            
            <div class="group rounded-2xl glass p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-12 h-12 bg-gradient-to-br from-charcoal to-charcoal/60 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-charcoal">Tools & Platforms</h3>
              </div>
              <ul class="space-y-3 text-text-primary">
                <li class="flex items-center gap-2">
                  <span class="text-charcoal">✓</span> Figma & Adobe Suite
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-charcoal">✓</span> VS Code & Git
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-charcoal">✓</span> Cloudflare Hosting
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-charcoal">✓</span> Analytics & SEO
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-charcoal">✓</span> CI/CD & DevOps
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Experience Timeline */}
        <section class="mb-16 scroll-reveal">
          <h2 class="text-3xl lg:text-4xl font-bold mb-12 text-text-primary text-center">Experience</h2>
          
          <div class="relative space-y-8">
            {/* Vertical Line */}
            <div class="absolute left-4 lg:left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-highlight" />
            
            <div class="relative pl-12 lg:pl-20 group">
              <div class="absolute left-0 lg:left-4 top-0 flex h-8 w-8 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg group-hover:scale-110 transition-transform">
                <svg class="w-4 h-4 lg:w-6 lg:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div class="glass rounded-2xl p-6 lg:p-8 hover:shadow-xl transition-all duration-300">
                <div class="text-sm font-semibold text-primary/80 mb-2 uppercase tracking-wide">2020 - Present</div>
                <h3 class="text-xl lg:text-2xl font-bold mb-3 text-text-primary">Creative Technologist</h3>
                <p class="text-text-primary leading-relaxed">
                  Leading digital transformation initiatives, designing and building custom solutions, 
                  and optimizing operational workflows for improved efficiency.
                </p>
              </div>
            </div>
            
            <div class="relative pl-12 lg:pl-20 group">
              <div class="absolute left-0 lg:left-4 top-0 flex h-8 w-8 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-highlight shadow-lg group-hover:scale-110 transition-transform">
                <svg class="w-4 h-4 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div class="glass rounded-2xl p-6 lg:p-8 hover:shadow-xl transition-all duration-300">
                <div class="text-sm font-semibold text-secondary/80 mb-2 uppercase tracking-wide">2018 - 2020</div>
                <h3 class="text-xl lg:text-2xl font-bold mb-3 text-text-primary">Designer & Developer</h3>
                <p class="text-text-primary leading-relaxed">
                  Created user-centered digital experiences, developed responsive web applications, 
                  and collaborated with cross-functional teams.
                </p>
              </div>
            </div>
            
            <div class="relative pl-12 lg:pl-20 group">
              <div class="absolute left-0 lg:left-4 top-0 flex h-8 w-8 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-gradient-to-br from-highlight to-amber-600 shadow-lg group-hover:scale-110 transition-transform">
                <svg class="w-4 h-4 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div class="glass rounded-2xl p-6 lg:p-8 hover:shadow-xl transition-all duration-300">
                <div class="text-sm font-semibold text-highlight/80 mb-2 uppercase tracking-wide">2015 - 2018</div>
                <h3 class="text-xl lg:text-2xl font-bold mb-3 text-text-primary">Operations & Process Designer</h3>
                <p class="text-text-primary leading-relaxed">
                  Streamlined business processes, implemented new systems, and trained teams 
                  on best practices for operational excellence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section class="relative overflow-hidden rounded-3xl p-12 text-center scroll-reveal">
          <div class="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-highlight" />
          <div class="absolute inset-0 opacity-10">
            <div class="absolute inset-0" style="background-image: radial-gradient(circle, #FFFFFF 1px, transparent 1px); background-size: 32px 32px;" />
          </div>
          
          <div class="relative z-10">
            <h2 class="text-3xl lg:text-4xl font-bold mb-4 text-white">Want to work together?</h2>
            <p class="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              I'm always open to discussing new projects and opportunities.
            </p>
            <Link 
              href="/contact" 
              class="inline-flex items-center gap-3 px-8 py-4 bg-white text-text-primary rounded-xl hover:shadow-2xl transition-all duration-300 text-lg font-semibold transform hover:scale-105"
            >
              Get In Touch
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'About - John P. Stas',
  meta: [
    {
      name: 'description',
      content: 'Learn more about John P. Stas - background, skills, experience, and approach to design, development, and process innovation.',
    },
  ],
};

