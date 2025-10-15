# Cloudflare Media Management Guide

Complete guide for managing images and videos for jpstas.com using Cloudflare R2, Cloudflare Images, and Cloudflare Stream.

## Table of Contents

1. [Overview](#overview)
2. [Cloudflare R2 Storage](#cloudflare-r2-storage)
3. [Cloudflare Images](#cloudflare-images)
4. [Cloudflare Stream](#cloudflare-stream)
5. [Best Practices](#best-practices)
6. [Current Implementation](#current-implementation)
7. [Troubleshooting](#troubleshooting)

---

## Overview

This portfolio site uses three Cloudflare services for media management:

- **Cloudflare R2**: Object storage for original images/videos (like AWS S3, but without egress fees)
- **Cloudflare Images**: Automatic image optimization, resizing, and transformation
- **Cloudflare Stream**: Video hosting, encoding, and adaptive streaming

### Why These Services?

- **Zero egress fees**: No bandwidth charges for downloading files
- **Global CDN**: Automatic delivery from 330+ locations worldwide
- **Automatic optimization**: Images and videos are optimized automatically
- **Cost-effective**: Pay-as-you-go pricing with generous free tiers

---

## Cloudflare R2 Storage

R2 is your primary storage for all media assets. Think of it as a file cabinet in the cloud.

### Setting Up R2

#### 1. Create a Bucket

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2** in the left sidebar
3. Click **Create bucket**
4. Name your bucket (e.g., `jpstas-media`)
5. Click **Create bucket**

#### 2. Configure Public Access (Optional)

To allow direct public access to files:

1. Go to your bucket settings
2. Click **Settings** tab
3. Under **Public Access**, click **Allow Access**
4. Copy the public bucket URL (e.g., `https://[bucket-id].r2.cloudflarestorage.com/jpstas-media`)

> **Note**: For this project, we use public access. For more security, you can use presigned URLs or Workers.

### Uploading Files to R2

#### Method 1: Dashboard Upload (Quick & Easy)

**Best for**: Single files or small batches

1. Open your bucket in the R2 dashboard
2. Click **Upload**
3. Drag and drop files or click **Select from computer**
4. Wait for upload confirmation
5. Your file is now available at: `https://[bucket-id].r2.cloudflarestorage.com/jpstas-media/[filename]`

**File Size Limit**: Up to 300 MB per file via dashboard

#### Method 2: Rclone (For Bulk Uploads)

**Best for**: Multiple files, large files (>300 MB), or automated workflows

**Install Rclone:**
```bash
# macOS (Homebrew)
brew install rclone

# Windows (Chocolatey)
choco install rclone

# Linux
curl https://rclone.org/install.sh | sudo bash
```

**Configure Rclone:**
```bash
rclone config
```

Follow the prompts:
- Choose **n** for new remote
- Name: `cloudflare-r2`
- Type: **5** (Amazon S3 compatible)
- Provider: **Cloudflare**
- Get access credentials from Cloudflare Dashboard → R2 → Manage R2 API Tokens

**Upload files:**
```bash
# Upload a single file
rclone copy /path/to/image.jpg cloudflare-r2:jpstas-media/

# Upload a folder
rclone copy /path/to/images/ cloudflare-r2:jpstas-media/images/

# Sync entire directory (deletes files not in source)
rclone sync /path/to/local/media/ cloudflare-r2:jpstas-media/
```

#### Method 3: Wrangler CLI (For Developers)

**Best for**: Scripted uploads, CI/CD pipelines

```bash
# Install Wrangler
npm install -g wrangler

# Authenticate
wrangler login

# Upload a file
wrangler r2 object put jpstas-media/image.jpg --file=/path/to/image.jpg

# Upload with metadata
wrangler r2 object put jpstas-media/image.jpg \
  --file=/path/to/image.jpg \
  --content-type=image/jpeg
```

#### Method 4: Programmatic Upload (Node.js/JavaScript)

**Best for**: Custom upload forms, user uploads in apps

```javascript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: '<R2_ACCESS_KEY_ID>',
    secretAccessKey: '<R2_SECRET_ACCESS_KEY>',
  },
});

async function uploadToR2(filePath, key) {
  const fileContent = fs.readFileSync(filePath);

  const command = new PutObjectCommand({
    Bucket: 'jpstas-media',
    Key: key,
    Body: fileContent,
    ContentType: 'image/jpeg', // or detect automatically
  });

  await s3Client.send(command);
  console.log(`Uploaded: https://[bucket-id].r2.cloudflarestorage.com/jpstas-media/${key}`);
}

// Usage
await uploadToR2('./my-image.jpg', 'portfolio/my-image.jpg');
```

### File Organization in R2

**Recommended folder structure:**
```
jpstas-media/
├── portfolio/
│   ├── formstack/
│   │   ├── hero.jpg
│   │   ├── screenshot-1.jpg
│   │   └── before-after-1.jpg
│   ├── caribbeanpools/
│   └── deckhand/
├── about/
│   └── headshot.jpg
├── videos/
│   └── demo-videos/ (optional, prefer Stream)
└── assets/
    └── logos/
```

### Getting File URLs

After uploading to R2, your file URL format is:
```
https://[bucket-id].r2.cloudflarestorage.com/jpstas-media/[path/to/file]
```

**Example from current implementation:**
```
https://fa917615d33ac203929027798644acef.r2.cloudflarestorage.com/jpstas-media/drone-hero.jpg
```

---

## Cloudflare Images

Cloudflare Images provides automatic optimization, resizing, and transformation for your images stored in R2 or elsewhere.

### Two Usage Options

#### Option 1: Transform Images Stored in R2 (FREE)

This is what you're currently using. No storage cost, just transformation.

**How it works:**
1. Store original images in R2
2. Use Cloudflare Image Resizing URLs to transform them on-the-fly
3. Cloudflare caches the transformed versions

**URL Format:**
```
https://www.jpstas.com/cdn-cgi/image/[options]/[image-url]
```

**Example transformations:**
```html
<!-- Resize to 800px wide, maintain aspect ratio -->
<img src="https://www.jpstas.com/cdn-cgi/image/width=800/https://fa917615d33ac203929027798644acef.r2.cloudflarestorage.com/jpstas-media/drone-hero.jpg" alt="Hero">

<!-- Resize and convert to WebP -->
<img src="https://www.jpstas.com/cdn-cgi/image/width=800,format=webp/https://fa917615d33ac203929027798644acef.r2.cloudflarestorage.com/jpstas-media/drone-hero.jpg" alt="Hero">

<!-- Resize, optimize quality, blur -->
<img src="https://www.jpstas.com/cdn-cgi/image/width=400,quality=85,blur=5/https://fa917615d33ac203929027798644acef.r2.cloudflarestorage.com/jpstas-media/preview.jpg" alt="Preview">

<!-- Responsive images with srcset -->
<img
  src="https://www.jpstas.com/cdn-cgi/image/width=800/https://[url]"
  srcset="
    https://www.jpstas.com/cdn-cgi/image/width=400/https://[url] 400w,
    https://www.jpstas.com/cdn-cgi/image/width=800/https://[url] 800w,
    https://www.jpstas.com/cdn-cgi/image/width=1200/https://[url] 1200w
  "
  sizes="(max-width: 768px) 400px, (max-width: 1024px) 800px, 1200px"
  alt="Responsive image">
```

**Common transformation options:**
- `width=X` - Resize width to X pixels
- `height=X` - Resize height to X pixels
- `fit=scale-down|contain|cover|crop|pad` - How to fit the image
- `format=webp|avif|jpeg|png` - Output format
- `quality=X` - Quality (1-100)
- `blur=X` - Blur radius
- `sharpen=X` - Sharpen amount
- `rotate=X` - Rotation degrees
- `brightness=X` - Brightness adjustment (-100 to 100)
- `contrast=X` - Contrast adjustment (-100 to 100)

#### Option 2: Upload & Store in Cloudflare Images (PAID)

**Pricing**: $5 per 100,000 images/month + $1 per 100,000 deliveries

**When to use**:
- Need direct uploads from users
- Want Cloudflare to manage storage
- Need built-in variants system

**Setup:**
1. Go to **Images** in Cloudflare Dashboard
2. Purchase storage if needed
3. Create variants for different use cases

**Upload via API:**
```bash
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/images/v1" \
  -H "Authorization: Bearer <API_TOKEN>" \
  -F "file=@./image.jpg"
```

**Using uploaded images:**
```html
<!-- Default variant -->
<img src="https://imagedelivery.net/<ACCOUNT_HASH>/<IMAGE_ID>/public" alt="Image">

<!-- Custom variant -->
<img src="https://imagedelivery.net/<ACCOUNT_HASH>/<IMAGE_ID>/thumbnail" alt="Thumbnail">
```

### Setting Up Image Resizing in Your Project

To use image transformations on your domain, ensure:

1. Your domain is on Cloudflare (proxied - orange cloud)
2. Image Resizing is enabled in Dashboard → Speed → Optimization → Image Resizing

**Create a helper component for optimized images:**

```typescript
// src/components/OptimizedImage.tsx
import { component$ } from '@builder.io/qwik';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  class?: string;
}

export const OptimizedImage = component$<OptimizedImageProps>(({
  src,
  alt,
  width = 800,
  height,
  quality = 85,
  format = 'webp',
  class: className,
}) => {
  // Build transformation URL
  const options = [
    `width=${width}`,
    height ? `height=${height}` : '',
    `quality=${quality}`,
    `format=${format}`,
  ].filter(Boolean).join(',');

  const optimizedSrc = `https://www.jpstas.com/cdn-cgi/image/${options}/${src}`;

  // Create srcset for responsive images
  const srcset = [
    `https://www.jpstas.com/cdn-cgi/image/width=${Math.round(width * 0.5)},format=${format}/${src} ${Math.round(width * 0.5)}w`,
    `https://www.jpstas.com/cdn-cgi/image/width=${width},format=${format}/${src} ${width}w`,
    `https://www.jpstas.com/cdn-cgi/image/width=${Math.round(width * 1.5)},format=${format}/${src} ${Math.round(width * 1.5)}w`,
  ].join(', ');

  return (
    <img
      src={optimizedSrc}
      srcset={srcset}
      sizes={`(max-width: 768px) ${Math.round(width * 0.5)}px, ${width}px`}
      alt={alt}
      class={className}
      loading="lazy"
      decoding="async"
    />
  );
});
```

**Usage in your pages:**
```tsx
import { OptimizedImage } from '~/components/OptimizedImage';

// In your component
<OptimizedImage
  src="https://fa917615d33ac203929027798644acef.r2.cloudflarestorage.com/jpstas-media/drone-hero.jpg"
  alt="Drone aerial shot"
  width={1200}
  quality={90}
  format="webp"
  class="w-full h-auto"
/>
```

---

## Cloudflare Stream

Stream is Cloudflare's video hosting platform with automatic encoding, adaptive streaming, and a built-in player.

### Why Use Stream Instead of R2 for Videos?

| Feature | Stream | R2 Only |
|---------|--------|---------|
| Automatic encoding | ✅ Multiple qualities | ❌ Single file |
| Adaptive bitrate | ✅ Adjusts to connection | ❌ One size |
| Thumbnail generation | ✅ Automatic | ❌ Manual |
| Analytics | ✅ Built-in | ❌ None |
| DRM/Access control | ✅ Signed URLs | ⚠️ Manual |
| Video player | ✅ Customizable | ❌ DIY |
| Cost | $1 per 1000 min delivered | Bandwidth charges |

### Setting Up Stream

#### 1. Enable Stream

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Stream** in sidebar
3. Your account is automatically enabled with free tier

#### 2. Upload Videos

**Method 1: Dashboard Upload**

1. Go to Stream dashboard
2. Click **Upload video**
3. Drag and drop video file or select from computer
4. Add metadata (title, description)
5. Wait for encoding to complete
6. Copy video ID

**Method 2: API Upload (Direct Upload)**

```bash
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/stream" \
  -H "Authorization: Bearer <API_TOKEN>" \
  -F "file=@./video.mp4" \
  -F "meta={\"name\":\"Project Demo Video\"}"
```

**Method 3: Upload from URL**

```bash
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/stream/copy" \
  -H "Authorization: Bearer <API_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://fa917615d33ac203929027798644acef.r2.cloudflarestorage.com/jpstas-media/demo.mp4",
    "meta": {
      "name": "Demo Video"
    }
  }'
```

**Method 4: TUS Resumable Upload (For Large Files)**

```javascript
import * as tus from 'tus-js-client';

const file = document.querySelector('input[type=file]').files[0];

const upload = new tus.Upload(file, {
  endpoint: 'https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/stream',
  headers: {
    'Authorization': 'Bearer <API_TOKEN>',
  },
  chunkSize: 50 * 1024 * 1024, // 50MB chunks
  metadata: {
    name: file.name,
    filetype: file.type,
  },
  onSuccess: () => {
    console.log('Upload finished:', upload.url);
  },
  onError: (error) => {
    console.error('Upload error:', error);
  },
  onProgress: (bytesUploaded, bytesTotal) => {
    const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
    console.log(`Progress: ${percentage}%`);
  },
});

upload.start();
```

### Using Stream Videos

#### Getting Your Video ID

After upload, Stream gives you a video ID like: `5d5bc37ffcf54c9b82e996823bffbb81`

#### Embedding Stream Videos

**Method 1: Stream Player (Recommended)**

```html
<stream
  src="5d5bc37ffcf54c9b82e996823bffbb81"
  controls
  preload="metadata"
></stream>

<script
  data-cfasync="false"
  defer
  type="text/javascript"
  src="https://embed.cloudflarestream.com/embed/sdk.latest.js"
></script>
```

**Method 2: iframe Embed**

```html
<iframe
  src="https://customer-<CODE>.cloudflarestream.com/5d5bc37ffcf54c9b82e996823bffbb81/iframe"
  style="border: none; width: 100%; height: 100%; aspect-ratio: 16 / 9;"
  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
  allowfullscreen="true"
></iframe>
```

**Method 3: Custom Player with HLS/DASH**

```html
<video
  id="video-player"
  controls
  preload="metadata"
  poster="https://customer-<CODE>.cloudflarestream.com/5d5bc37ffcf54c9b82e996823bffbb81/thumbnails/thumbnail.jpg"
>
  <!-- HLS for iOS/Safari -->
  <source
    src="https://customer-<CODE>.cloudflarestream.com/5d5bc37ffcf54c9b82e996823bffbb81/manifest/video.m3u8"
    type="application/x-mpegURL">

  <!-- DASH for other browsers -->
  <source
    src="https://customer-<CODE>.cloudflarestream.com/5d5bc37ffcf54c9b82e996823bffbb81/manifest/video.mpd"
    type="application/dash+xml">
</video>

<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
<script>
  const video = document.getElementById('video-player');
  const src = 'https://customer-<CODE>.cloudflarestream.com/5d5bc37ffcf54c9b82e996823bffbb81/manifest/video.m3u8';

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    // Native HLS support (Safari)
    video.src = src;
  } else if (Hls.isSupported()) {
    // Use HLS.js for other browsers
    const hls = new Hls();
    hls.loadSource(src);
    hls.attachMedia(video);
  }
</script>
```

### Updating Your VideoPlayer Component

Update your existing `VideoPlayer` component to support Stream:

```typescript
// src/components/VideoPlayer.tsx
import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';

interface VideoPlayerProps {
  // Support both direct URLs and Stream IDs
  src?: string;
  streamId?: string;
  poster?: string;
  title?: string;
  autoplay?: boolean;
  loop?: boolean;
}

export const VideoPlayer = component$<VideoPlayerProps>(({
  src,
  streamId,
  poster,
  title,
  autoplay = false,
  loop = false
}) => {
  const isPlaying = useSignal(false);

  // If streamId is provided, use Stream player
  if (streamId) {
    return (
      <div class="group relative w-full overflow-hidden rounded-2xl bg-charcoal shadow-2xl">
        <stream
          src={streamId}
          controls
          autoplay={autoplay}
          loop={loop}
          preload="metadata"
          poster={poster}
        />
        <script
          data-cfasync="false"
          defer
          type="text/javascript"
          src="https://embed.cloudflarestream.com/embed/sdk.latest.js"
        />
      </div>
    );
  }

  // Otherwise use regular video element (for R2 direct)
  return (
    <div class="group relative w-full overflow-hidden rounded-2xl bg-charcoal shadow-2xl">
      <video
        class="w-full h-full object-cover"
        src={src}
        poster={poster}
        controls
        autoplay={autoplay}
        loop={loop}
        onPlay$={() => (isPlaying.value = true)}
        onPause$={() => (isPlaying.value = false)}
        preload="metadata"
      >
        Your browser does not support the video tag.
      </video>

      {!isPlaying.value && title && (
        <div class="absolute bottom-6 left-6 right-6 pointer-events-none">
          <h3 class="text-white text-2xl font-bold drop-shadow-lg">{title}</h3>
        </div>
      )}
    </div>
  );
});
```

**Usage in your case study data:**

```json
{
  "videos": [
    {
      "streamId": "5d5bc37ffcf54c9b82e996823bffbb81",
      "title": "Project Demo",
      "poster": "https://customer-<CODE>.cloudflarestream.com/5d5bc37ffcf54c9b82e996823bffbb81/thumbnails/thumbnail.jpg"
    }
  ]
}
```

```tsx
// In your component
<VideoPlayer
  streamId={video.streamId}
  poster={video.poster}
  title={video.title}
/>
```

### Getting Thumbnails from Stream

Stream automatically generates thumbnails. Access them at:

```
https://customer-<CODE>.cloudflarestream.com/<VIDEO_ID>/thumbnails/thumbnail.jpg

// Or at specific time (in seconds)
https://customer-<CODE>.cloudflarestream.com/<VIDEO_ID>/thumbnails/thumbnail.jpg?time=5s

// Or with specific dimensions
https://customer-<CODE>.cloudflarestream.com/<VIDEO_ID>/thumbnails/thumbnail.jpg?width=640&height=360
```

### Stream Analytics

Access video analytics in the Stream dashboard:
- Views and watch time
- Geographic distribution
- Device and browser breakdown
- Quality metrics

---

## Best Practices

### Image Best Practices

1. **Use appropriate formats:**
   - Photos: WebP or AVIF (with JPEG fallback)
   - Graphics/logos: PNG or SVG
   - Animations: WebP or AVIF (with GIF fallback)

2. **Optimize before upload:**
   - Resize to maximum needed dimensions
   - Export at 85% quality for JPEGs
   - Use tools like ImageOptim, Squoosh, or Sharp

3. **Use responsive images:**
   ```html
   <img
     src="image-800w.jpg"
     srcset="image-400w.jpg 400w, image-800w.jpg 800w, image-1200w.jpg 1200w"
     sizes="(max-width: 768px) 400px, 800px"
     alt="Description"
     loading="lazy">
   ```

4. **Leverage lazy loading:**
   ```html
   <img src="image.jpg" loading="lazy" decoding="async" alt="...">
   ```

5. **Use Cloudflare Image Resizing for all images:**
   - Never use full-resolution images in the browser
   - Always specify width/quality parameters
   - Use format=webp for modern browsers

### Video Best Practices

1. **Always use Stream for videos >5 MB**
   - Automatic encoding to multiple qualities
   - Adaptive bitrate streaming
   - Better performance and user experience

2. **Export video settings:**
   - Resolution: 1080p or 1440p maximum
   - Frame rate: 24-30 fps (60 fps for motion-heavy content)
   - Codec: H.264 or H.265
   - Bitrate: Let Stream handle re-encoding

3. **Use appropriate formats:**
   - MP4 (H.264) for maximum compatibility
   - Stream handles all conversions automatically

4. **Provide poster images:**
   - Always include poster attribute
   - Use Stream's auto-generated thumbnails
   - Or upload custom poster to R2

5. **Consider autoplay carefully:**
   - Mute autoplay videos: `<video autoplay muted>`
   - Most browsers block unmuted autoplay
   - Provide play button for user control

### Storage Organization

1. **Use consistent naming:**
   ```
   portfolio/project-slug/hero.jpg
   portfolio/project-slug/screenshot-1.jpg
   portfolio/project-slug/before-after-comparison.jpg
   ```

2. **Include metadata in filenames:**
   ```
   caribbeanpools-homepage-mobile-1200w.jpg
   formstack-dashboard-desktop-1920w.jpg
   ```

3. **Version files when updating:**
   ```
   logo-v1.svg
   logo-v2.svg
   hero-2024-01.jpg
   ```

4. **Separate by media type:**
   ```
   jpstas-media/
   ├── images/
   ├── videos/
   ├── documents/
   └── assets/
   ```

---

## Current Implementation

### R2 Bucket

**Bucket ID**: `fa917615d33ac203929027798644acef`
**Bucket Name**: `jpstas-media`
**Base URL**: `https://fa917615d33ac203929027798644acef.r2.cloudflarestorage.com/jpstas-media/`

### Example Files Currently in Use

```json
{
  "hero": {
    "src": "https://fa917615d33ac203929027798644acef.r2.cloudflarestorage.com/jpstas-media/drone-hero.jpg",
    "alt": "Aerial drone shot of completed pool"
  },
  "gallery": [
    {
      "src": "https://fa917615d33ac203929027798644acef.r2.cloudflarestorage.com/jpstas-media/drone-aerial-1.jpg",
      "alt": "Aerial view 1"
    }
  ]
}
```

### Updating Case Study Data

Case study JSON files are in `src/data/`. To add new images:

1. Upload image to R2 (e.g., `portfolio/formstack/new-screenshot.jpg`)
2. Get the full URL: `https://fa917615d33ac203929027798644acef.r2.cloudflarestorage.com/jpstas-media/portfolio/formstack/new-screenshot.jpg`
3. Update the JSON file:

```json
{
  "gallery": [
    {
      "src": "https://fa917615d33ac203929027798644acef.r2.cloudflarestorage.com/jpstas-media/portfolio/formstack/new-screenshot.jpg",
      "alt": "Formstack dashboard screenshot",
      "caption": "The new digital forms interface"
    }
  ]
}
```

4. Rebuild the site: `npm run build`

### Components That Use Media

- `src/components/VideoPlayer.tsx` - Video playback
- `src/components/ComparisonSlider.tsx` - Before/after images
- `src/components/ImageGallery.tsx` - Photo galleries
- `src/components/case-study/HeroUnit.tsx` - Hero images
- `src/components/case-study/GallerySection.tsx` - Case study galleries

---

## Troubleshooting

### Images Not Loading

1. **Check CORS settings in R2:**
   - Go to R2 bucket settings
   - Under CORS policy, ensure your domain is allowed

   ```json
   {
     "AllowedOrigins": ["https://www.jpstas.com", "https://jpstas.com"],
     "AllowedMethods": ["GET", "HEAD"],
     "AllowedHeaders": ["*"],
     "MaxAgeSeconds": 3600
   }
   ```

2. **Verify URL is correct:**
   - Check for typos in the URL
   - Ensure file actually exists in R2
   - Check browser console for 404 errors

3. **Check Cloudflare proxy status:**
   - Ensure your domain's DNS is proxied (orange cloud)
   - Image Resizing requires proxied status

### Image Resizing Not Working

1. **Enable Image Resizing:**
   - Dashboard → Speed → Optimization
   - Turn on Image Resizing

2. **Check URL format:**
   ```
   ✅ https://www.jpstas.com/cdn-cgi/image/width=800/https://...
   ❌ https://www.jpstas.com/cdn-cgi/image/width:800/https://... (wrong delimiter)
   ```

3. **Verify domain is on Cloudflare:**
   - Image Resizing only works for proxied domains

### Videos Not Playing

1. **Check video codec compatibility:**
   - Use H.264 codec for maximum compatibility
   - MP4 container format is best
   - Use Stream for automatic encoding

2. **Verify file size:**
   - Keep videos under 1 GB for R2 direct serving
   - Use Stream for larger videos

3. **Check browser console:**
   - Look for CORS errors
   - Check network tab for failed requests

### Stream Videos Not Embedding

1. **Verify Stream ID:**
   - Check the video ID is correct (32-character hex string)
   - Ensure video has finished encoding

2. **Check embed code:**
   - Include the Stream SDK script
   - Use correct customer code in URLs

3. **Test in Stream dashboard:**
   - Go to Stream → Videos
   - Click on video
   - Use "Preview" to test playback

### Upload Failures

1. **File too large for dashboard:**
   - Use Rclone or Wrangler for files >300 MB
   - Use TUS resumable upload for large files

2. **API authentication errors:**
   - Verify API token has correct permissions
   - Check Account ID is correct
   - Ensure token hasn't expired

3. **Network timeout:**
   - Use resumable upload methods
   - Check internet connection stability

---

## Quick Reference

### Common Commands

```bash
# Upload to R2 with Rclone
rclone copy ./image.jpg cloudflare-r2:jpstas-media/path/to/

# Upload to R2 with Wrangler
wrangler r2 object put jpstas-media/image.jpg --file=./image.jpg

# Upload to Stream
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/stream" \
  -H "Authorization: Bearer <TOKEN>" \
  -F "file=@./video.mp4"

# List R2 objects
rclone ls cloudflare-r2:jpstas-media/

# Delete R2 object
wrangler r2 object delete jpstas-media/old-file.jpg
```

### Useful URLs

- **R2 Dashboard**: https://dash.cloudflare.com/?to=/:account/r2
- **Images Dashboard**: https://dash.cloudflare.com/?to=/:account/images
- **Stream Dashboard**: https://dash.cloudflare.com/?to=/:account/stream
- **API Documentation**: https://developers.cloudflare.com/

### Cost Calculator

**R2 Storage:**
- Storage: $0.015 per GB/month
- Class A operations (writes): $4.50 per million
- Class B operations (reads): $0.36 per million
- No egress fees

**Cloudflare Images:**
- Storage: $5 per 100,000 images/month
- Delivery: $1 per 100,000 deliveries
- Transformations: Free tier available

**Cloudflare Stream:**
- Storage: $5 per 1,000 minutes/month
- Delivery: $1 per 1,000 minutes delivered
- Encoding: Free

---

## Support

For issues or questions:
- **Cloudflare Community**: https://community.cloudflare.com/
- **Cloudflare Support**: https://support.cloudflare.com/
- **Documentation**: https://developers.cloudflare.com/

---

**Last Updated**: January 2025
**Maintained by**: John P. Stas
