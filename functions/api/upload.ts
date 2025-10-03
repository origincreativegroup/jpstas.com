export const onRequestPost: PagesFunction = async (context) => {
  const { request } = context;
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string;
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'video/x-msvideo'
    ];

    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid file type. Allowed types: ' + allowedTypes.join(', ')
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return new Response(JSON.stringify({ 
        error: 'File too large. Maximum size is 10MB'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${Math.random().toString(36).substring(2)}.${extension}`;
    
    // In a real implementation, you would upload to a cloud storage service
    // For now, we'll simulate the upload and return a URL
    const fileUrl = `/images/${filename}`;
    
    // Log the upload (in production, you'd save to cloud storage)
    console.log('File upload:', {
      originalName: file.name,
      filename,
      size: file.size,
      type: file.type,
      projectId,
      url: fileUrl
    });

    // Return success response with file info
    return new Response(JSON.stringify({
      success: true,
      file: {
        id: timestamp.toString(),
        name: file.name,
        filename,
        url: fileUrl,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      }
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({ 
      error: 'Upload failed: ' + (error as Error).message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const onRequestDelete: PagesFunction = async (context) => {
  const { request } = context;
  const url = new URL(request.url);
  const filename = url.searchParams.get('filename');
  
  if (!filename) {
    return new Response(JSON.stringify({ error: 'Filename required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // In a real implementation, you would delete from cloud storage
    console.log('File delete:', filename);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'File deleted successfully'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Delete failed: ' + (error as Error).message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
