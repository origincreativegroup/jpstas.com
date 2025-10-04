/**
 * Content Publishing API
 *
 * Endpoint:
 * - POST /api/content/publish  - Publish draft content
 *
 * Body: { type: 'home' | 'about' | 'contact' | 'settings' }
 */

import type { ContentWrapper } from '../../../src/types/content';

type ContentType = 'home' | 'about' | 'contact' | 'settings';

const CONTENT_KEYS: Record<ContentType, { published: string; draft: string }> = {
  home: { published: 'content:home', draft: 'content:home:draft' },
  about: { published: 'content:about', draft: 'content:about:draft' },
  contact: { published: 'content:contact', draft: 'content:contact:draft' },
  settings: { published: 'content:settings', draft: 'content:settings:draft' },
};

/**
 * POST /api/content/publish
 * Publishes draft content by copying it to the published key
 */
export const onRequestPost: PagesFunction = async (context) => {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { type } = body as { type: ContentType };

    // Validate content type
    if (!type || !CONTENT_KEYS[type]) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Invalid content type. Must be one of: ${Object.keys(CONTENT_KEYS).join(', ')}`,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Development mode: Return mock success
    if (!env.CONTENT_KV) {
      console.log('[DEV] CONTENT_KV not available, returning mock publish success');
      return new Response(
        JSON.stringify({
          success: true,
          message: `${type} content published (dev mode - no persistence)`,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const keys = CONTENT_KEYS[type];

    // Fetch draft content
    const draftContent: ContentWrapper<any> | null = await env.CONTENT_KV.get(keys.draft, 'json');

    if (!draftContent) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `No draft content found for ${type}`,
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Update status and publishedAt timestamp
    const publishedContent: ContentWrapper<any> = {
      ...draftContent,
      status: 'published',
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to published key
    await env.CONTENT_KV.put(keys.published, JSON.stringify(publishedContent));

    console.log(`${type} content published successfully`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `${type} content published successfully`,
        data: publishedContent,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Publish error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to publish content: ' + (error as Error).message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
