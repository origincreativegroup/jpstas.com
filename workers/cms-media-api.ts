/**
 * Cloudflare Worker - CMS Media API
 * Handles R2 media uploads, listing, and deletion for Decap CMS
 */

interface Env {
  MEDIA_BUCKET: R2Bucket;
  CLOUDFLARE_ACCOUNT_ID: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    };
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    // Routes
    try {
      if (path.endsWith('/upload') && request.method === 'POST') {
        return await handleUpload(request, env, corsHeaders);
      }
      
      if (path.endsWith('/list') && request.method === 'GET') {
        return await handleList(request, env, corsHeaders);
      }
      
      if (path.endsWith('/delete') && request.method === 'DELETE') {
        return await handleDelete(request, env, corsHeaders);
      }
      
      if (path.endsWith('/file') && request.method === 'GET') {
        return await handleGetFile(request, env, corsHeaders);
      }
      
      return new Response('Not Found', { status: 404, headers: corsHeaders });
    } catch (error) {
      console.error('API Error:', error);
      return new Response(
        JSON.stringify({ 
          error: true, 
          message: error instanceof Error ? error.message : 'Internal server error' 
        }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  }
};

/**
 * Handle file upload to R2
 */
async function handleUpload(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('path') as string) || 'portfolio';
    
    if (!file) {
      return new Response(
        JSON.stringify({ error: true, message: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Generate clean filename
    const timestamp = Date.now();
    const originalName = file.name;
    const extension = originalName.split('.').pop();
    const baseName = originalName.replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);
    
    const filename = `${baseName}-${timestamp}.${extension}`;
    const key = `${folder}/${filename}`;
    
    // Upload to R2
    const fileBuffer = await file.arrayBuffer();
    await env.MEDIA_BUCKET.put(key, fileBuffer, {
      httpMetadata: {
        contentType: file.type || 'application/octet-stream',
      },
      customMetadata: {
        originalName: originalName,
        uploadedAt: new Date().toISOString(),
      },
    });
    
    // Return public URL
    const publicUrl = `https://media.jpstas.com/${key}`;
    
    return new Response(
      JSON.stringify({
        success: true,
        url: publicUrl,
        key: key,
        filename: filename,
        size: file.size,
        type: file.type,
        path: folder,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return new Response(
      JSON.stringify({ 
        error: true, 
        message: error instanceof Error ? error.message : 'Upload failed' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * List files in R2
 */
async function handleList(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const url = new URL(request.url);
    const prefix = url.searchParams.get('prefix') || 'portfolio';
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const cursor = url.searchParams.get('cursor') || undefined;
    
    const listed = await env.MEDIA_BUCKET.list({
      prefix: prefix,
      limit: limit,
      cursor: cursor,
    });
    
    const files = listed.objects.map(obj => ({
      key: obj.key,
      filename: obj.key.split('/').pop() || obj.key,
      size: obj.size,
      url: `https://media.jpstas.com/${obj.key}`,
      uploaded: obj.uploaded.toISOString(),
      etag: obj.etag,
    }));
    
    return new Response(
      JSON.stringify({
        files: files,
        hasMore: !listed.truncated,
        cursor: listed.cursor,
        count: files.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('List error:', error);
    return new Response(
      JSON.stringify({ 
        error: true, 
        message: error instanceof Error ? error.message : 'Failed to list files' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Delete file from R2
 */
async function handleDelete(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const body = await request.json() as { key: string };
    
    if (!body.key) {
      return new Response(
        JSON.stringify({ error: true, message: 'No key provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    await env.MEDIA_BUCKET.delete(body.key);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'File deleted successfully',
        key: body.key,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Delete error:', error);
    return new Response(
      JSON.stringify({ 
        error: true, 
        message: error instanceof Error ? error.message : 'Delete failed' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Get file details
 */
async function handleGetFile(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const url = new URL(request.url);
    const key = url.searchParams.get('key');
    
    if (!key) {
      return new Response(
        JSON.stringify({ error: true, message: 'No key provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const object = await env.MEDIA_BUCKET.head(key);
    
    if (!object) {
      return new Response(
        JSON.stringify({ error: true, message: 'File not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({
        key: key,
        filename: key.split('/').pop() || key,
        size: object.size,
        url: `https://media.jpstas.com/${key}`,
        uploaded: object.uploaded.toISOString(),
        etag: object.etag,
        contentType: object.httpMetadata?.contentType,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('GetFile error:', error);
    return new Response(
      JSON.stringify({ 
        error: true, 
        message: error instanceof Error ? error.message : 'Failed to get file' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

