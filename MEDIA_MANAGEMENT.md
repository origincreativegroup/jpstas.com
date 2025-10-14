# Media Management Guide

Quick reference for managing images and videos on your portfolio site using Cloudflare R2.

## Current Status ✅

- **Total Images**: 50
- **Total Videos**: 1 (Cloudflare Stream)
- **Domain**: `https://media.jpstas.com`
- **Storage**: Cloudflare R2 bucket (`jpstas-media`)
- **CDN**: Automatic via Cloudflare

## Quick Commands

### Upload a New Image/Video
```bash
# Upload with auto path (goes to /portfolio/)
npm run r2:upload ./my-image.jpg

# Upload to specific location
npm run r2:upload ./image.jpg portfolio/print-studio/new-image.jpg

# Examples
npm run r2:upload ./hero.jpg portfolio/drone-media/hero-new.jpg
npm run r2:upload ./screenshot.png portfolio/mindforge/dashboard-v2.png
```

### Audit All Media URLs
```bash
npm run r2:audit
```
Shows all images/videos across your portfolio and identifies any organizational issues.

### Update URLs to Custom Domain
```bash
npm run r2:update-urls
```
Replaces any old R2 URLs with your custom `media.jpstas.com` domain.

## File Organization

### Current Structure (Mixed)
```
media.jpstas.com/
├─ brand-evolution-hero.jpg (root level)
├─ drone-hero.jpg (root level)
├─ formstack-hero.jpg (root level)
└─ portfolio/
   └─ PrintStudio/ (organized folder)
      ├─ IMG_0620.jpeg
      └─ palm-tree-standee-closeup-display-detail.png
```

### Recommended Structure
```
media.jpstas.com/portfolio/
├─ brand-evolution/
│  ├─ hero.jpg
│  ├─ logo-evolution.jpg
│  └─ fleet-wraps.jpg
├─ drone-media/
│  ├─ hero.jpg
│  ├─ aerial-shot-1.jpg
│  └─ fpv-demo.jpg
├─ print-studio/
│  ├─ hero.jpg
│  ├─ palm-tree-standee.png
│  └─ production-line.jpg
└─ mindforge/
   ├─ hero.jpg
   └─ dashboard-screenshot.png
```

## Adding Media to Your Site

### 1. Upload to R2
```bash
npm run r2:upload ./path/to/image.jpg portfolio/project-name/image.jpg
```
The URL will be automatically copied to your clipboard!

### 2. Add to Case Study JSON
Open the appropriate JSON file in `src/data/` and add the image:

```json
{
  "hero": {
    "src": "https://media.jpstas.com/portfolio/project-name/hero.jpg",
    "alt": "Descriptive alt text"
  },
  "solution": {
    "gallery": [
      {
        "src": "https://media.jpstas.com/portfolio/project-name/image-1.jpg",
        "alt": "Screenshot of feature",
        "caption": "Optional caption text"
      },
      {
        "src": "https://media.jpstas.com/portfolio/project-name/image-2.jpg",
        "alt": "Another view"
      }
    ]
  }
}
```

### 3. Test Locally
```bash
npm run dev
```
Visit `http://localhost:5173/portfolio/project-name` to verify the image loads.

### 4. Build and Deploy
```bash
npm run build
# Then deploy via Cloudflare Pages (automatic on git push)
```

## Adding Videos

### Cloudflare Stream Videos
For video content, use Cloudflare Stream:

```json
{
  "solution": {
    "gallery": [
      {
        "src": "af4889355cd0d36bac6722871cb2bcb3",
        "type": "video",
        "caption": "FPV Drone Flythrough",
        "alt": "Drone video of pool installation"
      }
    ]
  }
}
```

The video ID is the 32-character hex string from Cloudflare Stream.

### Regular Video Files
For self-hosted videos:

```json
{
  "src": "https://media.jpstas.com/portfolio/project/demo.mp4",
  "type": "video",
  "poster": "https://media.jpstas.com/portfolio/project/thumbnail.jpg",
  "caption": "Product demo video"
}
```

## Image Best Practices

### File Naming
- Use lowercase with hyphens: `palm-tree-standee.png`
- Be descriptive: `dashboard-analytics-view.jpg` not `screenshot1.jpg`
- Include project context: `print-studio-production-line.jpg`

