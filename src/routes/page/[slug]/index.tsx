/**
 * Builder.io Visual Page Route
 *
 * This route renders pages created in Builder.io's visual editor
 * with access to custom Cloudflare components
 */

import { component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { Content, fetchOneEntry, getBuilderSearchParams } from '@builder.io/sdk-qwik';
import { BUILDER_PUBLIC_KEY } from '~/lib/builder';
import { CUSTOM_COMPONENTS } from '~/lib/builder-components';

export const useBuilderContent = routeLoader$(async ({ params, url }) => {
  const urlPath = `/page/${params.slug}`;

  const content = await fetchOneEntry({
    model: 'page',
    apiKey: BUILDER_PUBLIC_KEY,
    options: getBuilderSearchParams(url.searchParams),
    userAttributes: {
      urlPath,
    },
  });

  return content;
});

export default component$(() => {
  const content = useBuilderContent();

  // 404 if page not found
  if (!content.value) {
    return (
      <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p class="text-gray-600">The page you're looking for doesn't exist.</p>
          <a href="/" class="mt-4 inline-block text-primary hover:underline">
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <Content
      model="page"
      content={content.value}
      apiKey={BUILDER_PUBLIC_KEY}
      customComponents={CUSTOM_COMPONENTS}
    />
  );
});
