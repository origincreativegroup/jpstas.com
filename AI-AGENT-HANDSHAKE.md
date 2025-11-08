# 🤝 AI-AGENT-HANDSHAKE (Builder.io Integration)

_This document defines the Builder.io CMS integration and provides guidance for AI systems working on the jpstas.com portfolio site._

**Last Updated:** January 2025  
**Author:** Auto (AI Agent)  
**Purpose:** Canonical reference for Builder.io CMS integration — what was done, how it works, and how to work with it.

---

## ⚡ Quick Facts (30-Second Read)

### Builder.io Integration Status
- ✅ **SDK Installed** - `@builder.io/sdk-qwik` and `@builder.io/sdk` packages
- ✅ **Custom Components** - CloudflareR2Image and CloudflareStreamVideo registered
- ✅ **Content Models** - 4 models defined (portfolio-project, homepage, about-page, site-settings)
- ✅ **Utility Functions** - Type-safe content loaders in `src/lib/use-builder-content.ts`
- ✅ **Type Definitions** - Complete TypeScript types in `src/types/builder.ts`
- ✅ **Routes** - Catch-all route for Builder.io visual pages (`/[...slug]`)
- ✅ **Demo Pages** - `/builder-example` and `/builder-components-demo`

### Content Management Options
1. **Builder.io CMS** (NEW) - Visual editor, headless CMS, API-driven
2. **JSON Files** (Fallback) - Direct editing in `src/data/*.json`
3. **Decap CMS** (Legacy) - Visual CMS at `/admin` (may be deprecated)

### Key API Key
- **Public Key:** `6dd7a0cce2ea426ebd00be77c2af34e3` (configured in `.env`)
- **Dashboard:** https://builder.io/content
- **Models:** https://builder.io/models

---

## 🗂️ File Structure

### Core Integration Files
```
src/
├── lib/
│   ├── builder.ts                    # Builder.io config & API key
│   ├── use-builder-content.ts        # Content loader utilities
│   ├── builder-components.ts         # Custom component registration
│   ├── cloudflare-image.ts           # Image optimization utilities
│   └── cloudflare-stream.ts          # Video streaming utilities
├── types/
│   └── builder.ts                    # TypeScript types for all models
├── components/
│   └── builder/
│       ├── CloudflareR2Image.tsx     # Optimized image component
│       └── CloudflareStreamVideo.tsx # Video player component
└── routes/
    ├── builder-example/              # Example page using Builder.io
    ├── builder-components-demo/       # Component showcase
    ├── [...slug]/                    # Catch-all for Builder.io pages
    └── page/[slug]/                  # Alternative Builder.io route
```

### Scripts
```
scripts/
├── create-builder-models.js          # Creates models in Builder.io
├── import-all-content.js             # Imports all content to Builder.io
└── import-content-only.js            # Imports content only (no models)
```

### Documentation
```
docs/
├── BUILDER_IO_SETUP.md               # Complete setup guide
├── BUILDER_IO_QUICKSTART.md          # 5-minute quick start
├── BUILDER_IO_FIELD_MAPPING.md      # Field definitions for all models
├── BUILDER_IO_CUSTOM_COMPONENTS.md  # Custom components guide
└── IMPLEMENTATION_SUMMARY.md         # Technical implementation details

BUILDER_IO_MANUAL_SETUP.md            # Manual setup instructions
```

---

## 🔧 How Builder.io Works

### Content Models
1. **portfolio-project** - Individual portfolio case studies
2. **homepage** - Homepage content (singleton)
3. **about-page** - About page content (singleton)
4. **site-settings** - Site-wide settings (singleton)

### Content Loading Pattern
```typescript
// 1. Create a loader
export const useHomepage = createBuilderLoader<HomepageContent>('homepage');

// 2. Use in component
export default component$(() => {
  const builderContent = useHomepage();
  const data = builderContent.value?.data || fallbackData;
  
  return <div>{data.title}</div>;
});
```

### Fallback Strategy
- **Always** provide JSON fallback data
- Builder.io content is optional
- Site works without Builder.io (uses JSON files)
- Check `builderContent.value` to detect if Builder.io content exists

### Custom Components
- **CloudflareR2Image** - Optimized images with Cloudflare Image Resizing
- **CloudflareStreamVideo** - Video player for Cloudflare Stream
- Both registered in `src/lib/builder-components.ts`
- Available in Builder.io visual editor via drag-and-drop

---

## 🎯 Common Tasks for AI Agents

### Adding New Content
**Option 1: Via Builder.io (Recommended)**
1. Go to https://builder.io/content
2. Select model (e.g., `portfolio-project`)
3. Create new entry
4. Fill in fields
5. Publish

**Option 2: Via JSON (Fallback)**
1. Edit `src/data/*.json` files
2. Commit to Git
3. Deploy

