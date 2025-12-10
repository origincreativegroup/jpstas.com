import { component$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <div class="min-h-screen bg-surface-deep text-cream py-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Section */}
        <section>
          <div class="inline-block mb-4 px-4 py-2 rounded-full bg-gold/15">
            <span class="text-sm font-semibold text-gold uppercase tracking-[0.3em]">Professional Resume</span>
          </div>
          <h1 class="text-5xl lg:text-6xl font-bold mb-6 text-cream">
            John P. Stas
          </h1>
          <p class="text-xl lg:text-2xl text-cream/75 mb-8">
            Creative Technologist, Designer & Process Innovator
          </p>

          {/* Download Button */}
          <a
            href="https://media.jpstas.com/about/resume%20.26.pdf"
            download
            class="inline-flex items-center gap-3 px-8 py-4 bg-gold text-surface-deep rounded-2xl hover:bg-gold/90 transition-all duration-300 text-lg font-semibold"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </a>

          {/* Contact Info */}
          <div class="mt-8 flex flex-wrap gap-6 text-cream">
            <span class="flex items-center gap-2">
              <div class="w-8 h-8 bg-gold/15 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span class="text-cream/70 font-medium">johnpstas@gmail.com</span>
            </span>
            <span class="flex items-center gap-2">
              <div class="w-8 h-8 bg-surface-olive/20 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-surface-olive" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <span class="text-cream/70 font-medium">linkedin.com/in/john-stas-22b01054</span>
            </span>
            <span class="flex items-center gap-2">
              <div class="w-8 h-8 bg-rust/20 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-rust" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <span class="text-cream/70 font-medium">github.com/origincreativegroup</span>
            </span>
          </div>
        </section>

        {/* Summary */}
        <section class="rounded-3xl border border-cream/10 bg-surface-mid/70 p-8 lg:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.45)]">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-gold rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-surface-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 class="text-2xl lg:text-3xl font-bold text-cream">Professional Summary</h2>
          </div>
          <p class="text-cream/75 leading-relaxed text-lg">
            Creative Technologist, Designer & Process Innovator with expertise in design, development, and operational excellence.
            Proven track record of transforming business challenges into elegant solutions through
            design thinking, technical implementation, and process innovation. Passionate about
            creating user-centered experiences that drive measurable business results.
          </p>
        </section>

        {/* Skills */}
        <section class="rounded-3xl border border-cream/10 bg-surface-mid/70 p-8 lg:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.45)]">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-10 h-10 bg-rust rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 class="text-2xl lg:text-3xl font-bold text-cream">Core Competencies</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="rounded-2xl bg-surface-deep/60 p-6 border border-gold/20">
              <h3 class="font-bold mb-4 text-gold text-lg flex items-center gap-2">
                <span class="w-2 h-8 bg-gold rounded-full"></span>
                Brand Systems & Identity
              </h3>
              <ul class="text-cream/75 space-y-2 text-sm">
                <li class="flex items-start gap-2"><span class="text-gold mt-1">•</span> Brand Identity & Design Systems</li>
                <li class="flex items-start gap-2"><span class="text-gold mt-1">•</span> Visual/Brand Storytelling</li>
                <li class="flex items-start gap-2"><span class="text-gold mt-1">•</span> Creative Direction</li>
                <li class="flex items-start gap-2"><span class="text-gold mt-1">•</span> Process Visualization</li>
              </ul>
            </div>
            <div class="rounded-2xl bg-surface-deep/60 p-6 border border-surface-olive/20">
              <h3 class="font-bold mb-4 text-surface-olive text-lg flex items-center gap-2">
                <span class="w-2 h-8 bg-surface-olive rounded-full"></span>
                Web & Digital Platforms
              </h3>
              <ul class="text-cream/75 space-y-2 text-sm">
                <li class="flex items-start gap-2"><span class="text-surface-olive mt-1">•</span> UI/UX Design & Prototyping</li>
                <li class="flex items-start gap-2"><span class="text-surface-olive mt-1">•</span> React, TypeScript & Modern JavaScript</li>
                <li class="flex items-start gap-2"><span class="text-surface-olive mt-1">•</span> E-Commerce & Digital Strategy</li>
                <li class="flex items-start gap-2"><span class="text-surface-olive mt-1">•</span> WordPress, CMS & Analytics</li>
              </ul>
            </div>
            <div class="rounded-2xl bg-surface-deep/60 p-6 border border-rust/20">
              <h3 class="font-bold mb-4 text-rust text-lg flex items-center gap-2">
                <span class="w-2 h-8 bg-rust rounded-full"></span>
                Motion & Content
              </h3>
              <ul class="text-cream/75 space-y-2 text-sm">
                <li class="flex items-start gap-2"><span class="text-rust mt-1">•</span> Motion Design & Animation</li>
                <li class="flex items-start gap-2"><span class="text-rust mt-1">•</span> Video Editing & FPV/Drone Cinematics</li>
                <li class="flex items-start gap-2"><span class="text-rust mt-1">•</span> Product Explainers & Brand Storytelling</li>
                <li class="flex items-start gap-2"><span class="text-rust mt-1">•</span> AI-Assisted Motion</li>
              </ul>
            </div>
            <div class="rounded-2xl bg-surface-deep/60 p-6 border border-gold/20">
              <h3 class="font-bold mb-4 text-gold text-lg flex items-center gap-2">
                <span class="w-2 h-8 bg-gold rounded-full"></span>
                Operations & Process Innovation
              </h3>
              <ul class="text-cream/75 space-y-2 text-sm">
                <li class="flex items-start gap-2"><span class="text-gold mt-1">•</span> Workflow Automation & Process Design</li>
                <li class="flex items-start gap-2"><span class="text-gold mt-1">•</span> Print Production & Fabrication</li>
                <li class="flex items-start gap-2"><span class="text-gold mt-1">•</span> Generative AI & Automation</li>
                <li class="flex items-start gap-2"><span class="text-gold mt-1">•</span> Team Training & Systems Integration</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section class="rounded-3xl border border-cream/10 bg-surface-mid/70 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
          <h2 class="text-2xl font-bold mb-6 text-cream">Professional Experience</h2>
          <div class="space-y-8">
            {[
              {
                role: 'Creative Technologist, Designer & Process Innovator',
                org: 'Caribbean Pools & Spas / Freelance',
                period: '2014 - 2025',
                bullets: [
                  'Led 12-year brand transformation, scaling company from $7M to $17M in annual revenue',
                  'Designed and built unified brand systems across print, digital, fleet, and apparel',
                  'Engineered in-house print studio, saving $250K+ annually in outsourcing costs',
                  'Created comprehensive design systems and digital platforms, increasing online sales 35% YoY',
                  'Developed motion and media programs, driving 400% growth in social engagement',
                  'Optimized operational workflows and implemented automation systems across departments',
                ],
              },
              {
                role: 'Designer & Developer',
                org: 'Freelance / Contract',
                period: '2012 - 2014',
                bullets: [
                  'Designed and built responsive websites and web applications',
                  'Conducted user research and usability testing',
                  'Collaborated with stakeholders to define project requirements',
                  'Implemented SEO best practices and analytics tracking',
                ],
              },
            ].map((job) => (
              <div key={job.role}>
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h3 class="text-xl font-bold text-cream">{job.role}</h3>
                    <p class="text-cream/70">{job.org}</p>
                  </div>
                  <span class="text-cream/60">{job.period}</span>
                </div>
                <ul class="text-cream/75 space-y-2 mt-4">
                  {job.bullets.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section class="rounded-3xl border border-cream/10 bg-surface-mid/70 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
          <h2 class="text-2xl font-bold mb-6 text-cream">Education & Certifications</h2>
          <div class="space-y-4 text-cream/80">
            <div>
              <h3 class="font-bold text-cream">Continuous Learning</h3>
              <p>
                Ongoing education through online courses, workshops, and industry conferences focused on emerging technologies,
                design trends, and operational excellence.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div class="text-center py-8 rounded-3xl border border-cream/10 bg-surface-mid/60 shadow-[0_15px_40px_rgba(0,0,0,0.35)]">
          <p class="text-cream/75 mb-4">
            Interested in working together?
          </p>
          <a
            href="/contact"
            class="inline-block px-8 py-3 bg-gold text-surface-deep rounded-lg hover:bg-gold/90 transition-colors font-semibold"
          >
            Get In Touch
          </a>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Resume - John P. Stas',
  meta: [
    {
      name: 'description',
      content: 'Professional resume of John P. Stas - Creative Technologist, Designer, and Process Innovator.',
    },
  ],
};

