/**
 * Qwik composable for fetching Builder.io content
 *
 * This provides a type-safe way to fetch content from Builder.io
 * with automatic caching and fallback support.
 */

import { routeLoader$ } from '@builder.io/qwik-city';
import { fetchOneEntry, getBuilderSearchParams } from '@builder.io/sdk-qwik';
import { BUILDER_PUBLIC_KEY } from './builder';

/**
 * Fetch a single entry from Builder.io by model name
 *
 * @example
 * export const useHomepageData = createBuilderLoader('homepage');
 */
export function createBuilderLoader<T = any>(modelName: string) {
  return routeLoader$(async ({ url, cacheControl }) => {
    // Enable caching for production
    cacheControl({
      public: true,
      maxAge: 60 * 60, // 1 hour
      sMaxAge: 60 * 60 * 24, // 24 hours for CDN
      staleWhileRevalidate: 60 * 60 * 24 * 7, // 7 days
    });

    const builderContent = await fetchOneEntry({
      model: modelName,
      apiKey: BUILDER_PUBLIC_KEY,
      options: getBuilderSearchParams(url.searchParams),
      userAttributes: {
        urlPath: url.pathname,
      },
    });

    return builderContent as T;
  });
}

/**
 * Fetch multiple entries from Builder.io by model name
 *
 * @example
 * export const usePortfolioProjects = createBuilderListLoader('portfolio-project');
 */
export function createBuilderListLoader<T = any>(modelName: string, options?: {
  limit?: number;
  query?: Record<string, any>;
}) {
  return routeLoader$(async ({ url, cacheControl }) => {
    cacheControl({
      public: true,
      maxAge: 60 * 60,
      sMaxAge: 60 * 60 * 24,
      staleWhileRevalidate: 60 * 60 * 24 * 7,
    });

    const { fetchEntries } = await import('@builder.io/sdk-qwik');

    const builderContent = await fetchEntries({
      model: modelName,
      apiKey: BUILDER_PUBLIC_KEY,
      limit: options?.limit || 50,
      query: options?.query,
      options: getBuilderSearchParams(url.searchParams),
    });

    return builderContent as T[];
  });
}

/**
 * Fetch portfolio project by slug
 */
export function createPortfolioLoader() {
  return routeLoader$(async ({ params, url, cacheControl }) => {
    cacheControl({
      public: true,
      maxAge: 60 * 60,
      sMaxAge: 60 * 60 * 24,
      staleWhileRevalidate: 60 * 60 * 24 * 7,
    });

    const builderContent = await fetchOneEntry({
      model: 'portfolio-project',
      apiKey: BUILDER_PUBLIC_KEY,
      query: {
        'data.slug': params.slug,
      },
      options: getBuilderSearchParams(url.searchParams),
    });

    return builderContent;
  });
}
