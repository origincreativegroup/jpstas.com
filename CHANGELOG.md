# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2025-11-05

### Added - Builder.io Custom Components for Cloudflare Integration

#### 🎨 New Custom Components

- **CloudflareR2Image Component** (`src/components/builder/CloudflareR2Image.tsx`)
  - Optimized image component with Cloudflare Image Resizing API integration
  - Automatic responsive srcset generation (8 breakpoints: 640w to 3840w)
  - Lazy loading with Intersection Observer (50px viewport margin)
  - Optional blur placeholder for progressive loading
  - Automatic format detection (AVIF → WebP → JPEG fallback)
  - Customizable fit modes (scale-down, contain, cover, crop, pad)
  - Quality control (1-100)
  - SSR-compatible rendering
  - Props: src, alt, width, height, optimize, quality, format, fit, gravity, lazy, blurPlaceholder, class, title

- **CloudflareStreamVideo Component** (`src/components/builder/CloudflareStreamVideo.tsx`)
  - Video player component for Cloudflare Stream with iframe integration
  - Multiple aspect ratios supported (16:9, 4:3, 1:1, 9:16, 21:9)
  - Lazy loading with custom play button overlay
  - Automatic thumbnail poster generation from Cloudflare Stream
  - Customizable player controls (autoplay, loop, mute, controls)
  - Video ID validation and URL extraction
  - Custom primary color support for player UI
  - Props: videoId, title, aspectRatio, autoplay, loop, muted, controls, preload, primaryColor, letterboxColor, loading, poster, allowFullscreen

- **CloudflareR2ImageWithAspectRatio Component**
  - Wrapper component for R2 images with aspect ratio containers
  - Supports custom aspect ratios and object-fit modes

- **StreamVideoGrid Component**
  - Grid layout component for multiple Stream videos
  - Configurable columns (1-4)
  - Responsive breakpoints

- **StreamVideoWithOverlay Component**
  - Stream video with custom text overlay
  - Dismissible overlay functionality

#### 🛠️ Utility Libraries

- **Cloudflare Image Utilities** (`src/lib/cloudflare-image.ts`)
  - `buildImageUrl()` - Constructs Cloudflare Image Resizing URLs with optimization parameters
  - `generateSrcSet()` - Creates responsive srcset strings with multiple breakpoints
  - `generateSizes()` - Generates sizes attribute for responsive images
  - `getBestFormat()` - Browser format detection (AVIF, WebP, JPEG)
  - `getBlurPlaceholderUrl()` - Generates tiny, blurred placeholder images (40px, quality 10, blur 50)
  - `getThumbnailUrl()` - Creates optimized thumbnail URLs
  - `supportsWebP()` - Detects WebP browser support
  - `supportsAVIF()` - Detects AVIF browser support
  - `preloadImage()` - Preloads images for performance
  - `extractDimensionsFromUrl()` - Parses dimensions from URLs

- **Cloudflare Stream Utilities** (`src/lib/cloudflare-stream.ts`)
  - `buildStreamIframeUrl()` - Constructs Cloudflare Stream iframe URLs with query parameters
  - `buildStreamVideoUrl()` - Gets direct HLS/DASH manifest URLs
  - `getStreamThumbnailUrl()` - Fetches video thumbnails with customizable options
  - `getStreamPosterUrl()` - Gets video poster/preview images
  - `getStreamAnimatedPreviewUrl()` - Gets animated GIF previews
  - `extractVideoIdFromUrl()` - Extracts video IDs from various URL formats
  - `isValidStreamVideoId()` - Validates 32-character hex video IDs
  - `buildStreamMetadataUrl()` - Constructs API URLs for video metadata
  - `getAspectRatioPadding()` - Calculates padding for responsive video embeds
  - Constants: `ASPECT_RATIOS` mapping

#### 🔌 Builder.io Integration

- **Component Registration** (`src/lib/builder-components.ts`)
  - Exported `CUSTOM_COMPONENTS` array for Builder.io visual editor
  - Complete input schemas with field types and validation
  - Friendly names and descriptions for visual editor
  - Icon references for component palette
  - Advanced options grouping
  - File type restrictions for image/video inputs
  - Helper text for all configurable properties

- **Visual Page Route** (`src/routes/[...slug]/index.tsx`)
  - Catch-all route for Builder.io visual pages
  - Fetches content based on URL path
  - Renders Builder.io content with custom components
  - 404 handling for non-existent pages
  - Dynamic head/meta tags from Builder.io content

- **Test Route** (`src/routes/page/[slug]/index.tsx`)
  - Alternative page route for Builder.io content
  - Same functionality as catch-all route

#### 📄 Demo & Documentation

- **Demo Page** (`src/routes/builder-components-demo/index.tsx`)
  - Comprehensive showcase of both custom components
  - Multiple configuration examples:
    - Basic usage
    - Blur placeholder
    - Portrait/vertical video (9:16)
    - Autoplay video
  - Live code snippets for each example
  - Full props reference tables
  - Builder.io usage guide
  - Component properties documentation

- **Test Page** (`src/routes/test-custom-components/index.tsx`)
  - Simple test page for component verification
  - Direct component usage (not through Builder.io)
  - Setup instructions for Builder.io integration

- **Custom Components Guide** (`docs/BUILDER_IO_CUSTOM_COMPONENTS.md`)
  - Complete feature documentation
  - Usage examples with code snippets
  - Props reference tables for both components
  - Builder.io visual editor integration guide
  - Technical implementation details
  - Performance optimizations explained
  - Troubleshooting section
  - Browser compatibility matrix
  - File structure overview

