# Motion Systems Case Study - Required Media Assets

This document lists all media assets required to complete the Motion Systems case study page.

## Current Status

The `src/data/motion.json` file references the following media URLs. These assets need to be created and uploaded to R2.

---

## Hero Image

**Current URL:** `https://media.jpstas.com/portfolio/motion%20systems/Screenshot%202025-11-25%20at%203.30.18%E2%80%AFPM.png`

**Status:** ✅ Already referenced (may need verification)

**Recommended:** 
- **Path:** `portfolio/motion-systems/motion-hero.jpg`
- **Dimensions:** 2000 × 1500px (min 1000 × 750px)
- **Format:** JPG (optimized, 85-90% quality)
- **Aspect Ratio:** Flexible (displayed in responsive grid)

---

## Card Image (Thumbnail)

**Current URL:** `https://media.jpstas.com/motion-card.jpg`

**Status:** ⚠️ Needs verification/upload

**Recommended:**
- **Path:** `portfolio/motion-systems/motion-card.jpg` or `portfolio/images/heroes/cards-home/motion-card.jpg`
- **Dimensions:** 1600 × 1200px (min 800 × 600px)
- **Format:** JPG (optimized, 85-90% quality)
- **Aspect Ratio:** 4:3
- **Usage:** Portfolio listing page, bento grid

---

## Gallery Images (6 Required)

All gallery images should be uploaded to: `portfolio/motion-systems/`

### 1. Motion Library Hero Visual
- **Current URL:** `https://media.jpstas.com/motion-library-hero.jpg`
- **Recommended Path:** `portfolio/motion-systems/motion-library-hero.jpg`
- **Alt Text:** "Motion Systems Library hero visual"
- **Dimensions:** 2400 × 1600px (landscape) or 2400 × 2400px (square)
- **Min Dimensions:** 1200 × 800px (landscape) or 1200 × 1200px (square)
- **Format:** JPG (optimized, 85-90% quality)
- **Description:** Overview visual showing the motion systems library interface or collection

### 2. Caribbean Pools Drone Shots
- **Current URL:** `https://media.jpstas.com/caribbean-pools-drone-shots.jpg`
- **Recommended Path:** `portfolio/motion-systems/caribbean-pools-drone-shots.jpg`
- **Alt Text:** "Caribbean Pools drone cinematography"
- **Dimensions:** 2400 × 1600px (landscape)
- **Min Dimensions:** 1200 × 800px
- **Format:** JPG (optimized, 85-90% quality)
- **Description:** Showcase of drone footage and aerial cinematography work for Caribbean Pools

### 3. Workflow Explainers
- **Current URL:** `https://media.jpstas.com/workflow-explainers.jpg`
- **Recommended Path:** `portfolio/motion-systems/workflow-explainers.jpg`
- **Alt Text:** "Workflow explainer motion graphics"
- **Dimensions:** 2400 × 1600px (landscape)
- **Min Dimensions:** 1200 × 800px
- **Format:** JPG (optimized, 85-90% quality)
- **Description:** Examples of workflow and process explanation videos/motion graphics

### 4. Product System Motion
- **Current URL:** `https://media.jpstas.com/product-system-motion.jpg`
- **Recommended Path:** `portfolio/motion-systems/product-system-motion.jpg`
- **Alt Text:** "Product and system motion graphics"
- **Dimensions:** 2400 × 1600px (landscape)
- **Min Dimensions:** 1200 × 800px
- **Format:** JPG (optimized, 85-90% quality)
- **Description:** Motion graphics for product explanations and system demonstrations

### 5. Kids' IP Motion Tests
- **Current URL:** `https://media.jpstas.com/kids-ip-motion-tests.jpg`
- **Recommended Path:** `portfolio/motion-systems/kids-ip-motion-tests.jpg`
- **Alt Text:** "Kids' IP motion test animations"
- **Dimensions:** 2400 × 1600px (landscape)
- **Min Dimensions:** 1200 × 800px
- **Format:** JPG (optimized, 85-90% quality)
- **Description:** Character animation tests and motion prototypes for children's IP

