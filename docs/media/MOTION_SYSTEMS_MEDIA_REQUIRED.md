# Motion Systems Case Study - Required Media Assets

This document lists all media assets required to complete the Motion Systems case study page.

## Current Status

The `src/data/motion.json` file currently references:
- ✅ Hero image: `portfolio/motion%20systems/dino_force_hero.png` (URL-encoded space)
- ✅ Card image: `portfolio/motion-systems/motion-card.jpg`
- ✅ Gallery: 1 image + 10 Cloudflare Stream videos

**Note:** The hero image URL uses URL encoding (`%20` for space). Consider updating to use hyphens for consistency.

---

## Hero Image

**Current URL:** `https://media.jpstas.com/portfolio/motion%20systems/dino_force_hero.png`

**Status:** ✅ Already uploaded (using URL-encoded path)

**Recommended Update:** 
- **Current Path:** `portfolio/motion%20systems/dino_force_hero.png` (URL-encoded)
- **Recommended Path:** `portfolio/motion-systems/motion-hero.jpg` (for consistency)
- **Dimensions:** 2000 × 1500px (min 1000 × 750px)
- **Format:** JPG (optimized, 85-90% quality) or PNG if transparency needed
- **Aspect Ratio:** Flexible (displayed in responsive grid)

---

## Card Image (Thumbnail)

**Current URL:** `https://media.jpstas.com/portfolio/motion-systems/motion-card.jpg`

**Status:** ✅ Already referenced in JSON

**Current:**
- **Path:** `portfolio/motion-systems/motion-card.jpg`
- **Dimensions:** 1600 × 1200px (min 800 × 600px)
- **Format:** JPG (optimized, 85-90% quality)
- **Aspect Ratio:** 4:3
- **Usage:** Portfolio listing page, bento grid

---

## Gallery Media

**Current Status:** The gallery currently contains:
- ✅ 1 image: `dino_force_hero.png` (reused from hero)
- ✅ 10 Cloudflare Stream videos (social media reels, 9:16 aspect ratio)

**Note:** The case study is currently video-focused, showcasing motion work through Cloudflare Stream embeds. Additional static gallery images are optional but recommended for better SEO and accessibility.

### Current Gallery Image

**1. Dino Force Hero Visual**
- **Current URL:** `https://media.jpstas.com/portfolio/motion%20systems/dino_force_hero.png`
- **Status:** ✅ Already in gallery
- **Alt Text:** "Dino Force hero visual"
- **Note:** Same image as hero (consider using different image for gallery)

### Optional Additional Gallery Images

If you want to add more static images to complement the videos, consider these:

**2. Motion Library Hero Visual** (Optional)
- **Recommended Path:** `portfolio/motion-systems/motion-library-hero.jpg`
- **Alt Text:** "Motion Systems Library hero visual"
- **Dimensions:** 2400 × 1600px (landscape) or 2400 × 2400px (square)
- **Min Dimensions:** 1200 × 800px (landscape) or 1200 × 1200px (square)
- **Format:** JPG (optimized, 85-90% quality)
- **Description:** Overview visual showing the motion systems library interface or collection

**3. Caribbean Pools Drone Shots** (Optional)
- **Recommended Path:** `portfolio/motion-systems/caribbean-pools-drone-shots.jpg`
- **Alt Text:** "Caribbean Pools drone cinematography"
- **Dimensions:** 2400 × 1600px (landscape)
- **Min Dimensions:** 1200 × 800px
- **Format:** JPG (optimized, 85-90% quality)
- **Description:** Showcase of drone footage and aerial cinematography work for Caribbean Pools

**4. Workflow Explainers** (Optional)
- **Recommended Path:** `portfolio/motion-systems/workflow-explainers.jpg`
- **Alt Text:** "Workflow explainer motion graphics"
- **Dimensions:** 2400 × 1600px (landscape)
- **Min Dimensions:** 1200 × 800px
- **Format:** JPG (optimized, 85-90% quality)
- **Description:** Examples of workflow and process explanation videos/motion graphics

**5. Product System Motion** (Optional)
- **Recommended Path:** `portfolio/motion-systems/product-system-motion.jpg`
- **Alt Text:** "Product and system motion graphics"
- **Dimensions:** 2400 × 1600px (landscape)
- **Min Dimensions:** 1200 × 800px
- **Format:** JPG (optimized, 85-90% quality)
- **Description:** Motion graphics for product explanations and system demonstrations

