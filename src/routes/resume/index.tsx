import { component$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <div class="min-h-screen bg-white py-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <section class="mb-16">
          <div class="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full">
            <span class="text-sm font-semibold text-primary uppercase tracking-wide">Professional Resume</span>
          </div>
          <h1 class="text-5xl lg:text-6xl font-bold mb-6 text-primary">
            John P. Stas
          </h1>
          <p class="text-xl lg:text-2xl text-text-secondary mb-8">
            Creative Technologist, Designer & Process Innovator
          </p>

          {/* Download Button */}
          <a
            href="/js_resume_25.2.pdf"
            download
            class="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary-hover transition-all duration-300 text-lg font-semibold"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </a>

          {/* Contact Info */}
          <div class="mt-8 flex flex-wrap gap-6 text-text-primary">
            <span class="flex items-center gap-2">
              <div class="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span class="text-text-secondary font-medium">john@jpstas.com</span>
            </span>
            <span class="flex items-center gap-2">
              <div class="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <span class="text-text-secondary font-medium">linkedin.com/in/johnpstas</span>
            </span>
            <span class="flex items-center gap-2">
              <div class="w-8 h-8 bg-highlight/10 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-highlight" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <span class="text-text-secondary font-medium">github.com/johnpstas</span>
            </span>
          </div>
        </section>

        {/* Summary */}
        <section class="rounded-3xl glass p-8 lg:p-10 mb-8">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 class="text-2xl lg:text-3xl font-bold text-text-primary">Professional Summary</h2>
          </div>
          <p class="text-text-secondary leading-relaxed text-lg">
            Creative Technologist with expertise in design, development, and operational excellence.
            Proven track record of transforming business challenges into elegant solutions through
            design thinking, technical implementation, and process innovation. Passionate about
            creating user-centered experiences that drive measurable business results.
          </p>
        </section>

        {/* Skills */}
        <section class="rounded-3xl glass p-8 lg:p-10 mb-8">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-10 h-10 bg-gradient-to-br from-highlight to-highlight-hover rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 class="text-2xl lg:text-3xl font-bold text-text-primary">Core Competencies</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="rounded-2xl bg-white/50 p-6 border border-primary/10">
              <h3 class="font-bold mb-4 text-primary text-lg flex items-center gap-2">
                <span class="w-2 h-8 bg-primary rounded-full"></span>
                Design & UX
              </h3>
              <ul class="text-text-secondary space-y-2 text-sm">
                <li class="flex items-start gap-2"><span class="text-primary mt-1">•</span> UI/UX Design & Prototyping</li>
                <li class="flex items-start gap-2"><span class="text-primary mt-1">•</span> Brand Identity & Design Systems</li>
                <li class="flex items-start gap-2"><span class="text-primary mt-1">•</span> User Research & Testing</li>
                <li class="flex items-start gap-2"><span class="text-primary mt-1">•</span> Responsive Web Design</li>
              </ul>
            </div>
            <div class="rounded-2xl bg-white/50 p-6 border border-secondary/10">
              <h3 class="font-bold mb-4 text-secondary text-lg flex items-center gap-2">
                <span class="w-2 h-8 bg-secondary rounded-full"></span>
                Development
              </h3>
              <ul class="text-text-secondary space-y-2 text-sm">
                <li class="flex items-start gap-2"><span class="text-secondary mt-1">•</span> React, TypeScript & Modern JavaScript</li>
                <li class="flex items-start gap-2"><span class="text-secondary mt-1">•</span> HTML5, CSS3 & Tailwind CSS</li>
                <li class="flex items-start gap-2"><span class="text-secondary mt-1">•</span> API Integration & Development</li>
                <li class="flex items-start gap-2"><span class="text-secondary mt-1">•</span> Performance Optimization</li>
              </ul>
            </div>
            <div class="rounded-2xl bg-white/50 p-6 border border-highlight/10">
              <h3 class="font-bold mb-4 text-highlight text-lg flex items-center gap-2">
                <span class="w-2 h-8 bg-highlight rounded-full"></span>
                Operations & Process
              </h3>
              <ul class="text-text-secondary space-y-2 text-sm">
                <li class="flex items-start gap-2"><span class="text-highlight mt-1">•</span> Process Design & Optimization</li>
                <li class="flex items-start gap-2"><span class="text-highlight mt-1">•</span> Workflow Automation</li>
                <li class="flex items-start gap-2"><span class="text-highlight mt-1">•</span> Team Leadership & Training</li>
                <li class="flex items-start gap-2"><span class="text-highlight mt-1">•</span> Project Management</li>
              </ul>
            </div>
            <div class="rounded-2xl bg-white/50 p-6 border border-primary/10">
              <h3 class="font-bold mb-4 text-primary text-lg flex items-center gap-2">
                <span class="w-2 h-8 bg-primary rounded-full"></span>
                Tools & Platforms
              </h3>
              <ul class="text-text-secondary space-y-2 text-sm">
                <li class="flex items-start gap-2"><span class="text-primary mt-1">•</span> Figma & Adobe Creative Suite</li>
                <li class="flex items-start gap-2"><span class="text-primary mt-1">•</span> Git, VS Code & Modern DevTools</li>
                <li class="flex items-start gap-2"><span class="text-primary mt-1">•</span> Cloudflare, Vercel & Netlify</li>
                <li class="flex items-start gap-2"><span class="text-primary mt-1">•</span> WordPress & Headless CMS</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section class="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 class="text-2xl font-bold mb-6">Professional Experience</h2>
          <div class="space-y-8">
            <div>
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h3 class="text-xl font-bold">Creative Technologist</h3>
                  <p class="text-gray-600">Freelance / Contract</p>
                </div>
                <span class="text-gray-500">2020 - Present</span>
              </div>
              <ul class="text-gray-700 space-y-2 mt-4">
                <li>• Led digital transformation initiatives for e-commerce and service businesses</li>
                <li>• Designed and developed custom web applications using modern frameworks</li>
                <li>• Optimized operational workflows, reducing processing time by 40%</li>
                <li>• Created comprehensive design systems and brand guidelines</li>
                <li>• Managed cross-functional teams and client relationships</li>
              </ul>
            </div>

            <div>
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h3 class="text-xl font-bold">Designer & Developer</h3>
                  <p class="text-gray-600">Previous Role</p>
                </div>
                <span class="text-gray-500">2018 - 2020</span>
              </div>
              <ul class="text-gray-700 space-y-2 mt-4">
                <li>• Designed and built responsive websites and web applications</li>
                <li>• Conducted user research and usability testing</li>
                <li>• Collaborated with stakeholders to define project requirements</li>
                <li>• Implemented SEO best practices and analytics tracking</li>
              </ul>
            </div>

            <div>
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h3 class="text-xl font-bold">Operations & Process Designer</h3>
                  <p class="text-gray-600">Previous Role</p>
                </div>
                <span class="text-gray-500">2015 - 2018</span>
              </div>
              <ul class="text-gray-700 space-y-2 mt-4">
                <li>• Designed and implemented operational workflows and procedures</li>
                <li>• Trained staff on new systems and best practices</li>
                <li>• Analyzed business processes and identified improvement opportunities</li>
                <li>• Developed documentation and training materials</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Education */}
        <section class="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 class="text-2xl font-bold mb-6">Education & Certifications</h2>
          <div class="space-y-4">
            <div>
              <h3 class="font-bold">Continuous Learning</h3>
              <p class="text-gray-700">
                Ongoing education through online courses, workshops, and industry conferences. 
                Focus on emerging technologies, design trends, and operational excellence.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div class="text-center py-8">
          <p class="text-gray-600 mb-4">
            Interested in working together?
          </p>
          <a
            href="/contact"
            class="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
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

