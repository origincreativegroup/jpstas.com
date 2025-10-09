import { component$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <div class="py-16 bg-gray-50">
      <div class="max-w-4xl mx-auto px-6">
        {/* Header with Download */}
        <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-4xl font-bold mb-2">John P. Stas</h1>
              <p class="text-xl text-gray-600">
                Creative Technologist, Designer & Process Innovator
              </p>
            </div>
            <a
              href="/js_resume_25.2.pdf"
              download
              class="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-glow transition-all duration-300 font-semibold flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </a>
          </div>
          <div class="mt-6 flex flex-wrap gap-4 text-text-primary">
            <span class="flex items-center gap-2">
              <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              john@jpstas.com
            </span>
            <span class="flex items-center gap-2">
              <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              linkedin.com/in/johnpstas
            </span>
            <span class="flex items-center gap-2">
              <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              github.com/johnpstas
            </span>
          </div>
        </div>

        {/* Summary */}
        <section class="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 class="text-2xl font-bold mb-4">Professional Summary</h2>
          <p class="text-gray-700 leading-relaxed">
            Creative Technologist with expertise in design, development, and operational excellence. 
            Proven track record of transforming business challenges into elegant solutions through 
            design thinking, technical implementation, and process innovation. Passionate about 
            creating user-centered experiences that drive measurable business results.
          </p>
        </section>

        {/* Skills */}
        <section class="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 class="text-2xl font-bold mb-6">Core Competencies</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold mb-3 text-blue-600">Design & UX</h3>
              <ul class="text-gray-700 space-y-1">
                <li>• UI/UX Design & Prototyping</li>
                <li>• Brand Identity & Design Systems</li>
                <li>• User Research & Testing</li>
                <li>• Responsive Web Design</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold mb-3 text-blue-600">Development</h3>
              <ul class="text-gray-700 space-y-1">
                <li>• React, TypeScript & Modern JavaScript</li>
                <li>• HTML5, CSS3 & Tailwind CSS</li>
                <li>• API Integration & Development</li>
                <li>• Performance Optimization</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold mb-3 text-blue-600">Operations & Process</h3>
              <ul class="text-gray-700 space-y-1">
                <li>• Process Design & Optimization</li>
                <li>• Workflow Automation</li>
                <li>• Team Leadership & Training</li>
                <li>• Project Management</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold mb-3 text-blue-600">Tools & Platforms</h3>
              <ul class="text-gray-700 space-y-1">
                <li>• Figma & Adobe Creative Suite</li>
                <li>• Git, VS Code & Modern DevTools</li>
                <li>• Cloudflare, Vercel & Netlify</li>
                <li>• WordPress & Headless CMS</li>
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

