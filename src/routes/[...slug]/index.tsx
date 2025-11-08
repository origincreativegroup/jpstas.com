/**
 * Builder.io Catch-All Page Route
 *
 * This route handles all pages created in Builder.io's visual editor
 * Matches any URL path not handled by other routes
 */

import { component$ } from '@builder.io/qwik';
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city';
import { Content, fetchOneEntry, getBuilderSearchParams } from '@builder.io/sdk-qwik';
import { BUILDER_PUBLIC_KEY } from '~/lib/builder';
import { CUSTOM_COMPONENTS } from '~/lib/builder-components';

export const useBuilderContent = routeLoader$(async ({ url, pathname }) => {
  // Fetch content from Builder.io for this URL path
  const content = await fetchOneEntry({
    model: 'page',
    apiKey: BUILDER_PUBLIC_KEY,
    options: getBuilderSearchParams(url.searchParams),
    userAttributes: {
      urlPath: pathname,
    },
  });

  // If no content found, return null (will show 404)
  if (!content) {
    return null;
  }

  return content;
});

export default component$(() => {
  const content = useBuilderContent();

  // Show 404 if no Builder.io content found
  if (!content.value) {
    return (
      <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="text-center">
          <h1 class="text-6xl font-bold text-gray-300 mb-4">404</h1>
          <h2 class="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
          <p class="text-gray-600 mb-6">
            This page hasn't been created in Builder.io yet.
          </p>
          <a
            href="/"
            class="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  // Render Builder.io content with custom components
  return (
    <Content
      model="page"
      content={content.value}
      apiKey={BUILDER_PUBLIC_KEY}
      customComponents={CUSTOM_COMPONENTS}
    />
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const content = resolveValue(useBuilderContent);

  return {
    title: content?.data?.title || 'Page',
    meta: [
      {
        name: 'description',
        content: content?.data?.description || '',
      },
    ],
  };
};
