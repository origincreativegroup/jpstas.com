/**
 * Global Settings API
 *
 * Endpoints:
 * - GET  /api/content/settings   - Fetch global settings
 * - PATCH /api/content/settings  - Update global settings (saves as draft)
 */

import type { GlobalSettings, ContentWrapper } from '../../../src/types/content';
import { defaultSettings } from './_defaults';

const CONTENT_KEY = 'content:settings';
const DRAFT_KEY = 'content:settings:draft';

/**
 * GET /api/content/settings
 * Fetches the published global settings
 */
export const onRequestGet: PagesFunction = async context => {
  const { env } = context;

  try {
    // Development mode: Return default content if KV not available
    if (!env.CONTENT_KV) {
      console.log('[DEV] CONTENT_KV not available, returning default settings');
      return new Response(JSON.stringify({ success: true, data: defaultSettings }), {
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
      console.log('Settings not found, initializing with default');
      await env.CONTENT_KV.put(CONTENT_KEY, JSON.stringify(defaultSettings));
      return new Response(JSON.stringify({ success: true, data: defaultSettings }), {
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
    console.error('Settings fetch error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to fetch settings: ' + (error as Error).message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

/**
 * PATCH /api/content/settings
 * Updates the global settings (saves as draft)
 */
export const onRequestPatch: PagesFunction = async context => {
  const { request, env } = context;

  try {
    const updates: Partial<GlobalSettings> = await request.json();

    // Development mode: Return success without persistence
    if (!env.CONTENT_KV) {
      console.log('[DEV] CONTENT_KV not available, returning mock success');
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Settings updated (dev mode - no persistence)',
          data: {
            ...defaultSettings,
            content: { ...defaultSettings.content, ...updates },
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
    const currentContent: ContentWrapper<GlobalSettings> | null = await env.CONTENT_KV.get(
      CONTENT_KEY,
      'json'
    );
    const baseContent = currentContent || defaultSettings;

    // Merge updates with existing content
    const updatedContent: ContentWrapper<GlobalSettings> = {
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

    console.log('Settings saved as draft');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Settings saved as draft',
        data: updatedContent,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Settings update error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to update settings: ' + (error as Error).message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
