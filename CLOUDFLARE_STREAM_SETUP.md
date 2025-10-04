# Cloudflare Stream Setup Guide

This guide explains how to set up Cloudflare Stream for video handling in the global media library.

## Prerequisites

1. **Cloudflare Account**: You need an active Cloudflare account
2. **Stream Subscription**: Cloudflare Stream requires a paid subscription
3. **API Access**: Generate API tokens for programmatic access

## Setup Steps

### 1. Enable Cloudflare Stream

1. Log in to your Cloudflare dashboard
2. Navigate to **Stream** in the left sidebar
3. Click **Get Started** to enable Stream
4. Choose your subscription plan (Starter, Pro, or Business)

### 2. Get Your Account ID

1. In the Cloudflare dashboard, select your domain
2. Copy your **Account ID** from the right sidebar
3. Save this for the environment variables

### 3. Create API Token

1. Go to **My Profile** → **API Tokens**
2. Click **Create Token**
3. Use **Custom token** template
4. Configure permissions:
   - **Account** → **Cloudflare Stream** → **Edit**
   - **Zone** → **Zone** → **Read** (if needed)
5. Set **Account Resources** to include your account
6. Click **Continue to summary** and **Create Token**
7. Copy the token (you won't see it again!)

### 4. Environment Variables

Add these variables to your `.env` file:

```bash
# Cloudflare Stream Configuration
VITE_CLOUDFLARE_ACCOUNT_ID=your_account_id_here
VITE_CLOUDFLARE_API_TOKEN=your_api_token_here

# Optional: Custom domain for Stream (if using)
VITE_CLOUDFLARE_STREAM_DOMAIN=your-custom-domain.com
```

### 5. Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to the admin panel: `http://localhost:5178/admin`
3. Go to **Media Management**
4. Try uploading a video file
5. Check that it's processed by Cloudflare Stream

## Features

### Video Processing
- **Automatic Processing**: Videos are automatically processed for optimal delivery
- **Adaptive Bitrate**: Multiple quality levels for different devices
- **Thumbnail Generation**: Automatic thumbnail creation
- **Format Optimization**: Automatic format conversion

### Supported Formats
- MP4 (recommended)
- WebM
- OGG
- AVI
- MOV
- WMV
- FLV
- MKV

### File Size Limits
- **Maximum**: 100MB per video
- **Recommended**: Under 50MB for faster processing
- **Minimum**: 1MB

## API Usage

### Upload Video
```typescript
import { cloudflareStream } from '@/services/cloudflareStream';

const uploadVideo = async (file: File) => {
  try {
    const streamUpload = await cloudflareStream.uploadVideo(file, {
      name: 'My Video',
      requireSignedURLs: false,
      allowedOrigins: ['https://yourdomain.com']
    });
    
    const mediaFile = cloudflareStream.convertToMediaFile(streamUpload, file);
    return mediaFile;
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### Get Embed URL
```typescript
const embedUrl = cloudflareStream.getEmbedUrl('stream_id', {
  autoplay: false,
  controls: true,
  loop: false,
  muted: true
});
```

### Get Thumbnail URL
```typescript
const thumbnailUrl = cloudflareStream.getThumbnailUrl('stream_id', {
  time: 5, // 5 seconds into video
  width: 640,
  height: 360,
  fit: 'cover'
});
```

## Integration with Media Library

The Cloudflare Stream integration is automatically handled by the global media context:

1. **Automatic Detection**: Videos are automatically sent to Cloudflare Stream
2. **Progress Tracking**: Upload progress is tracked and displayed
3. **Error Handling**: Comprehensive error handling and retry logic
4. **Global Access**: Videos are available throughout the application

## Troubleshooting

### Common Issues

1. **"Cloudflare credentials not configured"**
   - Check that environment variables are set correctly
   - Restart the development server after adding variables

2. **"File is not a supported video format"**
   - Ensure the file is a supported video format
   - Check file extension and MIME type

3. **"File size exceeds maximum allowed size"**
   - Reduce video file size or duration
   - Consider compressing the video before upload

4. **"Upload failed: Authentication failed"**
   - Verify API token has correct permissions
   - Check that Account ID is correct

### Debug Mode

Enable debug logging to troubleshoot issues:

```typescript
// In your component
import { debug } from '@/utils/debug';

// Enable media debug logging
debug.media.enabled = true;
```

## Production Considerations

### Security
- **API Token Security**: Store API tokens securely
- **CORS Configuration**: Configure allowed origins properly
- **Signed URLs**: Consider using signed URLs for sensitive content

### Performance
- **CDN Integration**: Cloudflare Stream automatically uses CDN
- **Caching**: Thumbnails and metadata are cached
- **Bandwidth**: Monitor bandwidth usage in Cloudflare dashboard

### Monitoring
- **Usage Analytics**: Monitor usage in Cloudflare dashboard
- **Error Tracking**: Set up error tracking for upload failures
- **Performance Metrics**: Track video load times and quality

## Cost Optimization

### Stream Plans
- **Starter**: $5/month + $1 per 1,000 minutes
- **Pro**: $20/month + $1 per 1,000 minutes
- **Business**: $50/month + $1 per 1,000 minutes

### Tips
- Compress videos before upload
- Use appropriate quality settings
- Monitor usage regularly
- Consider video length and frequency

## Support

- **Cloudflare Documentation**: https://developers.cloudflare.com/stream/
- **API Reference**: https://developers.cloudflare.com/stream/api/
- **Community Forum**: https://community.cloudflare.com/

---

*Cloudflare Stream integration provides enterprise-grade video processing and delivery for your portfolio projects.*
