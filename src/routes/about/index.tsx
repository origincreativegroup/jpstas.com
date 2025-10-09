import { component$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <div class="py-16">
      <div class="max-w-4xl mx-auto px-6">
        {/* Header */}
        <section class="mb-16">
          <h1 class="text-5xl font-bold mb-6">About Me</h1>
          <p class="text-xl text-gray-700 leading-relaxed">
            I'm a Creative Technologist who bridges the gap between design, development, 
            and operations. With a unique blend of technical expertise and creative problem-solving, 
            I help businesses transform their digital presence and operational efficiency.
          </p>
        </section>

        {/* Bio */}
        <section class="mb-16">
          <h2 class="text-3xl font-bold mb-6">Background</h2>
          <div class="prose prose-lg max-w-none text-gray-700 space-y-4">
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
        </section>

        {/* Skills */}
        <section class="mb-16">
          <h2 class="text-3xl font-bold mb-8">Skills & Expertise</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 class="text-xl font-semibold mb-4 text-blue-600">Design & UX</h3>
              <ul class="space-y-2 text-gray-700">
                <li>• UI/UX Design</li>
                <li>• Brand Identity</li>
                <li>• Design Systems</li>
                <li>• User Research</li>
                <li>• Prototyping</li>
              </ul>
            </div>
            
            <div>
              <h3 class="text-xl font-semibold mb-4 text-blue-600">Development</h3>
              <ul class="space-y-2 text-gray-700">
                <li>• React & TypeScript</li>
                <li>• Modern JavaScript</li>
                <li>• Responsive Design</li>
                <li>• API Integration</li>
                <li>• Performance Optimization</li>
              </ul>
            </div>
            
            <div>
              <h3 class="text-xl font-semibold mb-4 text-blue-600">Operations</h3>
              <ul class="space-y-2 text-gray-700">
                <li>• Process Design</li>
                <li>• Workflow Automation</li>
                <li>• Team Leadership</li>
                <li>• Project Management</li>
                <li>• Quality Assurance</li>
              </ul>
            </div>
            
            <div>
              <h3 class="text-xl font-semibold mb-4 text-blue-600">Tools & Platforms</h3>
              <ul class="space-y-2 text-gray-700">
                <li>• Figma & Adobe Creative Suite</li>
                <li>• VS Code & Git</li>
                <li>• Cloudflare & Modern Hosting</li>
                <li>• Analytics & SEO</li>
                <li>• CI/CD & DevOps</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Experience Timeline */}
        <section class="mb-16">
          <h2 class="text-3xl font-bold mb-8">Experience</h2>
          
          <div class="space-y-8">
            <div class="border-l-4 border-blue-600 pl-6">
              <div class="text-sm text-gray-500 mb-1">2020 - Present</div>
              <h3 class="text-xl font-bold mb-2">Creative Technologist</h3>
              <p class="text-gray-700">
                Leading digital transformation initiatives, designing and building custom solutions, 
                and optimizing operational workflows for improved efficiency.
              </p>
            </div>
            
            <div class="border-l-4 border-gray-300 pl-6">
              <div class="text-sm text-gray-500 mb-1">2018 - 2020</div>
              <h3 class="text-xl font-bold mb-2">Designer & Developer</h3>
              <p class="text-gray-700">
                Created user-centered digital experiences, developed responsive web applications, 
                and collaborated with cross-functional teams.
              </p>
            </div>
            
            <div class="border-l-4 border-gray-300 pl-6">
              <div class="text-sm text-gray-500 mb-1">2015 - 2018</div>
              <h3 class="text-xl font-bold mb-2">Operations & Process Designer</h3>
              <p class="text-gray-700">
                Streamlined business processes, implemented new systems, and trained teams 
                on best practices for operational excellence.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section class="text-center py-12 bg-gray-50 rounded-xl">
          <h2 class="text-2xl font-bold mb-4">Want to work together?</h2>
          <p class="text-gray-600 mb-6">
            I'm always open to discussing new projects and opportunities.
          </p>
          <a 
            href="/contact" 
            class="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Get In Touch
          </a>
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

