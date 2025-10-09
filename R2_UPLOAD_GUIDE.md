# R2 Upload Guide - Moving Images from Repo to Cloud

## Why Move Images to R2?

Your gallery images (40MB) should be in R2 cloud storage instead of Git:

### Benefits
- **Lighter repo**: 40MB → 0MB for images
- **Faster clones**: No large binary files
- **CDN delivery**: Global edge caching
- **No Git LFS needed**: Simpler workflow
- **Easy updates**: Upload new images without commits
- **Consistent**: All media in one place

### Current Situation
```
Local: 40MB in public/images/project gallery/
R2: Your hero images already there
Problem: Mixed storage locations
```

---

## Method 1: Cloudflare Dashboard (Easiest)

### Step 1: Access R2 Bucket

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/fa917615d33ac203929027798644acef)
2. Click **R2 Object Storage** in sidebar
3. Click on bucket: **jpstas-media**

### Step 2: Create Folder Structure

1. Click **Create folder**
2. Name it: `gallery` (or `projects`, `portfolio`, etc.)
3. Click inside the folder

### Step 3: Upload Images

1. Click **Upload**
2. Select multiple files from `public/images/project gallery/`
3. Upload (can do 100+ files at once)
4. Wait for upload to complete

### Step 4: Get URLs

After upload, each image URL will be:
```
https://fa917615d33ac203929027798644acef.r2.cloudflarestorage.com/jpstas-media/gallery/filename.png
```

### Step 5: Update Your Code

Replace local paths with R2 URLs in your case study JSON files:

**Before:**
```json
"src": "/images/project gallery/Web 1920 – 1.png"
```

**After:**
```json
"src": "https://fa917615d33ac203929027798644acef.r2.cloudflarestorage.com/jpstas-media/gallery/Web-1920-1.png"
```

### Step 6: Clean Up Local Files

```bash
cd /Users/origin/GitHub/jpstas.com
rm -rf public/images/project\ gallery/
git add -A
git commit -m "refactor: move gallery images to R2 cloud storage"
git push
```

---

## Method 2: Wrangler CLI (Faster for Bulk)

### Step 1: Install Wrangler

```bash
# Already installed - verify version
npx wrangler --version
```

### Step 2: Authenticate

```bash
# Login to Cloudflare
npx wrangler login
```

### Step 3: Upload Files

**Upload single file:**
```bash
npx wrangler r2 object put jpstas-media/gallery/image.png \
  --file="public/images/project gallery/image.png"
```

**Upload all images (batch script):**
```bash
# Create upload script
cat > upload-to-r2.sh << 'EOF'
#!/bin/bash
for file in public/images/project\ gallery/*; do
  filename=$(basename "$file")
  # Clean filename (remove spaces, special chars)
  clean_name=$(echo "$filename" | sed 's/ /-/g' | sed 's/–/-/g')
  echo "Uploading: $filename -> $clean_name"
  npx wrangler r2 object put "jpstas-media/gallery/$clean_name" \
    --file="$file"
done
echo "Upload complete!"
EOF

chmod +x upload-to-r2.sh
./upload-to-r2.sh
```

### Step 4: Verify Upload

```bash
# List files in R2 bucket
npx wrangler r2 object list jpstas-media --prefix=gallery/
```

### Step 5: Update Case Studies

Update your JSON files with new R2 URLs:

```json
{
  "gallery": [
    {
      "src": "https://fa917615d33ac203929027798644acef.r2.cloudflarestorage.com/jpstas-media/gallery/Web-1920-1.png",
      "alt": "Website mockup"
    },
    {
      "src": "https://fa917615d33ac203929027798644acef.r2.cloudflarestorage.com/jpstas-media/gallery/Web-1920-2.png",
      "alt": "Another view"
    }
  ]
}
```

### Step 6: Clean Up and Commit

```bash
# Remove local images
rm -rf public/images/project\ gallery/
rm -f upload-to-r2.sh

# Commit cleanup
git add -A
git commit -m "refactor: migrate gallery images to R2 storage

- Uploaded 30+ images to R2 bucket
- Updated case study JSON with R2 URLs
- Removed 40MB from repository
- Leverages Cloudflare CDN for global delivery"
git push
```

---

## Method 3: R2 API (Programmatic)

For automation or CI/CD:

```javascript
// upload-images.js
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const client = new S3Client({
  region: 'auto',
  endpoint: 'https://fa917615d33ac203929027798644acef.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: 'YOUR_R2_ACCESS_KEY',
    secretAccessKey: 'YOUR_R2_SECRET_KEY',
  },
});

const uploadDir = 'public/images/project gallery';
const files = readdirSync(uploadDir);

for (const file of files) {
  const content = readFileSync(join(uploadDir, file));
  const cleanName = file.replace(/ /g, '-').replace(/–/g, '-');
  
  await client.send(new PutObjectCommand({
    Bucket: 'jpstas-media',
    Key: `gallery/${cleanName}`,
    Body: content,
    ContentType: 'image/png',
  }));
  
  console.log(`✓ Uploaded: ${cleanName}`);
}
```

---

## Public Access Configuration

### Make R2 Bucket Public (If Needed)

1. Go to R2 bucket settings
2. Click **Settings** tab
3. Under **Public Access**, click **Allow Access**
4. Or create a custom domain for cleaner URLs

### Optional: Custom Domain

Instead of long R2 URLs, use:
```
https://cdn.jpstas.com/gallery/image.png
```