### Fetching Content in Components
```typescript
// Single entry
import { createBuilderLoader } from '~/lib/use-builder-content';
import type { HomepageContent } from '~/types/builder';

export const useHomepage = createBuilderLoader<HomepageContent>('homepage');

// Multiple entries
import { createBuilderListLoader } from '~/lib/use-builder-content';

export const useProjects = createBuilderListLoader<PortfolioProject>('portfolio-project');

// By slug
import { createPortfolioLoader } from '~/lib/use-builder-content';

export const useProject = createPortfolioLoader();
```

### Creating New Models
1. Define TypeScript interface in `src/types/builder.ts`
2. Create model in Builder.io dashboard OR run `node scripts/create-builder-models.js`
3. Add loader utility if needed
4. Update components to use new model

### Using Custom Components
```typescript
// In Builder.io visual editor:
// 1. Drag "Cloudflare R2 Image" component
// 2. Set src, alt, width, height
// 3. Component automatically optimizes image

// In code:
import { CloudflareR2Image } from '~/components/builder/CloudflareR2Image';

<CloudflareR2Image
  src="https://media.jpstas.com/image.jpg"
  alt="Description"
  width={800}
  height={600}
  optimize={true}
/>
```

---

## 📋 Content Migration Status

### Currently Using JSON (Fallback)
- ✅ Homepage: `src/data/site/homepage.json`
- ✅ Portfolio projects: `src/data/*.json` (multiple files)
- ✅ About page: `src/data/site/about.json` (if exists)
- ✅ Site settings: `src/data/site/settings.json` (if exists)

### Migration to Builder.io
- ⚠️ **Not yet migrated** - All content still in JSON files
- 📝 **To migrate:** Run `node scripts/import-content-only.js` after creating models
- 🔄 **Workflow:** JSON files remain as fallback, Builder.io becomes primary

---

## 🔍 Key Integration Points

### 1. Environment Configuration
- **File:** `.env` or `wrangler.toml`
- **Key:** `VITE_BUILDER_PUBLIC_KEY`
- **Value:** `6dd7a0cce2ea426ebd00be77c2af34e3`

### 2. Component Registration
- **File:** `src/lib/builder-components.ts`
- **Export:** `CUSTOM_COMPONENTS` array
- **Usage:** Pass to `<RenderContent customComponents={CUSTOM_COMPONENTS} />`

### 3. Route Handling
- **Catch-all:** `src/routes/[...slug]/index.tsx` - Handles Builder.io visual pages
- **Alternative:** `src/routes/page/[slug]/index.tsx` - Same functionality
- **Pattern:** Fetches Builder.io content by URL path

### 4. Type Safety
- **File:** `src/types/builder.ts`
- **Coverage:** All 4 models have complete TypeScript interfaces
- **Usage:** Import types when using loaders

---

## ⚠️ Critical Warnings for AI Agents

### 1. **Always Provide Fallback Data**
```typescript
// ❌ BAD - Will break if Builder.io is unavailable
const data = useHomepage().value.data;

// ✅ GOOD - Has fallback
const builderContent = useHomepage();
const data = builderContent.value?.data || fallbackData;
```

### 2. **Don't Remove JSON Files**
- JSON files are the fallback
- Site must work without Builder.io
- Migration is additive, not replacement

### 3. **Check Builder.io Availability**
```typescript
// Detect if Builder.io content exists
const builderContent = useHomepage();
const isUsingBuilder = !!builderContent.value;
```

### 4. **Model Names Must Match Exactly**
- Model names are case-sensitive
- Must match between Builder.io dashboard and code
- Check `src/lib/use-builder-content.ts` for model names

### 5. **Custom Components Need Registration**
- Components must be in `CUSTOM_COMPONENTS` array
- Must be passed to `<RenderContent>`
- Check `src/lib/builder-components.ts` for registration

