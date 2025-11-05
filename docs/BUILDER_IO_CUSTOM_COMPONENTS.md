# Builder.io Custom Components for Cloudflare

This guide covers the custom Qwik components created for Builder.io that integrate with Cloudflare R2 (images) and Cloudflare Stream (videos).

## Table of Contents

- [Overview](#overview)
- [CloudflareR2Image Component](#cloudflarerimage-component)
- [CloudflareStreamVideo Component](#cloudflarestreamvideo-component)
- [Using in Builder.io Visual Editor](#using-in-builderio-visual-editor)
- [Component Registration](#component-registration)
- [Demo Page](#demo-page)
- [Technical Details](#technical-details)

---

## Overview

We've created two custom Qwik components that work seamlessly with Builder.io's drag-and-drop visual editor:

1. **CloudflareR2Image** - Optimized image component for Cloudflare R2 storage with automatic image resizing
2. **CloudflareStreamVideo** - Video player component for Cloudflare Stream with customizable controls

Both components are:
- ✅ Fully typed with TypeScript
- ✅ Optimized for performance (lazy loading, responsive)
- ✅ Builder.io compatible (drag-and-drop in visual editor)
- ✅ Production-ready with error handling

---

## CloudflareR2Image Component

### Features

- **Automatic Image Optimization** - Uses Cloudflare Image Resizing API
- **Responsive srcset** - Generates optimized images for multiple breakpoints (640w, 750w, 828w, 1080w, 1200w, 1920w, 2048w, 3840w)
- **Lazy Loading** - Uses Intersection Observer for performance
- **Blur Placeholder** - Optional progressive loading with blur effect
- **Format Detection** - Automatically serves WebP, AVIF, or fallback formats
- **Customizable Fit Modes** - scale-down, contain, cover, crop, pad
- **Quality Control** - Adjustable quality (1-100)

### Usage in Code

```tsx
import { CloudflareR2Image } from '~/components/builder/CloudflareR2Image';

<CloudflareR2Image
  src="https://media.jpstas.com/portfolio/image.jpg"
  alt="Portfolio image description"
  width={800}
  height={600}
  optimize={true}
  lazy={true}
  quality={85}
  format="webp"
  blurPlaceholder={true}
/>
```

### Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | **required** | Image URL from Cloudflare R2 (media.jpstas.com) |
| `alt` | `string` | **required** | Alt text for accessibility |
| `width` | `number` | - | Target width in pixels (for optimization) |
| `height` | `number` | - | Target height in pixels (for optimization) |
| `optimize` | `boolean` | `true` | Enable Cloudflare Image Resizing |
| `quality` | `number` | `85` | Image quality (1-100) |
| `format` | `string` | `auto` | Force format: `auto`, `webp`, `avif`, `jpeg`, `png` |
| `fit` | `string` | `scale-down` | Fit mode: `scale-down`, `contain`, `cover`, `crop`, `pad` |
| `gravity` | `string` | `auto` | Focus point: `auto`, `left`, `right`, `top`, `bottom`, `center` |
| `lazy` | `boolean` | `true` | Enable lazy loading with Intersection Observer |
| `blurPlaceholder` | `boolean` | `false` | Show blur placeholder while loading |
| `class` | `string` | - | CSS class names |
| `title` | `string` | - | Title attribute for tooltip |

### How It Works

1. **Optimization**: When `optimize=true`, the component constructs Cloudflare Image Resizing URLs:
   ```
   https://media.jpstas.com/cdn-cgi/image/width=800,quality=85,format=webp/image.jpg
   ```

2. **Responsive Images**: Generates srcset for multiple breakpoints automatically:
   ```html
   <img
     src="...cdn-cgi/image/width=800/..."
     srcset="
       ...width=640/... 640w,
       ...width=1080/... 1080w,
       ...width=1920/... 1920w
     "
   />
   ```

3. **Lazy Loading**: Uses Intersection Observer to load images only when they're about to enter the viewport (50px margin)

4. **Blur Placeholder**: Loads a tiny (40px), low-quality (10), blurred (blur=50) version first, then transitions to the full image

---

## CloudflareStreamVideo Component

### Features

- **Cloudflare Stream Integration** - Uses iframe player API
- **Responsive Aspect Ratios** - 16:9, 4:3, 1:1, 9:16 (portrait), 21:9 (ultrawide)
- **Lazy Loading** - Loads video player on demand with custom play button
- **Automatic Thumbnails** - Uses Cloudflare Stream's thumbnail service
- **Customizable Player** - Controls, autoplay, loop, muted options
- **Primary Color** - Customize player button/progress bar color
- **Video ID Extraction** - Accepts video ID or full Cloudflare Stream URLs

### Usage in Code

```tsx
import { CloudflareStreamVideo } from '~/components/builder/CloudflareStreamVideo';

<CloudflareStreamVideo
  videoId="af4889355cd0d36bac6722871cb2bcb3"
  title="FPV Drone Flythrough"
  aspectRatio="16:9"
  autoplay={false}
  loop={false}
  controls={true}
  loading="lazy"
/>
```

### Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `videoId` | `string` | **required** | Cloudflare Stream video ID (32-character hex string) |
| `title` | `string` | `"Video"` | Video title for accessibility |
| `aspectRatio` | `string` | `"16:9"` | Aspect ratio: `16:9`, `4:3`, `1:1`, `9:16`, `21:9` |
| `autoplay` | `boolean` | `false` | Autoplay video on load |
| `loop` | `boolean` | `false` | Loop video playback |
| `muted` | `boolean` | `false` | Mute audio by default |
| `controls` | `boolean` | `true` | Show player controls |
| `preload` | `string` | `"metadata"` | Preload strategy: `auto`, `metadata`, `none` |
| `primaryColor` | `string` | - | Player primary color (hex without #, e.g., `"FF6B6B"`) |
| `letterboxColor` | `string` | - | Letterbox/padding color (hex without #) |
| `loading` | `string` | `"lazy"` | Loading strategy: `lazy`, `eager` |
| `poster` | `string` | - | Custom poster image URL (overrides auto thumbnail) |
| `allowFullscreen` | `boolean` | `true` | Allow fullscreen mode |
| `class` | `string` | - | CSS class names |

### How It Works

1. **Video ID Validation**: Checks that the video ID is a valid 32-character hexadecimal string

2. **Lazy Loading**: When `loading="lazy"`, shows a poster image with a play button. Clicking loads the iframe player:
   ```
   [Poster Image] → [Click Play Button] → [Iframe Player Loads]
   ```

3. **Iframe URL Construction**: Builds Cloudflare Stream iframe URL with parameters:
   ```
   https://customer-h044ipu9nb6m47zm.cloudflarestream.com/{videoId}/iframe?autoplay=true&controls=true
   ```

4. **Automatic Thumbnail**: If no custom poster is provided, uses Cloudflare Stream's thumbnail:
   ```
   https://videodelivery.net/{videoId}/thumbnails/thumbnail.jpg
   ```

---

## Using in Builder.io Visual Editor

### Step 1: Open Builder.io Editor

1. Go to [Builder.io](https://builder.io)
2. Navigate to your content model (e.g., "page", "homepage")
3. Create or edit an entry
4. Click "Edit" to open the visual editor

### Step 2: Add Custom Component

1. In the visual editor, click **"Insert"** in the left sidebar
2. Scroll down to find your custom components:
   - **"Cloudflare R2 Image"**
   - **"Cloudflare Stream Video"**
3. Drag the component onto your page canvas

### Step 3: Configure Component

**For CloudflareR2Image:**
1. Click the component to select it
2. In the right sidebar, you'll see:
   - **src** (required) - Use the file picker or paste your R2 URL
   - **alt** (required) - Enter descriptive alt text
   - **width** - Enter target width (e.g., 800)
   - **height** - Enter target height (e.g., 600)
   - Click "Show Advanced" for more options:
     - optimize, quality, format, fit, lazy, blurPlaceholder, etc.

**For CloudflareStreamVideo:**
1. Click the component to select it
2. In the right sidebar, enter:
   - **videoId** (required) - Your 32-character Cloudflare Stream video ID
   - **title** - Descriptive video title
   - **aspectRatio** - Choose from dropdown (16:9, 4:3, etc.)
   - Click "Show Advanced" for:
     - autoplay, loop, muted, controls, primaryColor, loading, etc.

### Step 4: Preview and Publish

1. Use the preview button to see how your content looks
2. Test on different screen sizes using the device toggle
3. Click **"Publish"** when ready

---

## Component Registration

The custom components are registered in `src/lib/builder-components.ts` and initialized in `src/root.tsx`.

### Registration File

**`src/lib/builder-components.ts`**

```typescript
import { registerComponent } from '@builder.io/sdk-qwik';
import { CloudflareR2Image } from '~/components/builder/CloudflareR2Image';
import { CloudflareStreamVideo } from '~/components/builder/CloudflareStreamVideo';

export function registerBuilderComponents() {
  // Register R2 Image Component
  registerComponent(CloudflareR2Image, {
    name: 'CloudflareR2Image',
    friendlyName: 'Cloudflare R2 Image',
    description: 'Optimized image component for Cloudflare R2',
    image: 'https://cdn.builder.io/api/v1/image/...',
    inputs: [
      { name: 'src', type: 'file', required: true, ... },
      { name: 'alt', type: 'string', required: true, ... },
      // ... more inputs
    ],
  });

  // Register Stream Video Component
  registerComponent(CloudflareStreamVideo, {
    name: 'CloudflareStreamVideo',
    friendlyName: 'Cloudflare Stream Video',
    description: 'Video player for Cloudflare Stream',
    inputs: [
      { name: 'videoId', type: 'string', required: true, ... },
      // ... more inputs
    ],
  });
}
```

### Initialization in Root

**`src/root.tsx`**

```typescript
import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { registerBuilderComponents } from '~/lib/builder-components';

export const Root = component$(() => {
  // Register components on client-side initialization
  useVisibleTask$(() => {
    registerBuilderComponents();
  });

  return (
    <QwikCityProvider>
      {/* ... */}
    </QwikCityProvider>
  );
});
```

The `useVisibleTask$` hook ensures components are registered on the client-side where Builder.io operates.

---

## Demo Page

A comprehensive demo page is available at `/builder-components-demo`.

**Access:** `http://localhost:5173/builder-components-demo` (dev) or `https://jpstas.com/builder-components-demo` (production)

The demo page shows:
- ✅ Both components with live examples
- ✅ Different configurations (basic, advanced, blur placeholder, autoplay, etc.)
- ✅ Code snippets for each example
- ✅ Full props reference tables
- ✅ Builder.io integration guide
- ✅ Feature lists and use cases

---

## Technical Details

### File Structure

```
src/
├── components/
│   └── builder/
│       ├── CloudflareR2Image.tsx          # R2 Image component
│       └── CloudflareStreamVideo.tsx      # Stream Video component
├── lib/
│   ├── builder-components.ts              # Component registration
│   ├── cloudflare-image.ts                # Image optimization utilities
│   └── cloudflare-stream.ts               # Stream utilities
└── root.tsx                               # Registration initialization
```

### Utility Functions

**Image Optimization (`src/lib/cloudflare-image.ts`):**
- `buildImageUrl()` - Constructs Cloudflare Image Resizing URLs
- `generateSrcSet()` - Creates responsive srcset attribute
- `generateSizes()` - Creates sizes attribute for responsive images
- `getBestFormat()` - Detects browser support for WebP/AVIF
- `getBlurPlaceholderUrl()` - Creates tiny, blurred placeholder image
- `getThumbnailUrl()` - Gets optimized thumbnail

**Stream Utilities (`src/lib/cloudflare-stream.ts`):**
- `buildStreamIframeUrl()` - Constructs iframe embed URL
- `getStreamThumbnailUrl()` - Gets video thumbnail/poster
- `extractVideoIdFromUrl()` - Extracts video ID from various URL formats
- `isValidStreamVideoId()` - Validates video ID format (32-char hex)
- `buildStreamVideoUrl()` - Gets direct HLS/DASH manifest URLs
- `getStreamAnimatedPreviewUrl()` - Gets animated GIF preview

### Performance Optimizations

**CloudflareR2Image:**
- Uses Intersection Observer for lazy loading (loads 50px before entering viewport)
- Generates responsive srcset for 8 breakpoints (640w to 3840w)
- Automatically selects best format (AVIF > WebP > JPEG)
- Optional blur placeholder for perceived performance
- Async decoding for non-blocking rendering

**CloudflareStreamVideo:**
- Lazy loading option (loads player only when user clicks play)
- Poster thumbnail shown before video loads
- iframe uses native lazy loading attribute
- Aspect ratio CSS prevents layout shift
- Efficient video ID validation

### Browser Compatibility

Both components work in all modern browsers:
- ✅ Chrome/Edge (latest 2 versions)
- ✅ Firefox (latest 2 versions)
- ✅ Safari (latest 2 versions)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

Features gracefully degrade:
- WebP/AVIF → JPEG fallback
- Intersection Observer → Native lazy loading
- Modern aspect-ratio CSS → Padding-bottom fallback

---

## Examples

### Example 1: Hero Image with Blur Placeholder

```tsx
<CloudflareR2Image
  src="https://media.jpstas.com/hero-image.jpg"
  alt="Hero section background"
  width={1920}
  height={1080}
  optimize={true}
  quality={90}
  format="webp"
  blurPlaceholder={true}
  class="w-full h-screen object-cover"
/>
```

### Example 2: Portfolio Image Grid

```tsx
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
  {portfolioImages.map((img) => (
    <CloudflareR2Image
      key={img.src}
      src={img.src}
      alt={img.alt}
      width={600}
      height={400}
      optimize={true}
      lazy={true}
      fit="cover"
      class="rounded-lg"
    />
  ))}
</div>
```

### Example 3: Video Background (Autoplay Loop)

```tsx
<CloudflareStreamVideo
  videoId="af4889355cd0d36bac6722871cb2bcb3"
  title="Background video"
  aspectRatio="16:9"
  autoplay={true}
  loop={true}
  muted={true}
  controls={false}
  loading="eager"
  class="absolute inset-0 w-full h-full"
/>
```

### Example 4: Portrait Video (Mobile Story Format)

```tsx
<div class="max-w-md mx-auto">
  <CloudflareStreamVideo
    videoId="af4889355cd0d36bac6722871cb2bcb3"
    title="Mobile story"
    aspectRatio="9:16"
    controls={true}
    loading="lazy"
  />
</div>
```

---

## Troubleshooting

### Images Not Optimizing

**Problem:** Images load but aren't being optimized by Cloudflare

**Solutions:**
1. Ensure images are from `media.jpstas.com` domain
2. Check that `optimize={true}` is set
3. Verify Cloudflare Image Resizing is enabled on your account
4. Check browser DevTools Network tab for `/cdn-cgi/image/` URLs

### Videos Not Loading

**Problem:** Video shows error message

**Solutions:**
1. Verify video ID is exactly 32 hexadecimal characters
2. Check that video exists in your Cloudflare Stream account
3. Ensure video is not in "draft" or "processing" state
4. Try loading the video directly: `https://customer-h044ipu9nb6m47zm.cloudflarestream.com/{videoId}/iframe`

### Components Not Showing in Builder.io

**Problem:** Custom components don't appear in Builder.io editor

**Solutions:**
1. Verify `registerBuilderComponents()` is called in `src/root.tsx`
2. Check browser console for errors
3. Ensure components are registered before Builder.io loads
4. Clear Builder.io cache (refresh editor)
5. Check that `@builder.io/sdk-qwik` is installed

### TypeScript Errors

**Problem:** Type errors when using components

**Solutions:**
1. Ensure props match the defined interfaces
2. Import types: `import type { CloudflareR2ImageProps } from '~/components/builder/CloudflareR2Image'`
3. Check that required props (`src`, `alt`, `videoId`) are provided

---

## Next Steps

1. **Test in Builder.io**: Open your Builder.io visual editor and try adding the components
2. **Customize Styles**: Add custom CSS classes to match your design system
3. **Create Presets**: Save commonly-used configurations as presets in Builder.io
4. **Add More Components**: Consider creating additional custom components (e.g., image galleries, video playlists)

---

## Resources

- [Builder.io Custom Components Docs](https://www.builder.io/c/docs/custom-components-setup)
- [Cloudflare Image Resizing Docs](https://developers.cloudflare.com/images/image-resizing/)
- [Cloudflare Stream Docs](https://developers.cloudflare.com/stream/)
- [Qwik Framework Docs](https://qwik.builder.io/)

---

**Questions or Issues?**

If you encounter any problems or have questions about these components, please check:
1. This documentation
2. The demo page at `/builder-components-demo`
3. Component source code in `src/components/builder/`
