export const onRequestPost: PagesFunction = async (context) => {
  const { request, env } = context;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      return new Response(
        JSON.stringify({
          error: 'Invalid file type. Only images and videos are supported.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    let uploadResult;
    const timestamp = Date.now();

    if (isVideo) {
      // Upload to Cloudflare Stream
      const CLOUDFLARE_ACCOUNT_ID = env.CLOUDFLARE_ACCOUNT_ID;
      const CLOUDFLARE_API_TOKEN = env.CLOUDFLARE_API_TOKEN || env.CLOUDFLARE_STREAM_TOKEN;

      if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN) {
        throw new Error('Cloudflare credentials not configured');
      }

      const streamFormData = new FormData();
      streamFormData.append('file', file);
      streamFormData.append(
        'meta',
        JSON.stringify({
          name: file.name,
          projectId: projectId || 'unknown',
        })
      );

      const streamResponse = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          },
          body: streamFormData,
        }
      );

      const streamData = await streamResponse.json();

      if (!streamResponse.ok || !streamData.success) {
        throw new Error(streamData.errors?.[0]?.message || 'Stream upload failed');
      }

      uploadResult = {
        id: streamData.result.uid,
        name: file.name,
        filename: file.name,
        url: `https://customer-h044ipu9nb6m47zm.cloudflarestream.com/${streamData.result.uid}/manifest/video.m3u8`,
        thumbnailUrl: `https://customer-h044ipu9nb6m47zm.cloudflarestream.com/${streamData.result.uid}/thumbnails/thumbnail.jpg`,
        iframeUrl: `https://customer-h044ipu9nb6m47zm.cloudflarestream.com/${streamData.result.uid}/iframe`,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        cloudflare: {
          type: 'stream',
          uid: streamData.result.uid,
          status: streamData.result.status,
          subdomain: 'customer-h044ipu9nb6m47zm',
        },
      };
    } else {
      // Upload to Cloudflare Images
      const CLOUDFLARE_ACCOUNT_ID = env.CLOUDFLARE_ACCOUNT_ID;
      const CLOUDFLARE_API_TOKEN = env.CLOUDFLARE_API_TOKEN || env.CLOUDFLARE_IMAGES_TOKEN;

      if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN) {
        throw new Error('Cloudflare credentials not configured');
      }

      const imageFormData = new FormData();
      imageFormData.append('file', file);
      imageFormData.append('requireSignedURLs', 'false');
      if (projectId) {
        imageFormData.append('metadata', JSON.stringify({ projectId }));
      }

      const imageResponse = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          },
          body: imageFormData,
        }
      );

      const imageData = await imageResponse.json();

      if (!imageResponse.ok || !imageData.success) {
        throw new Error(imageData.errors?.[0]?.message || 'Image upload failed');
      }

      uploadResult = {
        id: imageData.result.id,
        name: file.name,
        filename: imageData.result.filename,
        url: imageData.result.variants[0], // Public URL
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        cloudflare: {
          type: 'image',
          id: imageData.result.id,
          variants: imageData.result.variants,
        },
      };
    }

    console.log('File uploaded successfully:', {
      type: isVideo ? 'video' : 'image',
      name: file.name,
      id: uploadResult.id,
    });

    return new Response(
      JSON.stringify({
        success: true,
        file: uploadResult,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return new Response(
      JSON.stringify({
        error: 'Upload failed: ' + (error as Error).message,
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
  const fileId = url.searchParams.get('id');
  const fileType = url.searchParams.get('type'); // 'image' or 'video'

  if (!fileId || !fileType) {
    return new Response(
      JSON.stringify({ error: 'File ID and type are required' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const CLOUDFLARE_ACCOUNT_ID = env.CLOUDFLARE_ACCOUNT_ID;

    if (fileType === 'video') {
      // Delete from Cloudflare Stream
      const CLOUDFLARE_API_TOKEN = env.CLOUDFLARE_API_TOKEN || env.CLOUDFLARE_STREAM_TOKEN;

      if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN) {
        throw new Error('Cloudflare credentials not configured');
      }

      const streamResponse = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream/${fileId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          },
        }
      );

      const streamData = await streamResponse.json();

      if (!streamResponse.ok || !streamData.success) {
        throw new Error(streamData.errors?.[0]?.message || 'Stream delete failed');
      }

      console.log('Stream video deleted:', fileId);
    } else if (fileType === 'image') {
      // Delete from Cloudflare Images
      const CLOUDFLARE_API_TOKEN = env.CLOUDFLARE_API_TOKEN || env.CLOUDFLARE_IMAGES_TOKEN;

      if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN) {
        throw new Error('Cloudflare credentials not configured');
      }

      const imageResponse = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1/${fileId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          },
        }
      );

      const imageData = await imageResponse.json();

      if (!imageResponse.ok || !imageData.success) {
        throw new Error(imageData.errors?.[0]?.message || 'Image delete failed');
      }

      console.log('Image deleted:', fileId);
    } else {
      throw new Error('Invalid file type. Must be "image" or "video"');
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'File deleted successfully from Cloudflare',
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Delete error:', error);
    return new Response(
      JSON.stringify({
        error: 'Delete failed: ' + (error as Error).message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
