import { component$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import { Link } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <div class="min-h-screen">
      {/* Hero Section */}
      <section class="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-32">
        <div class="max-w-6xl mx-auto px-6">
          <div class="text-center">
            <h1 class="text-6xl md:text-7xl font-bold text-gray-900 mb-6">
              John P. Stas
            </h1>
            <p class="text-2xl md:text-3xl text-gray-700 mb-4">
              Creative Technologist, Designer & Process Innovator
            </p>
            <p class="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              Transforming business challenges into elegant solutions through design thinking, 
              technical expertise, and operational excellence.
            </p>
            <div class="flex gap-4 justify-center">
              <Link 
                href="/portfolio" 
                class="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                View My Work
              </Link>
              <Link 
                href="/contact" 
                class="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-all text-lg font-semibold shadow-lg border-2 border-blue-600"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work Preview */}
      <section class="py-20 bg-white">
        <div class="max-w-6xl mx-auto px-6">
          <h2 class="text-4xl font-bold text-center mb-4">Featured Projects</h2>
          <p class="text-xl text-gray-600 text-center mb-12">
            A selection of recent work showcasing design, development, and operational excellence
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div 
                key={item} 
                class="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
              >
                <div class="aspect-video bg-gradient-to-br from-blue-400 to-indigo-600"></div>
                <div class="p-6 bg-white">
                  <h3 class="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                    Project Title {item}
                  </h3>
                  <p class="text-gray-600 mb-4">
                    Brief description of the project and its impact.
                  </p>
                  <div class="flex gap-2">
                    <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      Design
                    </span>
                    <span class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                      Development
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div class="text-center mt-12">
            <Link 
              href="/portfolio" 
              class="inline-block px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
            >
              View All Projects →
            </Link>
          </div>
        </div>
      </section>

      {/* Skills Overview */}
      <section class="py-20 bg-gray-50">
        <div class="max-w-6xl mx-auto px-6">
          <h2 class="text-4xl font-bold text-center mb-12">Core Expertise</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center p-8 bg-white rounded-xl shadow-md">
              <div class="text-5xl mb-4">🎨</div>
              <h3 class="text-2xl font-bold mb-3">Design & UX</h3>
              <p class="text-gray-600">
                Creating intuitive, beautiful interfaces that solve real business problems
              </p>
            </div>
            
            <div class="text-center p-8 bg-white rounded-xl shadow-md">
              <div class="text-5xl mb-4">💻</div>
              <h3 class="text-2xl font-bold mb-3">Development</h3>
              <p class="text-gray-600">
                Building scalable, performant web applications with modern technologies
              </p>
            </div>
            
            <div class="text-center p-8 bg-white rounded-xl shadow-md">
              <div class="text-5xl mb-4">⚡</div>
              <h3 class="text-2xl font-bold mb-3">Process Innovation</h3>
              <p class="text-gray-600">
                Optimizing workflows and operations for maximum efficiency
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section class="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div class="max-w-4xl mx-auto px-6 text-center">
          <h2 class="text-4xl font-bold mb-6">Let's Build Something Great</h2>
          <p class="text-xl mb-8 text-blue-100">
            I'm always interested in hearing about new projects and opportunities.
          </p>
          <Link 
            href="/contact" 
            class="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold shadow-lg"
          >
            Start a Conversation
          </Link>
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

