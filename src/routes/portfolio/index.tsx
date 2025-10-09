import { component$, useSignal } from '@builder.io/qwik';
import { type DocumentHead, Link } from '@builder.io/qwik-city';

export default component$(() => {
  const selectedFilter = useSignal('all');
  
  const projects = [
    {
      id: 'formstack-integration',
      title: 'Formstack Digital Transformation',
      category: 'process',
      tags: ['Process Automation', 'Form UX', 'CRM'],
      description: 'Turned paper chaos into a digital command center. 80% paper reduction, 1,000+ submissions per season.',
      image: 'https://fa917615d33ac203929027798644acef.r2.cloudflarestorage.com/jpstas-media/formstack-hero.jpg',
      slug: 'formstack-integration',
    },
    {
      id: 'caribbeanpools-redesign',
      title: 'Caribbean Pools E-Commerce',
      category: 'design',
      tags: ['E-Commerce', 'UI/UX', 'WordPress'],
      description: 'Complete website redesign and e-commerce platform generating $100k+ in first year.',
      image: 'https://fa917615d33ac203929027798644acef.r2.cloudflarestorage.com/jpstas-media/caribbean-hero.jpg',
      slug: 'caribbeanpools-redesign',
    },
    {
      id: 'deckhand-prototype',
      title: 'DeckHand Field Service App',
      category: 'development',
      tags: ['Mobile App', 'React Native', 'UX'],
      description: 'Field service app prototype reducing report time by 70% with offline-first architecture.',
      image: 'https://fa917615d33ac203929027798644acef.r2.cloudflarestorage.com/jpstas-media/deckhand-hero.jpg',
      slug: 'deckhand-prototype',
    },
  ];
  
  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'design', label: 'Design' },
    { id: 'development', label: 'Development' },
    { id: 'process', label: 'Process & Operations' },
  ];
  
  const filteredProjects = selectedFilter.value === 'all' 
    ? projects 
    : projects.filter(p => p.category === selectedFilter.value);
  
  return (
    <div class="py-16">
      <div class="max-w-6xl mx-auto px-6">
        {/* Header */}
        <section class="text-center mb-16">
          <h1 class="text-5xl font-bold mb-6">Portfolio</h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            A showcase of projects spanning design, development, and operational excellence
          </p>
        </section>

        {/* Filter */}
        <div class="flex justify-center gap-4 mb-12 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick$={() => {
                selectedFilter.value = cat.id;
              }}
              class={`px-6 py-2 rounded-lg font-medium transition-all ${
                selectedFilter.value === cat.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              href={`/portfolio/${project.slug}`}
              class="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 block"
            >
              <div class="aspect-video bg-gradient-to-br from-blue-400 to-indigo-600 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div class="p-6">
                <h3 class="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>
                <p class="text-gray-600 mb-4">{project.description}</p>
                <div class="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div class="text-blue-600 font-medium flex items-center gap-2">
                  View Case Study
                  <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <section class="text-center mt-20 py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl">
          <h2 class="text-3xl font-bold mb-4">Interested in working together?</h2>
          <p class="text-xl text-gray-600 mb-8">
            Let's discuss how I can help bring your project to life
          </p>
          <a
            href="/contact"
            class="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold shadow-lg"
          >
            Start a Project
          </a>
        </section>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Portfolio - John P. Stas',
  meta: [
    {
      name: 'description',
      content: 'View the portfolio of John P. Stas showcasing design, development, and operational projects.',
    },
  ],
};