- **Field Mapping Guide** (`docs/BUILDER_IO_FIELD_MAPPING.md`)
  - Complete field definitions for all Builder.io models
  - Site content models (Homepage, About, Settings, Dashboard)
  - Portfolio project schema documentation
  - Field types, requirements, and descriptions
  - Nested structure mapping with examples
  - Builder.io type mapping table
  - Implementation notes

- **Updated Builder.io Setup Guide** (`docs/BUILDER_IO_SETUP.md`)
  - Added custom components section
  - Links to custom components documentation
  - Updated with component registration patterns

#### 🔧 Component Updates

- **About Page** (`src/routes/about/index.tsx`)
  - Migrated profile image to use CloudflareR2Image component
  - Added automatic image optimization
  - Improved performance with lazy loading

#### ⚙️ Configuration Changes

- **Root Component** (`src/root.tsx`)
  - Removed unnecessary component registration (not needed for Qwik approach)
  - Cleaned up imports

#### 📊 Type Definitions

- **Enhanced ResponsiveImageOptions** (`src/lib/cloudflare-image.ts`)
  - Added support for all image formats (auto, webp, avif, jpeg, png)
  - Made src parameter explicit in interface

#### 🐛 Bug Fixes

- **CloudflareR2Image SSR Compatibility**
  - Fixed initial render for server-side rendering
  - Set `isInView` to true for SSR environment
  - Ensures images render on initial page load

- **Builder Example Page** (`src/routes/builder-example/index.tsx`)
  - Fixed TypeScript errors with proper type annotations
  - Updated content access pattern (removed incorrect `.data` property)
  - Added explicit types for map callbacks
  - Improved error handling for missing Builder.io metadata

- **Image Format Type Safety**
  - Extended format types in ResponsiveImageOptions
  - Made generateSrcSet accept Partial<ResponsiveImageOptions>

- **SVG Attribute Names**
  - Fixed React-style SVG attributes to use kebab-case (stroke-linecap, stroke-linejoin, stroke-width)

- **Component Props**
  - Fixed srcSet to srcset (correct HTML attribute)
  - Removed invalid style prop from CloudflareR2ImageWithAspectRatio

#### 📚 Implementation Details

**Performance Optimizations:**
- Intersection Observer with 50px root margin for preemptive loading
- Responsive srcset generation reduces bandwidth usage
- Automatic format selection (AVIF > WebP > JPEG)
- Lazy loading with native browser support fallback
- Async image decoding for non-blocking rendering

**Browser Compatibility:**
- Modern browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Graceful degradation for older browsers
- Progressive enhancement approach

**Security Considerations:**
- Video ID validation (32-character hexadecimal pattern)
- URL extraction with regex pattern matching
- No external script injection
- CSP-compatible implementation

### File Structure

```
src/
├── components/
│   └── builder/
│       ├── CloudflareR2Image.tsx          # R2 image component
│       └── CloudflareStreamVideo.tsx      # Stream video component
├── lib/
│   ├── cloudflare-image.ts                # Image optimization utilities
│   ├── cloudflare-stream.ts               # Stream utilities
│   └── builder-components.ts              # Component registration
├── routes/
│   ├── [...slug]/
│   │   └── index.tsx                      # Catch-all Builder.io pages
│   ├── page/[slug]/
│   │   └── index.tsx                      # Alternative Builder.io route
│   ├── builder-components-demo/
│   │   └── index.tsx                      # Demo page
│   ├── test-custom-components/
│   │   └── index.tsx                      # Test page
│   └── about/
│       └── index.tsx                      # Updated with CloudflareR2Image
└── root.tsx                               # Cleaned up imports

docs/
├── BUILDER_IO_CUSTOM_COMPONENTS.md        # Custom components guide
├── BUILDER_IO_FIELD_MAPPING.md            # Field mapping for all models
└── BUILDER_IO_SETUP.md                    # Updated setup guide

scripts/
└── setup-about-model.js                   # Model setup script (API approach)
```

### Dependencies

No new dependencies added. Uses existing packages:
- `@builder.io/sdk-qwik` (already installed)
- `@builder.io/qwik` (already installed)

### Breaking Changes

None. All changes are additive.

### Migration Guide

**To use custom components in existing pages:**

1. Import the component:
   ```typescript
   import { CloudflareR2Image } from '~/components/builder/CloudflareR2Image';
   ```

2. Replace regular `<img>` tags:
   ```typescript
   // Before
   <img src={url} alt={alt} width={800} height={600} />

   // After
   <CloudflareR2Image
     src={url}
     alt={alt}
     width={800}
     height={600}
     optimize={true}
     lazy={true}
   />
   ```

**To use in Builder.io visual editor:**

1. Create a Page model in Builder.io
2. Create a page entry
3. Open visual editor
4. Find "Cloudflare R2 Image" or "Cloudflare Stream Video" in Insert panel
5. Drag onto page and configure

### Testing

- ✅ Build successful (npm run build)
- ✅ TypeScript compilation passed
- ✅ SSR rendering verified
- ✅ Client hydration working
- ✅ Image optimization confirmed
- ✅ Video playback tested
- ✅ Lazy loading functional
- ✅ Demo pages accessible

### Known Issues

None at this time.

### Future Enhancements

- [ ] Add image gallery component
- [ ] Add video playlist component
- [ ] Add Builder.io visual page templates
- [ ] Add more aspect ratio presets
- [ ] Add image comparison slider component
- [ ] Add video chapter markers support

---

## Previous Versions

See git history for previous changes.