**6. Kids' IP Motion Tests** (Optional)
- **Recommended Path:** `portfolio/motion-systems/kids-ip-motion-tests.jpg`
- **Alt Text:** "Kids' IP motion test animations"
- **Dimensions:** 2400 × 1600px (landscape)
- **Min Dimensions:** 1200 × 800px
- **Format:** JPG (optimized, 85-90% quality)
- **Description:** Character animation tests and motion prototypes for children's IP

**7. AI-Assisted Frames** (Optional)
- **Recommended Path:** `portfolio/motion-systems/ai-assisted-frames.jpg`
- **Alt Text:** "AI-assisted animation frames"
- **Dimensions:** 2400 × 1600px (landscape)
- **Min Dimensions:** 1200 × 800px
- **Format:** JPG (optimized, 85-90% quality)
- **Description:** Examples of AI-generated backgrounds, frames, and hybrid AI/traditional production work

---

## Upload Instructions

### Step 1: Fix Hero Image URL (Optional but Recommended)

The hero image currently uses URL encoding (`motion%20systems`). To fix this:

1. Upload the hero image to the correct path:
```bash
npm run r2:upload ./local-path/dino_force_hero.png portfolio/motion-systems/motion-hero.png
```

2. Update `src/data/motion.json`:
```json
{
  "hero": {
    "src": "https://media.jpstas.com/portfolio/motion-systems/motion-hero.png",
    "alt": "Motion Systems Library hero"
  }
}
```

### Step 2: Add Optional Gallery Images

If you want to add static images to complement the videos:

1. Prepare assets (optimize JPG at 85-90% quality)
2. Upload to R2:

```bash
# Optional gallery images (if creating)
npm run r2:upload ./local-path/motion-library-hero.jpg portfolio/motion-systems/motion-library-hero.jpg
npm run r2:upload ./local-path/caribbean-pools-drone-shots.jpg portfolio/motion-systems/caribbean-pools-drone-shots.jpg
npm run r2:upload ./local-path/workflow-explainers.jpg portfolio/motion-systems/workflow-explainers.jpg
npm run r2:upload ./local-path/product-system-motion.jpg portfolio/motion-systems/product-system-motion.jpg
npm run r2:upload ./local-path/kids-ip-motion-tests.jpg portfolio/motion-systems/kids-ip-motion-tests.jpg
npm run r2:upload ./local-path/ai-assisted-frames.jpg portfolio/motion-systems/ai-assisted-frames.jpg
```

3. Add to `src/data/motion.json` gallery array (insert before or after videos as desired):

```json
{
  "solution": {
    "gallery": [
      {
        "src": "https://media.jpstas.com/portfolio/motion-systems/motion-library-hero.jpg",
        "alt": "Motion Systems Library hero visual"
      },
      // ... existing videos ...
    ]
  }
}
```

---

## Checklist

### Required (Already Complete)
- [x] Hero image uploaded (`dino_force_hero.png`)
- [x] Card image uploaded (`motion-card.jpg`)
- [x] Gallery image added (`dino_force_hero.png`)
- [x] 10 Cloudflare Stream videos added to gallery

### Optional Improvements
- [ ] Fix hero image URL (remove URL encoding, use hyphens)
- [ ] Add additional gallery images (optional, for SEO/accessibility)
- [ ] Optimize existing images (if needed)
- [ ] Test locally (`npm run dev`)
- [ ] Verify all media loads correctly on case study page

---

## Notes

- **Current Implementation:** The case study is video-focused with Cloudflare Stream embeds (10 videos). This is a valid approach for showcasing motion work.
- **URL Consistency:** The hero image uses URL encoding (`motion%20systems`). Consider updating to use hyphens (`motion-systems`) for consistency with other case studies.
- **Gallery Strategy:** Static images are optional but recommended for:
  - Better SEO (search engines can index image alt text)
  - Accessibility (users with slow connections or disabled autoplay)
  - Social media sharing (better preview images)
- **File Naming:** Use descriptive filenames that match the alt text: `{descriptor}.jpg`
- **Optimization:** Consider creating WebP versions for modern browsers (with JPG fallback)
- **Accessibility:** Ensure all images have proper alt text matching the JSON file
- **Performance:** Test image loading performance after upload

---

## Related Documentation

- [How to Add Media](./HOWTO_ADD_MEDIA.md)
- [Media Assets Required](../MEDIA_ASSETS_REQUIRED.md)
- [R2 Upload Guide](./R2_UPLOAD_GUIDE.md)








