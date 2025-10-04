/**
 * About Page Content API
 *
 * Endpoints:
 * - GET  /api/content/about   - Fetch published about page content
 * - PATCH /api/content/about  - Update about page content (saves as draft)
 */

import type { AboutPageContent, ContentWrapper } from '../../../src/types/content';
import { defaultAboutContent } from './_defaults';

const CONTENT_KEY = 'content:about';
const DRAFT_KEY = 'content:about:draft';

/**
 * GET /api/content/about
 * Fetches the published about page content
 */
export const onRequestGet: PagesFunction = async (context) => {
  const { env } = context;

  try {
    // Development mode: Return default content if KV not available
    if (!env.CONTENT_KV) {
      console.log('[DEV] CONTENT_KV not available, returning default about content');
      return new Response(JSON.stringify({ success: true, data: defaultAboutContent }), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });
    }

    // Fetch published content from KV
    const content = await env.CONTENT_KV.get(CONTENT_KEY, 'json');

    // If no content exists, initialize with default and save
    if (!content) {
      console.log('About content not found, initializing with default');
      await env.CONTENT_KV.put(CONTENT_KEY, JSON.stringify(defaultAboutContent));
      return new Response(JSON.stringify({ success: true, data: defaultAboutContent }), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });
    }

    return new Response(JSON.stringify({ success: true, data: content }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('About content fetch error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to fetch about content: ' + (error as Error).message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

/**
 * PATCH /api/content/about
 * Updates the about page content (saves as draft)
 */
export const onRequestPatch: PagesFunction = async (context) => {
  const { request, env } = context;

  try {
    const updates: Partial<AboutPageContent> = await request.json();

    // Development mode: Return success without persistence
    if (!env.CONTENT_KV) {
      console.log('[DEV] CONTENT_KV not available, returning mock success');
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Content updated (dev mode - no persistence)',
          data: {
            ...defaultAboutContent,
            content: { ...defaultAboutContent.content, ...updates },
            status: 'draft',
            updatedAt: new Date().toISOString(),
          },
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Fetch current published content
    const currentContent: ContentWrapper<AboutPageContent> | null = await env.CONTENT_KV.get(
      CONTENT_KEY,
      'json'
    );
    const baseContent = currentContent || defaultAboutContent;

    // Merge updates with existing content
    const updatedContent: ContentWrapper<AboutPageContent> = {
      ...baseContent,
      content: {
        ...baseContent.content,
        ...updates,
      },
      status: 'draft',
      updatedAt: new Date().toISOString(),
    };

    // Save as draft
    await env.CONTENT_KV.put(DRAFT_KEY, JSON.stringify(updatedContent));

    console.log('About content saved as draft');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'About content saved as draft',
        data: updatedContent,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('About content update error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to update about content: ' + (error as Error).message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
