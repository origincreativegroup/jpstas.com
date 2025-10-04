// Media library CRUD endpoints
// Uses Cloudflare KV to store media metadata

export const onRequestGet: PagesFunction = async (context) => {
  const { env } = context;

  try {
    // In development, return empty array or mock data
    if (!env.MEDIA_KV) {
      return new Response(
        JSON.stringify({
          success: true,
          media: [],
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Get media index from KV
    const mediaIndex = await env.MEDIA_KV.get('media:index', 'json');
    const mediaIds: string[] = mediaIndex || [];

    // Fetch all media metadata
    const mediaPromises = mediaIds.map(id => env.MEDIA_KV.get(`media:${id}`, 'json'));
    const mediaFiles = await Promise.all(mediaPromises);

    // Filter out null values (deleted items)
    const validMedia = mediaFiles.filter(Boolean);

    return new Response(
      JSON.stringify({
        success: true,
        media: validMedia,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      }
    );
  } catch (error) {
    console.error('Media fetch error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch media: ' + (error as Error).message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

export const onRequestPost: PagesFunction = async (context) => {
  const { request, env } = context;

  try {
    const data = await request.json();
    const mediaFile = data.file;

    if (!mediaFile || !mediaFile.id) {
      return new Response(
        JSON.stringify({ error: 'Invalid media file data' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // In development, skip KV storage
    if (!env.MEDIA_KV) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Media saved (dev mode - no persistence)',
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Store media metadata in KV
    await env.MEDIA_KV.put(`media:${mediaFile.id}`, JSON.stringify(mediaFile));

    // Update media index
    const mediaIndex: string[] = (await env.MEDIA_KV.get('media:index', 'json')) || [];
    if (!mediaIndex.includes(mediaFile.id)) {
      mediaIndex.unshift(mediaFile.id); // Add to beginning
      await env.MEDIA_KV.put('media:index', JSON.stringify(mediaIndex));
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Media saved successfully',
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Media save error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to save media: ' + (error as Error).message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

export const onRequestPatch: PagesFunction = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const segments = url.pathname.split('/');
  const id = segments[segments.length - 1];

  try {
    const updates = await request.json();

    if (!id || id === 'media') {
      return new Response(
        JSON.stringify({ error: 'Media ID required' }),
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
          message: 'Media updated (dev mode - no persistence)',
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Get current media data
    const currentMedia = await env.MEDIA_KV.get(`media:${id}`, 'json');
    if (!currentMedia) {
      return new Response(
        JSON.stringify({ error: 'Media not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Merge updates
    const updatedMedia = {
      ...currentMedia,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Save updated media
    await env.MEDIA_KV.put(`media:${id}`, JSON.stringify(updatedMedia));

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Media updated successfully',
        media: updatedMedia,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Media update error:', error);
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

export const onRequestDelete: PagesFunction = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return new Response(
      JSON.stringify({ error: 'Media ID required' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    // In development, skip KV deletion
    if (!env.MEDIA_KV) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Media deleted (dev mode - no persistence)',
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Delete media metadata from KV
    await env.MEDIA_KV.delete(`media:${id}`);

    // Update media index
    const mediaIndex: string[] = (await env.MEDIA_KV.get('media:index', 'json')) || [];
    const updatedIndex = mediaIndex.filter(mediaId => mediaId !== id);
    await env.MEDIA_KV.put('media:index', JSON.stringify(updatedIndex));

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Media metadata deleted',
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Media delete error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to delete media: ' + (error as Error).message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
