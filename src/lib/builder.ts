/**
 * Builder.io Configuration and Utilities
 *
 * This file configures the Builder.io SDK for the jpstas.com portfolio site.
 * Builder.io provides visual CMS capabilities for managing all content.
 */

import { getBuilderSearchParams } from '@builder.io/sdk-qwik';

// Get Builder.io public API key from environment
export const BUILDER_PUBLIC_KEY = import.meta.env.VITE_BUILDER_PUBLIC_KEY || '';

if (!BUILDER_PUBLIC_KEY && import.meta.env.DEV) {
  console.warn(
    '⚠️  Builder.io public key not found. Set VITE_BUILDER_PUBLIC_KEY in your .env file.\n' +
    'Get your API key from: https://builder.io/account/space'
  );
}

/**
 * Content model names in Builder.io
 * These correspond to the data models we'll create in the Builder.io dashboard
 */
export const BUILDER_MODELS = {
  // Site-wide content
  HOMEPAGE: 'homepage',
  ABOUT: 'about-page',
  SITE_SETTINGS: 'site-settings',

  // Portfolio content
  PORTFOLIO_PROJECT: 'portfolio-project',

  // Page content
  PAGE: 'page',
} as const;

/**
 * Builder.io API configuration
 */
export const builderConfig = {
  apiKey: BUILDER_PUBLIC_KEY,
  canTrack: true, // Enable analytics tracking
  locale: 'Default',
};

/**
 * Check if we're in Builder.io preview/edit mode
 */
export const isBuilderPreview = (url: URL) => {
  return getBuilderSearchParams(url.searchParams);
};

/**
 * Get Builder.io editor URL for a specific model and entry
 */
export const getBuilderEditorUrl = (model: string, entryId?: string) => {
  const baseUrl = 'https://builder.io/content';
  if (entryId) {
    return `${baseUrl}/${entryId}`;
  }
  return `${baseUrl}?model=${model}`;
};

/**
 * Content fallback helpers
 * These ensure the site works even if Builder.io is unavailable
 */
export const withFallback = <T>(builderContent: T | null, fallbackContent: T): T => {
  return builderContent || fallbackContent;
};