### File Formats
- **Photos/Graphics**: JPG (smaller file size, good for photos)
- **Logos/Icons**: PNG (transparency support)
- **Large images**: Consider WebP (better compression)

### File Sizes
- **Hero images**: < 500 KB (compressed JPG at 85% quality)
- **Gallery images**: < 300 KB
- **Videos**: Use Cloudflare Stream instead of direct upload

### Image Dimensions
- **Hero images**: 1920x1080 or 1600x900 (16:9 ratio)
- **Gallery images**: 1200x800 or similar
- **Thumbnails**: 600x400

## Troubleshooting

### Image Not Loading
1. Check the URL is correct (copy from R2 upload output)
2. Verify file exists in R2 bucket via Cloudflare Dashboard
3. Check browser console for 404 errors
4. Ensure R2 bucket has public access enabled

### Wrong URL Format
Run the audit to find issues:
```bash
npm run r2:audit
```

Then fix with:
```bash
npm run r2:update-urls
```

### Need to Replace an Image
1. Upload new image with same name (overwrites old one)
2. Or upload with new name and update JSON file
3. Clear Cloudflare cache if needed (usually not necessary)

## R2 Bucket Access

### Via Cloudflare Dashboard
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **R2 Object Storage**
3. Select bucket: **jpstas-media**
4. Browse files, create folders, upload directly

### Via Wrangler CLI
```bash
# Login
npx wrangler login

# List files
npx wrangler r2 object list jpstas-media

# Upload file
npx wrangler r2 object put jpstas-media/path/to/file.jpg --file=./local-file.jpg

# Download file
npx wrangler r2 object get jpstas-media/path/to/file.jpg --file=./downloaded.jpg

# Delete file
npx wrangler r2 object delete jpstas-media/path/to/file.jpg
```

## Cost

### R2 Pricing (Very Low)
- **Storage**: $0.015/GB/month
- **Reads**: FREE via Cloudflare CDN
- **Writes**: $4.50/million operations

### Your Current Usage (~50 images)
- Estimated storage: ~100 MB
- Monthly cost: **~$0.002** (basically free!)
- CDN bandwidth: **FREE** (unlimited)

## Migration Plan (Optional)

If you want to organize existing images into folders:

### 1. Create folder structure in R2
Via Cloudflare Dashboard, create folders for each project.

### 2. Move images
Either:
- Use Cloudflare Dashboard to move files
- Re-upload with new paths using `npm run r2:upload`
- Use wrangler CLI to copy and delete

### 3. Update JSON files
Update all `src` URLs in your data files with new paths.

### 4. Test
```bash
npm run dev
# Check all portfolio pages load correctly
```

### 5. Deploy
```bash
git add .
git commit -m "refactor: organize media files into project folders"
git push
```

## Quick Reference

| Task | Command |
|------|---------|
| Upload image | `npm run r2:upload ./image.jpg` |
| Upload to specific path | `npm run r2:upload ./img.jpg portfolio/project/img.jpg` |
| Check all media | `npm run r2:audit` |
| Fix domain URLs | `npm run r2:update-urls` |
| Browse R2 files | Visit Cloudflare Dashboard → R2 |
| Test locally | `npm run dev` |
| Build site | `npm run build` |

## Examples

### Adding a hero image to new project
```bash
# 1. Upload
npm run r2:upload ./hero-screenshot.jpg portfolio/new-project/hero.jpg

# 2. Add to src/data/new-project.json
{
  "hero": {
    "src": "https://media.jpstas.com/portfolio/new-project/hero.jpg",
    "alt": "Project screenshot"
  }
}

# 3. Test
npm run dev
```

### Adding multiple gallery images
```bash
# Upload all images
npm run r2:upload ./img1.jpg portfolio/project/gallery-1.jpg
npm run r2:upload ./img2.jpg portfolio/project/gallery-2.jpg
npm run r2:upload ./img3.jpg portfolio/project/gallery-3.jpg

# Update JSON
{
  "solution": {
    "gallery": [
      {
        "src": "https://media.jpstas.com/portfolio/project/gallery-1.jpg",
        "alt": "First view"
      },
      {
        "src": "https://media.jpstas.com/portfolio/project/gallery-2.jpg",
        "alt": "Second view"
      }
    ]
  }
}
```

---

**Need help?** Check the [R2 Upload Guide](./R2_UPLOAD_GUIDE.md) for more detailed information.

