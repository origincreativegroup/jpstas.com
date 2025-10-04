// Bulk media operations endpoint

export const onRequestPatch: PagesFunction = async (context) => {
  const { request, env } = context;

  try {
    const { ids, updates } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Media IDs array required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!updates || typeof updates !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Updates object required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // In development, return success without persistence
    if (!env.MEDIA_KV) {
      return new Response(
        JSON.stringify({
          success: true,
          message: `${ids.length} media files updated (dev mode - no persistence)`,
          count: ids.length,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Update each media file
    const results = [];
    for (const id of ids) {
      try {
        // Get current media data
        const currentMedia = await env.MEDIA_KV.get(`media:${id}`, 'json');
        if (!currentMedia) {
          console.warn(`Media ${id} not found, skipping`);
          continue;
        }

        // Merge updates (deep merge for metadata)
        const updatedMedia = {
          ...currentMedia,
          ...updates,
          metadata: {
            ...(currentMedia as any).metadata,
            ...(updates as any).metadata,
          },
          updatedAt: new Date().toISOString(),
        };

        // Save updated media
        await env.MEDIA_KV.put(`media:${id}`, JSON.stringify(updatedMedia));
        results.push(id);
      } catch (error) {
        console.error(`Failed to update media ${id}:`, error);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `${results.length} media files updated successfully`,
        count: results.length,
        ids: results,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Bulk media update error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to update media: ' + (error as Error).message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
