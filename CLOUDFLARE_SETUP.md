# Cloudflare Stream & Images Setup Guide

This portfolio uses **Cloudflare Stream** for videos and **Cloudflare Images** for image hosting, providing automatic optimization, CDN delivery, and adaptive streaming.

## Prerequisites

- Cloudflare account with Pages project deployed
- Cloudflare Stream enabled (requires paid plan)
- Cloudflare Images enabled (pay-as-you-go pricing)

## Step 1: Get Your Cloudflare Account ID

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select your account
3. Your **Account ID** is displayed in the URL bar or on the right sidebar
4. Copy this value - you'll need it for environment variables

## Step 2: Create API Tokens

### Stream API Token

1. Go to **My Profile** → **API Tokens** → **Create Token**
2. Click **Get started** next to "Create Custom Token"
3. Configure the token:
   - **Token name**: `Portfolio Stream Upload`
   - **Permissions**:
     - Account → Stream → Edit
   - **Account Resources**:
     - Include → Your Account
4. Click **Continue to summary** → **Create Token**
5. **Copy the token** - you won't see it again!

### Images API Token

1. Go to **My Profile** → **API Tokens** → **Create Token**
2. Click **Get started** next to "Create Custom Token"
3. Configure the token:
   - **Token name**: `Portfolio Images Upload`
   - **Permissions**:
     - Account → Cloudflare Images → Edit
   - **Account Resources**:
     - Include → Your Account
4. Click **Continue to summary** → **Create Token**
5. **Copy the token** - you won't see it again!

## Step 3: Configure Environment Variables

### For Local Development

Add to your `.env` file:

```bash
# Cloudflare API Credentials
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
CLOUDFLARE_STREAM_TOKEN=your_stream_api_token_here
CLOUDFLARE_IMAGES_TOKEN=your_images_api_token_here
```

### For Cloudflare Pages (Production)

1. Go to your **Cloudflare Pages** project
2. Navigate to **Settings** → **Environment variables**
3. Add the following variables for **Production** environment:
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_STREAM_TOKEN`
   - `CLOUDFLARE_IMAGES_TOKEN`
4. Click **Save**

**Important**: These are server-side environment variables used by Pages Functions. They are NOT exposed to the client.

## Step 4: Enable Services

### Cloudflare Stream

1. In Cloudflare Dashboard, go to **Stream**
2. If not enabled, click **Enable Stream**
3. Review pricing and confirm

**Pricing**:
- $5/month minimum
- $1 per 1,000 minutes of video delivered
- $5 per 1,000 minutes stored

### Cloudflare Images

1. In Cloudflare Dashboard, go to **Images**
2. If not enabled, click **Enable Images**
3. Review pricing and confirm

**Pricing**:
- $5/month for up to 100,000 images served
- $1 per 1,000 original images stored
- $0.50 per 1,000 variants delivered (after first 100k)

## How It Works

### Video Upload Flow

1. User uploads video through the admin panel
2. File is sent to `/api/upload` Pages Function
3. Function uploads to Cloudflare Stream via API
4. Stream processes video and generates:
   - Adaptive bitrate streams (HLS)
   - Thumbnail images
   - Multiple quality variants
5. Returns video URL and metadata
6. Video is stored and served globally via CDN

### Image Upload Flow

1. User uploads image through the admin panel
2. File is sent to `/api/upload` Pages Function
3. Function uploads to Cloudflare Images via API
4. Images service generates:
   - Optimized WebP/AVIF variants
   - Multiple sizes for responsive images
   - CDN-cached versions
5. Returns image URL and variants
6. Images are served with automatic format selection

## Video Player Usage

### Option 1: Iframe Player (Recommended)

```tsx
import CloudflareVideo from '@/components/CloudflareVideo';

<CloudflareVideo
  videoId="video_uid_here"
  accountId={process.env.CLOUDFLARE_ACCOUNT_ID}
  controls={true}
  autoplay={false}
/>
```

**Benefits**:
- Built-in player controls
- Adaptive bitrate streaming
- Analytics integration
- No additional JavaScript needed

### Option 2: Direct Video Element

```tsx
import { CloudflareVideoDirect } from '@/components/CloudflareVideo';

<CloudflareVideoDirect
  videoId="video_uid_here"
  accountId={process.env.CLOUDFLARE_ACCOUNT_ID}
  controls={true}
  poster="optional_poster_url"
/>
```

**Benefits**:
- More styling control
- Custom player possible
- Lighter weight

## Image Usage

Images are automatically optimized and served from Cloudflare's CDN:

```tsx
<img
  src="https://imagedelivery.net/account_hash/image_id/public"
  alt="Description"
  loading="lazy"
/>
```

### Image Variants

Cloudflare Images automatically creates variants. You can request specific sizes:

```
https://imagedelivery.net/account_hash/image_id/variant_name
```

Common variants you can configure:
- `thumbnail` - 200x200 cropped
- `medium` - 800x600 scaled
- `large` - 1920x1080 scaled
- `public` - Original or default variant

## Testing

### Test Video Upload

```bash
curl -X POST http://localhost:8788/api/upload \
  -F "file=@test-video.mp4" \
  -F "projectId=test"
```

### Test Image Upload

```bash
curl -X POST http://localhost:8788/api/upload \
  -F "file=@test-image.jpg" \
  -F "projectId=test"
```

## Troubleshooting

### "Cloudflare credentials not configured"

- Verify environment variables are set correctly
- For local dev: Check `.env` file
- For production: Check Pages → Settings → Environment variables
- Redeploy after adding environment variables

### "Stream upload failed"

- Verify Stream is enabled in your Cloudflare account
- Check API token has correct permissions (Account → Stream → Edit)
- Ensure account is not on free plan (Stream requires paid plan)

### "Image upload failed"

- Verify Images is enabled in your Cloudflare account
- Check API token has correct permissions (Account → Images → Edit)
- Ensure image file is valid format (JPEG, PNG, GIF, WebP)

### Videos not playing

- Check browser console for errors
- Verify video ID is correct
- Ensure video processing is complete in Stream dashboard
- Check iframe/video element src URL is correct

## Security Notes

1. **API Tokens**: Store in environment variables, never commit to git
2. **Signed URLs**: For private content, enable `requireSignedURLs` in Images
3. **Access Control**: Implement authentication in your upload endpoint
4. **Rate Limiting**: Consider adding rate limits to prevent abuse

## Performance Tips

1. **Videos**:
   - Use iframe player for best performance
   - Let Stream handle transcoding and optimization
   - Enable autoplay with muted for better UX

2. **Images**:
   - Use lazy loading with `loading="lazy"`
   - Define width/height to prevent layout shift
   - Use responsive variants for different screen sizes
   - Let Cloudflare auto-select best format (WebP/AVIF)

## Cost Optimization

1. **Stream**:
   - Delete unused videos
   - Use thumbnails for previews instead of autoplay
   - Monitor usage in Stream analytics

2. **Images**:
   - Delete unused images
   - Use variants instead of serving originals
   - Enable caching headers

## Next Steps

1. Test uploads in local development
2. Deploy to Cloudflare Pages
3. Configure environment variables in production
4. Upload test content through admin panel
5. Verify videos and images display correctly
6. Monitor usage and costs in Cloudflare Dashboard

## Resources

- [Cloudflare Stream Documentation](https://developers.cloudflare.com/stream/)
- [Cloudflare Images Documentation](https://developers.cloudflare.com/images/)
- [API Tokens Guide](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)
- [Stream Player Reference](https://developers.cloudflare.com/stream/viewing-videos/using-the-stream-player/)