### 6. **API Key is Public**
- Public key is safe to expose (it's public)
- Never commit private API keys
- Public key is in `.env` and can be in client code

---

## 🚀 Quick Reference Commands

### Development
```bash
# Start dev server
npm run dev

# View Builder.io example
# Visit: http://localhost:5173/builder-example

# View component demo
# Visit: http://localhost:5173/builder-components-demo
```

### Content Import
```bash
# Create models in Builder.io (requires private API key)
export BUILDER_PRIVATE_KEY=your_private_key
node scripts/create-builder-models.js

# Import content to Builder.io
node scripts/import-content-only.js
```

### Build & Deploy
```bash
# Build for production
npm run build.client

# Preview build
npm run preview

# Deploy to Cloudflare Pages
npm run build.client
npx wrangler pages deploy dist --project-name=jpstas-com
```

---

## 📚 Documentation Map

### Getting Started
1. **Quick Start** → `docs/BUILDER_IO_QUICKSTART.md` (5 minutes)
2. **Setup Guide** → `docs/BUILDER_IO_SETUP.md` (complete setup)
3. **Manual Setup** → `BUILDER_IO_MANUAL_SETUP.md` (step-by-step)

### Technical Details
- **Field Mapping** → `docs/BUILDER_IO_FIELD_MAPPING.md` (all model fields)
- **Custom Components** → `docs/BUILDER_IO_CUSTOM_COMPONENTS.md` (component docs)
- **Implementation** → `docs/IMPLEMENTATION_SUMMARY.md` (technical details)

### Code Examples
- **Example Page** → `src/routes/builder-example/index.tsx`
- **Component Demo** → `src/routes/builder-components-demo/index.tsx`
- **Test Page** → `src/routes/test-custom-components/index.tsx`

---

## 🔄 Migration Checklist

When migrating a page/component to Builder.io:

- [ ] Create or verify model exists in Builder.io
- [ ] Define TypeScript interface in `src/types/builder.ts`
- [ ] Create loader using `createBuilderLoader` or `createBuilderListLoader`
- [ ] Add fallback JSON import
- [ ] Update component to use loader with fallback
- [ ] Test with Builder.io content
- [ ] Test without Builder.io (fallback mode)
- [ ] Import content to Builder.io
- [ ] Verify in Builder.io dashboard
- [ ] Update documentation if needed

---

## 🐛 Troubleshooting

### Issue: Builder.io content not loading
- ✅ Check API key in `.env`
- ✅ Verify model name matches exactly
- ✅ Check network tab for API errors
- ✅ Verify content is published in Builder.io

### Issue: Custom components not showing in Builder.io
- ✅ Check `CUSTOM_COMPONENTS` array is exported
- ✅ Verify components are passed to `<RenderContent>`
- ✅ Clear Builder.io cache (Settings → Clear Cache)
- ✅ Refresh Builder.io editor

### Issue: Type errors
- ✅ Import correct types from `~/types/builder`
- ✅ Match model interface with Builder.io model
- ✅ Check field names match exactly

### Issue: Images not optimizing
- ✅ Verify image URL is from `media.jpstas.com`
- ✅ Check `optimize` prop is `true`
- ✅ Verify Cloudflare Image Resizing is enabled
- ✅ Check image URL format

---

## 📊 Builder.io vs JSON Files

| Feature | Builder.io | JSON Files |
|---------|------------|------------|
| **Visual Editing** | ✅ Yes | ❌ No |
| **Non-technical Users** | ✅ Yes | ❌ No |
| **Version Control** | ✅ Built-in | ✅ Git |
| **API Access** | ✅ Yes | ❌ No |
| **Preview Mode** | ✅ Yes | ❌ No |
| **Fallback** | ❌ No | ✅ Yes |
| **Offline Editing** | ❌ No | ✅ Yes |
| **Git Integration** | ❌ No | ✅ Yes |

**Current Strategy:** Use Builder.io as primary, JSON as fallback

---

## 🎯 Decision Tree

**Q: Should I add content via Builder.io or JSON?**  
A: Use Builder.io if you want visual editing. Use JSON for quick edits or when Builder.io is unavailable.

**Q: How do I add a new portfolio project?**  
A: Create entry in Builder.io `portfolio-project` model, OR add JSON file to `src/data/`.

**Q: How do I create a new page?**  
A: Create page in Builder.io `page` model, OR create route in `src/routes/`.

**Q: How do I use images?**  
A: Use `CloudflareR2Image` component for optimization, or regular `<img>` tag.

**Q: How do I add videos?**  
A: Use `CloudflareStreamVideo` component with Cloudflare Stream video ID.

**Q: Where are the types defined?**  
A: `src/types/builder.ts` - all Builder.io model interfaces.

**Q: How do I fetch content?**  
A: Use loaders from `src/lib/use-builder-content.ts` - `createBuilderLoader`, `createBuilderListLoader`, or `createPortfolioLoader`.

---

## ✅ Pre-Flight Checklist

Before making Builder.io changes:
- [ ] Check Builder.io dashboard for existing content
- [ ] Verify model names match code
- [ ] Test fallback JSON data works
- [ ] Check API key is configured
- [ ] Verify custom components are registered
- [ ] Test in both Builder.io and fallback modes
- [ ] Update TypeScript types if model changes
- [ ] Update documentation if needed

---

## 🔗 Related Documentation

- **Main README** → `README.md` (project overview)
- **CMS Options** → `docs/cms/CMS_OPTIONS.md` (CMS comparison)
- **Media Management** → `docs/media/MEDIA_MANAGEMENT.md` (R2 & Stream)
- **Cloudflare Integration** → `docs/media/CLOUDFLARE_MEDIA_GUIDE.md`

---

**Status:** 🟢 **BUILDER.IO INTEGRATION COMPLETE**

_This handshake document governs Builder.io CMS integration and AI agent coordination for the jpstas.com portfolio site. For detailed information, refer to the specific documentation files listed above._

**Start Here:** `docs/BUILDER_IO_QUICKSTART.md` → 5-minute setup  
**Complete Guide:** `docs/BUILDER_IO_SETUP.md` → Full documentation  
**Field Reference:** `docs/BUILDER_IO_FIELD_MAPPING.md` → All model fields

