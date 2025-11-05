# Builder.io Quick Start Guide

Get started with Builder.io CMS in 5 minutes!

## ✅ What's Already Done

- ✅ Builder.io SDK installed
- ✅ API key configured (`.env` file)
- ✅ Utility functions created
- ✅ TypeScript types defined
- ✅ Example page created (`/builder-example`)
- ✅ Documentation written

## 🚀 Quick Start

### Step 1: View the Example (Optional)

Start the dev server and see the example page:

```bash
npm run dev
```

Visit: http://localhost:5173/builder-example

You'll see the site using fallback JSON data (since no Builder.io content exists yet).

### Step 2: Create Models in Builder.io

Option A: **Manual Creation** (Recommended for learning)

1. Go to https://builder.io/models
2. Create a new **Data Model** named `homepage`
3. Add fields:
   - `title` (Text)
   - `subtitle` (Text)
   - `description` (Long Text)
   - `heroImage` (Image URL)
   - `heroImageAlt` (Text)
   - `featuredProjects` (List)
   - `metrics` (List)

See `docs/BUILDER_IO_SETUP.md` for complete field definitions.

Option B: **Automated Creation** (Faster)

```bash
# Get your private API key from: https://builder.io/account/organization
export BUILDER_PRIVATE_KEY=your_private_key_here

# Run the script
node scripts/create-builder-models.js
```

This creates all models automatically:
- `portfolio-project` - Individual portfolio projects
- `homepage` - Homepage content
- `about-page` - About page content
- `site-settings` - Site-wide settings

### Step 3: Add Content

1. Go to https://builder.io/content
2. Select the `homepage` model
3. Click **+ New Entry**
4. Fill in the content (or copy from `src/data/site/homepage.json`)
5. Click **Publish**

### Step 4: Test It

Refresh http://localhost:5173/builder-example

You should now see:
- ✅ Green banner: "Content loaded from Builder.io CMS"
- Your content from Builder.io (not the JSON fallback)

## 🎨 Using Builder.io in Your Components

### Basic Example

```typescript
// src/routes/my-page/index.tsx
import { component$ } from '@builder.io/qwik';
import { createBuilderLoader } from '~/lib/use-builder-content';
import type { HomepageContent } from '~/types/builder';

// Create loader
export const useHomepage = createBuilderLoader<HomepageContent>('homepage');

export default component$(() => {
  // Fetch content
  const builderContent = useHomepage();

  // Use content with fallback
  const data = builderContent.value?.data || fallbackData;

  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.subtitle}</p>
    </div>
  );
});
```

### Portfolio Projects

```typescript
// Fetch all projects
export const useProjects = createBuilderListLoader('portfolio-project');

// Fetch single project by slug
export const useProject = createPortfolioLoader();
```

## 📝 Content Models Overview

| Model | Type | Purpose |
|-------|------|---------|
| `homepage` | Data (Single) | Homepage content |
| `about-page` | Data (Single) | About page content |
| `site-settings` | Data (Single) | Global site settings |
| `portfolio-project` | Data (Multiple) | Portfolio projects |
| `page` | Page | Visual editor pages |

## 🔧 Configuration Files

- `.env` - Builder.io API key
- `src/lib/builder.ts` - Configuration and utilities
- `src/lib/use-builder-content.ts` - Content loaders
- `src/types/builder.ts` - TypeScript types
- `scripts/create-builder-models.js` - Auto-create models

## 📖 Next Steps

1. **Migrate Existing Content**
   - Copy data from `src/data/*.json` into Builder.io
   - Update components to use Builder.io loaders
   - Keep JSON files as fallbacks

2. **Customize Models**
   - Add/remove fields as needed
   - Create new models for new content types
   - Use TypeScript types for type safety

3. **Visual Editing** (Advanced)
   - Register custom components
   - Enable drag-and-drop page building
   - See Builder.io docs for details

4. **Deploy**
   - Builder.io works automatically in production
   - Add `VITE_BUILDER_PUBLIC_KEY` to Cloudflare Pages env vars
   - No build changes needed

## 🆘 Troubleshooting

**Content not loading?**
- Check `.env` has correct API key
- Verify content is **Published** in Builder.io
- Check browser console for errors

**Type errors?**
- Update types in `src/types/builder.ts`
- Ensure field names match Builder.io model

**Build failing?**
- Run `npm run build.client` to check
- Check for import errors

## 📚 Documentation

- **Full Setup Guide**: `docs/BUILDER_IO_SETUP.md`
- **Example Page**: `/builder-example` route
- **Builder.io Docs**: https://www.builder.io/c/docs/developers

## 🎉 You're Ready!

You now have a working Builder.io CMS integration. Edit content visually at https://builder.io/content and see changes instantly!

---

**Questions?** See `docs/BUILDER_IO_SETUP.md` for detailed documentation.
