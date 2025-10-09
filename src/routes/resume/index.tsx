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
              class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
            >
              <span>📥</span>
              Download PDF
            </a>
          </div>
          <div class="mt-6 flex flex-wrap gap-4 text-gray-600">
            <span>📧 john@jpstas.com</span>
            <span>💼 linkedin.com/in/johnpstas</span>
            <span>💻 github.com/johnpstas</span>
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

