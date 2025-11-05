/**
 * Example page demonstrating Builder.io CMS integration
 *
 * This page shows how to:
 * 1. Fetch content from Builder.io
 * 2. Use fallback data when Builder.io is unavailable
 * 3. Display structured content
 * 4. Handle loading and error states
 */

import { component$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import { createBuilderLoader } from '~/lib/use-builder-content';
import type { HomepageContent } from '~/types/builder';

// Import fallback data
import homepageData from '~/data/site/homepage.json';

// Create a loader for Builder.io content
export const useHomepageBuilder = createBuilderLoader<HomepageContent>('homepage');

export default component$(() => {
  // Fetch content from Builder.io
  const builderContent = useHomepageBuilder();

  // Use Builder.io content if available, fallback to JSON
  const content = builderContent.value?.data || homepageData;

  // Determine if we're using Builder.io or fallback
  const isBuilderContent = !!builderContent.value;

  return (
    <div class="min-h-screen bg-white">
      {/* Status Banner */}
      <div class={`px-4 py-2 text-sm text-center ${isBuilderContent ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
        {isBuilderContent ? (
          <>
            ✅ Content loaded from <strong>Builder.io CMS</strong> -
            <a href="https://builder.io/content" target="_blank" class="underline ml-1">
              Edit in Builder.io
            </a>
          </>
        ) : (
          '⚠️ Using fallback data (JSON file) - Builder.io content not available'
        )}
      </div>

      {/* Hero Section */}
      <section class="py-20 px-4">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-12">
            <h1 class="text-5xl font-bold text-gray-900 mb-4">
              {content.title}
            </h1>
            <p class="text-2xl text-gray-600 mb-6">
              {content.subtitle}
            </p>
            <p class="text-lg text-gray-700 max-w-3xl mx-auto">
              {content.description}
            </p>
          </div>

          {/* Hero Image */}
          {content.heroImage && (
            <div class="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={content.heroImage}
                alt={content.heroImageAlt}
                class="w-full h-auto"
              />
            </div>
          )}
        </div>
      </section>

      {/* Metrics Section */}
      {content.metrics && content.metrics.length > 0 && (
        <section class="py-16 bg-gray-50">
          <div class="max-w-7xl mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {content.metrics.map((metric, index) => (
                <div key={index} class="text-center">
                  <div class="text-4xl font-bold text-primary mb-2">
                    {metric.value}
                  </div>
                  <div class="text-gray-600 font-medium">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Projects Section */}
      {content.featuredProjects && content.featuredProjects.length > 0 && (
        <section class="py-20 px-4">
          <div class="max-w-7xl mx-auto">
            <div class="text-center mb-12">
              <h2 class="text-4xl font-bold text-gray-900 mb-4">
                Featured Work
              </h2>
              <p class="text-xl text-gray-600">
                Explore selected projects showcasing design and technical expertise
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.featuredProjects.map((project, index) => (
                <article key={index} class="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                  {/* Project Image */}
                  <div class="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                    {/* Category Badge */}
                    <div class="absolute top-4 left-4">
                      <span class="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary text-sm font-semibold rounded-lg">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 class="text-2xl font-bold mb-2">
                      {project.title}
                    </h3>
                    <p class="text-sm text-white/90 mb-3">
                      {project.description}
                    </p>

                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div class="flex flex-wrap gap-2">
                        {project.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            class="px-2 py-1 bg-white/20 backdrop-blur-sm text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Debug Info */}
      <section class="py-12 px-4 bg-gray-100">
        <div class="max-w-7xl mx-auto">
          <details class="bg-white rounded-lg p-6 shadow">
            <summary class="cursor-pointer font-semibold text-lg mb-4">
              🔍 Debug Information
            </summary>

            <div class="space-y-4 text-sm">
              <div>
                <strong>Content Source:</strong>{' '}
                {isBuilderContent ? 'Builder.io API' : 'JSON Fallback'}
              </div>

              {isBuilderContent && builderContent.value && (
                <>
                  <div>
                    <strong>Entry ID:</strong> {builderContent.value.id}
                  </div>
                  <div>
                    <strong>Last Updated:</strong>{' '}
                    {new Date(builderContent.value.lastUpdated).toLocaleString()}
                  </div>
                  <div>
                    <strong>Published:</strong> {builderContent.value.published}
                  </div>
                </>
              )}

              <div>
                <strong>Content Structure:</strong>
                <pre class="mt-2 p-4 bg-gray-50 rounded overflow-x-auto">
                  {JSON.stringify(content, null, 2)}
                </pre>
              </div>
            </div>
          </details>
        </div>
      </section>

      {/* Instructions */}
      <section class="py-12 px-4 bg-blue-50">
        <div class="max-w-4xl mx-auto">
          <h3 class="text-2xl font-bold text-gray-900 mb-6">
            📝 How to Use Builder.io
          </h3>

          <div class="space-y-4 text-gray-700">
            <div class="bg-white p-4 rounded-lg">
              <strong class="block mb-2">1. Create the Model</strong>
              <p class="text-sm">
                Go to <a href="https://builder.io/models" target="_blank" class="text-blue-600 underline">Builder.io Models</a>
                {' '}and create a new <strong>Data Model</strong> named <code class="bg-gray-100 px-2 py-1 rounded">homepage</code>
              </p>
            </div>

            <div class="bg-white p-4 rounded-lg">
              <strong class="block mb-2">2. Add Fields</strong>
              <p class="text-sm mb-2">Add these fields to match the content structure:</p>
              <ul class="text-sm list-disc list-inside space-y-1 ml-4">
                <li><code class="bg-gray-100 px-2 py-1 rounded text-xs">title</code> (Text)</li>
                <li><code class="bg-gray-100 px-2 py-1 rounded text-xs">subtitle</code> (Text)</li>
                <li><code class="bg-gray-100 px-2 py-1 rounded text-xs">description</code> (Long Text)</li>
                <li><code class="bg-gray-100 px-2 py-1 rounded text-xs">heroImage</code> (Image URL)</li>
                <li><code class="bg-gray-100 px-2 py-1 rounded text-xs">featuredProjects</code> (List of Objects)</li>
                <li><code class="bg-gray-100 px-2 py-1 rounded text-xs">metrics</code> (List of Objects)</li>
              </ul>
            </div>

            <div class="bg-white p-4 rounded-lg">
              <strong class="block mb-2">3. Create Content</strong>
              <p class="text-sm">
                Click <strong>+ New Entry</strong> in the homepage model and fill in the content.
                You can copy the existing data from the JSON file to get started.
              </p>
            </div>

            <div class="bg-white p-4 rounded-lg">
              <strong class="block mb-2">4. Publish</strong>
              <p class="text-sm">
                Click <strong>Publish</strong> in the Builder.io editor. Refresh this page to see your changes!
              </p>
            </div>
          </div>

          <div class="mt-6 p-4 bg-white rounded-lg border-l-4 border-blue-600">
            <p class="text-sm text-gray-700">
              <strong>📚 Documentation:</strong> See{' '}
              <code class="bg-gray-100 px-2 py-1 rounded text-xs">docs/BUILDER_IO_SETUP.md</code>
              {' '}for complete setup instructions and all content models.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Builder.io CMS Example | John P. Stas',
  meta: [
    {
      name: 'description',
      content: 'Example page demonstrating Builder.io CMS integration with Qwik',
    },
  ],
};