### 6. AI-Assisted Frames
- **Current URL:** `https://media.jpstas.com/ai-assisted-frames.jpg`
- **Recommended Path:** `portfolio/motion-systems/ai-assisted-frames.jpg`
- **Alt Text:** "AI-assisted animation frames"
- **Dimensions:** 2400 × 1600px (landscape)
- **Min Dimensions:** 1200 × 800px
- **Format:** JPG (optimized, 85-90% quality)
- **Description:** Examples of AI-generated backgrounds, frames, and hybrid AI/traditional production work

---

## Upload Instructions

### Step 1: Prepare Assets
1. Create or gather all 6 gallery images
2. Optimize images (JPG at 85-90% quality)
3. Ensure proper dimensions (see above)

### Step 2: Upload to R2
Use the upload script for each file:

```bash
# Gallery images
npm run r2:upload ./local-path/motion-library-hero.jpg portfolio/motion-systems/motion-library-hero.jpg
npm run r2:upload ./local-path/caribbean-pools-drone-shots.jpg portfolio/motion-systems/caribbean-pools-drone-shots.jpg
npm run r2:upload ./local-path/workflow-explainers.jpg portfolio/motion-systems/workflow-explainers.jpg
npm run r2:upload ./local-path/product-system-motion.jpg portfolio/motion-systems/product-system-motion.jpg
npm run r2:upload ./local-path/kids-ip-motion-tests.jpg portfolio/motion-systems/kids-ip-motion-tests.jpg
npm run r2:upload ./local-path/ai-assisted-frames.jpg portfolio/motion-systems/ai-assisted-frames.jpg

# Card image (if needed)
npm run r2:upload ./local-path/motion-card.jpg portfolio/motion-systems/motion-card.jpg
```

### Step 3: Update JSON File
After uploading, update `src/data/motion.json` with the new URLs:

```json
{
  "solution": {
    "gallery": [
      {
        "src": "https://media.jpstas.com/portfolio/motion-systems/motion-library-hero.jpg",
        "alt": "Motion Systems Library hero visual"
      },
      {
        "src": "https://media.jpstas.com/portfolio/motion-systems/caribbean-pools-drone-shots.jpg",
        "alt": "Caribbean Pools drone cinematography"
      },
      {
        "src": "https://media.jpstas.com/portfolio/motion-systems/workflow-explainers.jpg",
        "alt": "Workflow explainer motion graphics"
      },
      {
        "src": "https://media.jpstas.com/portfolio/motion-systems/product-system-motion.jpg",
        "alt": "Product and system motion graphics"
      },
      {
        "src": "https://media.jpstas.com/portfolio/motion-systems/kids-ip-motion-tests.jpg",
        "alt": "Kids' IP motion test animations"
      },
      {
        "src": "https://media.jpstas.com/portfolio/motion-systems/ai-assisted-frames.jpg",
        "alt": "AI-assisted animation frames"
      }
    ]
  }
}
```

---

## Checklist

- [ ] Motion library hero visual created
- [ ] Caribbean Pools drone shots image created
- [ ] Workflow explainers image created
- [ ] Product system motion image created
- [ ] Kids' IP motion tests image created
- [ ] AI-assisted frames image created
- [ ] All images optimized (JPG, 85-90% quality)
- [ ] All images uploaded to R2
- [ ] `motion.json` updated with new URLs
- [ ] Tested locally (`npm run dev`)
- [ ] Verified images load correctly on case study page

---

## Notes

- All images should follow the naming convention: `{descriptor}.jpg`
- Use descriptive filenames that match the alt text
- Consider creating WebP versions for modern browsers (with JPG fallback)
- Ensure all images have proper alt text for accessibility
- Test image loading performance after upload

---

## Related Documentation

- [How to Add Media](./HOWTO_ADD_MEDIA.md)
- [Media Assets Required](../MEDIA_ASSETS_REQUIRED.md)
- [R2 Upload Guide](./R2_UPLOAD_GUIDE.md)







