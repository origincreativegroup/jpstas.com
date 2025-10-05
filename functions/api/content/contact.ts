/**
 * Contact Page Content API
 *
 * Endpoints:
 * - GET  /api/content/contact   - Fetch published contact page content
 * - PATCH /api/content/contact  - Update contact page content (saves as draft)
 */

import type { ContactPageContent, ContentWrapper } from '../../../src/types/content';
import { defaultContactContent } from './_defaults';

const CONTENT_KEY = 'content:contact';
const DRAFT_KEY = 'content:contact:draft';

/**
 * GET /api/content/contact
 * Fetches the published contact page content
 */
export const onRequestGet: PagesFunction = async context => {
  const { env } = context;

  try {
    // Development mode: Return default content if KV not available
    if (!env.CONTENT_KV) {
      console.log('[DEV] CONTENT_KV not available, returning default contact content');
      return new Response(JSON.stringify({ success: true, data: defaultContactContent }), {
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
      console.log('Contact content not found, initializing with default');
      await env.CONTENT_KV.put(CONTENT_KEY, JSON.stringify(defaultContactContent));
      return new Response(JSON.stringify({ success: true, data: defaultContactContent }), {
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
    console.error('Contact content fetch error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to fetch contact content: ' + (error as Error).message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

/**
 * PATCH /api/content/contact
 * Updates the contact page content (saves as draft)
 */
export const onRequestPatch: PagesFunction = async context => {
  const { request, env } = context;

  try {
    const updates: Partial<ContactPageContent> = await request.json();

    // Development mode: Return success without persistence
    if (!env.CONTENT_KV) {
      console.log('[DEV] CONTENT_KV not available, returning mock success');
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Content updated (dev mode - no persistence)',
          data: {
            ...defaultContactContent,
            content: { ...defaultContactContent.content, ...updates },
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
    const currentContent: ContentWrapper<ContactPageContent> | null = await env.CONTENT_KV.get(
      CONTENT_KEY,
      'json'
    );
    const baseContent = currentContent || defaultContactContent;

    // Merge updates with existing content
    const updatedContent: ContentWrapper<ContactPageContent> = {
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

    console.log('Contact content saved as draft');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Contact content saved as draft',
        data: updatedContent,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Contact content update error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to update contact content: ' + (error as Error).message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
