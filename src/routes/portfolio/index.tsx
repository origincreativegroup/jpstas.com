import { component$, useSignal } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  const selectedFilter = useSignal('all');
  
  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform Redesign',
      category: 'design',
      tags: ['UI/UX', 'E-Commerce', 'WordPress'],
      description: 'Complete redesign and development of a high-volume e-commerce platform.',
      image: '/images/placeholder.svg',
    },
    {
      id: 2,
      title: 'Print Studio Workflow',
      category: 'operations',
      tags: ['Process Design', 'Operations', 'Training'],
      description: 'Built in-house print studio with optimized workflows and team training.',
      image: '/images/placeholder.svg',
    },
    {
      id: 3,
      title: 'Custom CMS Development',
      category: 'development',
      tags: ['React', 'TypeScript', 'API'],
      description: 'Developed custom content management system with real-time collaboration.',
      image: '/images/placeholder.svg',
    },
  ];
  
  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'design', label: 'Design' },
    { id: 'development', label: 'Development' },
    { id: 'operations', label: 'Operations' },
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
            <div
              key={project.id}
              class="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2"
            >
              <div class="aspect-video bg-gradient-to-br from-blue-400 to-indigo-600 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div class="p-6">
                <h3 class="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>
                <p class="text-gray-600 mb-4">{project.description}</p>
                <div class="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
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

