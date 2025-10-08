// Bulk operations for media files
// Handles bulk update, delete, and usage queries efficiently

export const onRequestPost: PagesFunction = async context => {
  const { request, env } = context;

  try {
    const data = await request.json();
    const { operation, ids, updates } = data;

    if (!operation || !ids || !Array.isArray(ids) || ids.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid request: operation and ids array required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // In development, return mock success
    if (!env.MEDIA_KV) {
      return new Response(
        JSON.stringify({
          success: true,
          message: `Bulk ${operation} completed (dev mode - no persistence)`,
          results: ids.map(id => ({ id, success: true })),
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const results = [];
    const errors = [];

    switch (operation) {
      case 'update':
        if (!updates) {
          return new Response(JSON.stringify({ error: 'Updates required for bulk update' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        await handleBulkUpdate(ids, updates, env.MEDIA_KV, results, errors);
        break;

      case 'delete':
        await handleBulkDelete(ids, env, results, errors);
        break;

      case 'usage':
        return await handleBulkUsageQuery(ids, env.MEDIA_KV);

      default:
        return new Response(JSON.stringify({ error: 'Invalid operation. Supported: update, delete, usage' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
    }

    return new Response(
      JSON.stringify({
        success: errors.length === 0,
        message: `Bulk ${operation} completed`,
        results,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Bulk operation error:', error);
    return new Response(
      JSON.stringify({
        error: 'Bulk operation failed: ' + (error as Error).message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

async function handleBulkUpdate(
  ids: string[],
  updates: any,
  mediaKv: KVNamespace,
  results: any[],
  errors: any[]
) {
  const timestamp = new Date().toISOString();

  for (const id of ids) {
    try {
      // Get current media data
      const currentMedia = await mediaKv.get(`media:${id}`, 'json');
      if (!currentMedia) {
        errors.push({ id, error: 'Media not found' });
        continue;
      }

      // Merge updates
      const updatedMedia = {
        ...currentMedia,
        ...updates,
        updatedAt: timestamp,
      };

      // Save updated media
      await mediaKv.put(`media:${id}`, JSON.stringify(updatedMedia));
      results.push({ id, success: true, updated: updatedMedia });
    } catch (error) {
      console.error(`Failed to update media ${id}:`, error);
      errors.push({ id, error: (error as Error).message });
    }
  }
}

async function handleBulkDelete(
  ids: string[],
  env: any,
  results: any[],
  errors: any[]
) {
  const CLOUDFLARE_ACCOUNT_ID = env.CLOUDFLARE_ACCOUNT_ID;
  const CLOUDFLARE_API_TOKEN = env.CLOUDFLARE_API_TOKEN;

  for (const id of ids) {
    try {
      // Get media data to determine type
      const mediaData = await env.MEDIA_KV.get(`media:${id}`, 'json');
      if (!mediaData) {
        errors.push({ id, error: 'Media not found in KV' });
        continue;
      }

      // Delete from Cloudflare (Stream or Images)
      if (mediaData.cloudflare?.type === 'stream') {
        // Delete from Cloudflare Stream
        const streamResponse = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream/${id}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
            },
          }
        );

        if (!streamResponse.ok) {
          const streamData = await streamResponse.json();
          throw new Error(streamData.errors?.[0]?.message || 'Stream delete failed');
        }
      } else if (mediaData.cloudflare?.type === 'image') {
        // Delete from Cloudflare Images
        const imageResponse = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1/${id}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
            },
          }
        );

        if (!imageResponse.ok) {
          const imageData = await imageResponse.json();
          throw new Error(imageData.errors?.[0]?.message || 'Image delete failed');
        }
      }

      // Delete metadata from KV
      await env.MEDIA_KV.delete(`media:${id}`);
      await env.MEDIA_KV.delete(`media:${id}:usage`);

      results.push({ id, success: true });
    } catch (error) {
      console.error(`Failed to delete media ${id}:`, error);
      errors.push({ id, error: (error as Error).message });
    }
  }

  // Update media index to remove deleted items
  if (results.length > 0) {
    try {
      const mediaIndex: string[] = (await env.MEDIA_KV.get('media:index', 'json')) || [];
      const deletedIds = results.map(r => r.id);
      const updatedIndex = mediaIndex.filter(id => !deletedIds.includes(id));
      await env.MEDIA_KV.put('media:index', JSON.stringify(updatedIndex));
    } catch (error) {
      console.error('Failed to update media index:', error);
      // Don't fail the entire operation for index update failure
    }
  }
}

async function handleBulkUsageQuery(ids: string[], mediaKv: KVNamespace) {
  try {
    const usageData: { [key: string]: any[] } = {};

    // Fetch usage data for all requested media IDs
    const usagePromises = ids.map(async (id) => {
      try {
        const usage = await mediaKv.get(`media:${id}:usage`, 'json');
        return { id, usage: usage || [] };
      } catch (error) {
        console.error(`Failed to get usage for media ${id}:`, error);
        return { id, usage: [] };
      }
    });

    const usageResults = await Promise.all(usagePromises);
    
    // Convert to object format expected by frontend
    usageResults.forEach(({ id, usage }) => {
      usageData[id] = usage;
    });

    return new Response(
      JSON.stringify({
        success: true,
        usageData,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Bulk usage query error:', error);
    return new Response(
      JSON.stringify({
        error: 'Bulk usage query failed: ' + (error as Error).message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}