Setup:
1. R2 bucket → Settings → Custom Domains
2. Add: `cdn.jpstas.com`
3. Update DNS in Cloudflare
4. Use shorter URLs in your code

---

## Image Optimization Tips

### Before Upload

**Optimize images locally:**
```bash
# Install ImageMagick or use online tools
brew install imagemagick

# Compress PNG (lossless)
for file in public/images/project\ gallery/*.png; do
  magick "$file" -quality 85 -strip "optimized/$(basename "$file")"
done

# Convert to WebP (better compression)
for file in public/images/project\ gallery/*.png; do
  cwebp -q 85 "$file" -o "webp/$(basename "$file" .png).webp"
done
```

### After Upload (Cloudflare Images)

Use Cloudflare Images for automatic optimization:

**URL variants:**
```
# Original
https://your-account.r2.com/jpstas-media/gallery/image.png

# Via Cloudflare Images (resized, optimized)
https://imagedelivery.net/YOUR_HASH/gallery/image.png/public

# With transformations
https://imagedelivery.net/YOUR_HASH/gallery/image.png/w=800,h=600
```

---

## Migration Checklist

### Before Migration
- [ ] Verify R2 bucket exists: `jpstas-media`
- [ ] Have account credentials ready
- [ ] Backup local images (just in case)

### Upload Process
- [ ] Upload all images to R2 bucket
- [ ] Verify files in R2 dashboard
- [ ] Test one image URL in browser
- [ ] Document URL pattern

### Update Code
- [ ] Update `formstack.json` gallery URLs
- [ ] Update `caribbeanpools.json` gallery URLs
- [ ] Update `deckhand.json` gallery URLs
- [ ] Update any other image references
- [ ] Test locally with R2 URLs

### Clean Up
- [ ] Delete `public/images/project gallery/`
- [ ] Test that site still works
- [ ] Commit and push
- [ ] Verify deployed site loads R2 images

---

## Quick Reference

### Your R2 Details
```
Account ID: fa917615d33ac203929027798644acef
Bucket: jpstas-media
Base URL: https://fa917615d33ac203929027798644acef.r2.cloudflarestorage.com/jpstas-media/
```

### Image Naming Convention

**Recommended structure:**
```
jpstas-media/
  ├─ heroes/
  │  ├─ formstack-hero.jpg
  │  ├─ caribbean-hero.jpg
  │  └─ deckhand-hero.jpg
  ├─ gallery/
  │  ├─ formstack/
  │  │  ├─ formstack-1.jpg
  │  │  ├─ formstack-2.jpg
  │  │  └─ formstack-3.jpg
  │  ├─ caribbean/
  │  │  └─ ...
  │  └─ deckhand/
  │     └─ ...
  └─ misc/
     └─ ...
```

### URL Pattern Examples

```
Hero: /heroes/project-hero.jpg
Gallery: /gallery/project-name/image-1.jpg
Misc: /misc/logo.png
```

---

## Troubleshooting

### Images Don't Load

**Check:**
1. R2 bucket has public access enabled
2. URL is exactly correct (case-sensitive)
3. File actually uploaded (check R2 dashboard)
4. CORS configured if needed

### Upload Fails

**Try:**
```bash
# Check wrangler auth
npx wrangler whoami

# Re-login if needed
npx wrangler login

# Check bucket exists
npx wrangler r2 bucket list
```

### Slow Loading

**Solutions:**
- Enable Cloudflare Images for automatic optimization
- Use WebP format instead of PNG
- Implement lazy loading (already done in your code)
- Set appropriate Cache-Control headers

---

## Cost Estimate

### R2 Pricing
- **Storage**: $0.015/GB/month
- **Operations**: $4.50/million writes, $0.36/million reads
- **Egress**: FREE with Cloudflare

### Your 40MB Gallery
- **Monthly storage**: 0.04 GB × $0.015 = **$0.0006/month**
- **Upload once**: 30 files × $0.0000045 = **$0.00014**
- **Reads**: FREE (via Cloudflare)

**Total cost: < $0.01/month** (basically free!)

---

## Alternative: Keep in Repo

**If you prefer to keep images in repo:**

### Pros
- Simple workflow (git push)
- Version controlled
- No extra upload step

### Cons
- 40MB repo size
- Slower clones
- Not leveraging CDN
- Mixed storage approach

### When to Keep Local
- Images < 10MB total
- Frequently updated
- Need version history
- Simple setup preferred

**Verdict**: With 40MB and R2 already set up, **moving to R2 is worth it**.

---

## Recommended Action Plan

**For your portfolio, I recommend:**

1. **Upload all 30 images to R2** (15 minutes via dashboard)
2. **Organize in folders** (gallery/formstack/, gallery/caribbean/, etc.)
3. **Update 3 JSON files** with new URLs (5 minutes)
4. **Delete local gallery** (1 command)
5. **Commit and push** (saves 40MB)

**Time investment**: ~30 minutes
**Benefit**: Clean repo, CDN delivery, consistent architecture

---

## Need Help?

Run this to see what images you have:
```bash
ls -lh public/images/project\ gallery/
```

Each one should be uploaded to R2 and then can be safely deleted from the repo.

**Ready to proceed?** Let me know if you want me to:
1. Create the upload script for you
2. Update the JSON files with R2 URLs
3. Help with any specific step

The migration is straightforward and will make your deployment cleaner! 🚀

