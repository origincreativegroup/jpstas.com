/**
 * Home Page Content API
 *
 * Endpoints:
 * - GET  /api/content/home   - Fetch published home page content
 * - PATCH /api/content/home  - Update home page content (saves as draft)
 */

import type { HomePageContent, ContentWrapper } from '../../../src/types/content';
import { defaultHomeContent } from './_defaults';

const CONTENT_KEY = 'content:home';
const DRAFT_KEY = 'content:home:draft';

/**
 * GET /api/content/home
 * Fetches the published home page content
 */
export const onRequestGet: PagesFunction = async context => {
  const { env } = context;

  try {
    // Development mode: Return default content if KV not available
    if (!env.CONTENT_KV) {
      console.log('[DEV] CONTENT_KV not available, returning default home content');
      return new Response(JSON.stringify({ success: true, data: defaultHomeContent }), {
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
      console.log('Home content not found, initializing with default');
      await env.CONTENT_KV.put(CONTENT_KEY, JSON.stringify(defaultHomeContent));
      return new Response(JSON.stringify({ success: true, data: defaultHomeContent }), {
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
    console.error('Home content fetch error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to fetch home content: ' + (error as Error).message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

/**
 * PATCH /api/content/home
 * Updates the home page content (saves as draft)
 */
export const onRequestPatch: PagesFunction = async context => {
  const { request, env } = context;

  try {
    const updates: Partial<HomePageContent> = await request.json();

    // Development mode: Return success without persistence
    if (!env.CONTENT_KV) {
      console.log('[DEV] CONTENT_KV not available, returning mock success');
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Content updated (dev mode - no persistence)',
          data: {
            ...defaultHomeContent,
            content: { ...defaultHomeContent.content, ...updates },
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
    const currentContent: ContentWrapper<HomePageContent> | null = await env.CONTENT_KV.get(
      CONTENT_KEY,
      'json'
    );
    const baseContent = currentContent || defaultHomeContent;

    // Merge updates with existing content
    const updatedContent: ContentWrapper<HomePageContent> = {
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

    console.log('Home content saved as draft');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Home content saved as draft',
        data: updatedContent,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Home content update error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to update home content: ' + (error as Error).message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
