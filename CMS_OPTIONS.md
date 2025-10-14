# CMS Options for Portfolio Media Management

Comparing headless CMS solutions for managing your portfolio content and media.

## Current Setup (Manual)

**What you have now:**
- ✅ JSON files in Git (`src/data/*.json`)
- ✅ Images in Cloudflare R2
- ✅ Manual editing in VS Code
- ✅ Full control and simplicity
- ❌ No visual editor
- ❌ Manual R2 uploads
- ❌ Need to rebuild/redeploy for changes

---

## CMS Options

### 🎯 Best for Your Stack: Decap CMS (Git-Based)

**Perfect fit because:**
- Works with your existing JSON files
- No database needed
- Free and open source
- Git as the backend (keeps your workflow)
- Visual editor for non-developers
- Media uploads to R2 via git-LFS or direct upload
- Deploys with your site

**Setup Time:** 1-2 hours  
**Monthly Cost:** $0  
**Best For:** Your current git-based workflow

#### How it works:
```
You edit in Decap CMS → Changes commit to Git → Cloudflare builds → Site updates
```

#### Quick Setup:
```yaml
# public/admin/config.yml
backend:
  name: git-gateway
  branch: main

media_folder: "public/images/portfolio"
public_folder: "/images/portfolio"

collections:
  - name: "portfolio"
    label: "Portfolio Projects"
    folder: "src/data"
    create: true
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Hero Image", name: "hero", widget: "image"}
      - label: "Gallery"
        name: "gallery"
        widget: "list"
        fields:
          - {label: "Image", name: "src", widget: "image"}
          - {label: "Alt Text", name: "alt", widget: "string"}
          - {label: "Caption", name: "caption", widget: "string"}
```

**Pros:**
- ✅ Keeps your Git workflow
- ✅ Free forever
- ✅ Works with existing JSON structure
- ✅ Can edit directly at `/admin`
- ✅ No external dependencies

**Cons:**
- ⚠️ Basic media management (no advanced image editing)
- ⚠️ Requires Git Gateway setup
- ⚠️ UI is functional but not fancy

**Access:** `https://jpstas.com/admin` after setup

---

### 🔥 Most Powerful: Sanity.io

**Why it's great:**
- Modern visual editor
- Excellent media management (CDN included)
- Real-time preview
- Structured content
- Great developer experience
- TypeScript support

**Setup Time:** 3-4 hours  
**Monthly Cost:** Free tier (generous limits)  
**Best For:** If you want professional CMS features

#### Architecture:
```
Sanity Studio → Sanity Cloud → Your Qwik site fetches via API
```

#### Example Schema:
```typescript
// sanity/schemas/portfolio.ts
export default {
  name: 'portfolio',
  type: 'document',
  title: 'Portfolio Project',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title'
    },
    {
      name: 'hero',
      type: 'image',
      title: 'Hero Image',
      options: {
        hotspot: true // Enables image cropping
      }
    },
    {
      name: 'gallery',
      type: 'array',
      title: 'Gallery',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text'
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption'
            }
          ]
        }
      ]
    }
  ]
}
```

#### Fetch in Qwik:
```typescript
// src/routes/portfolio/[slug]/index.tsx
import { routeLoader$ } from '@builder.io/qwik-city';
import { sanityClient } from '~/lib/sanity';

export const usePortfolioData = routeLoader$(async ({ params }) => {
  const data = await sanityClient.fetch(
    `*[_type == "portfolio" && slug.current == $slug][0]`,
    { slug: params.slug }
  );
  return data;
});
```

**Pros:**
- ✅ Professional-grade CMS
- ✅ Built-in CDN for images
- ✅ Image transformations on-the-fly
- ✅ Real-time collaboration
- ✅ Portable Sanity studio
- ✅ Excellent TypeScript support
- ✅ Can host studio at `/studio`

**Cons:**
- ⚠️ Requires API integration
- ⚠️ Migration from JSON needed
- ⚠️ External dependency
- ⚠️ Learning curve

**Free Tier:**
- 3 users
- Unlimited documents
- Unlimited API requests
- 10GB bandwidth/month
- 5GB assets

---

### 🎨 Most Visual: Tina CMS

**Why it's special:**
- Visual editing on your actual site
- Git-based like Decap
- Live preview while editing
- Modern UI
- Works with MDX and JSON

**Setup Time:** 2-3 hours  
**Monthly Cost:** Free tier available  
**Best For:** If you want visual editing without leaving your site

#### How it works:
```
Edit live on site → Save to Git → Cloudflare rebuilds
```

#### Configuration:
```typescript
// tina/config.ts
import { defineConfig } from "tinacms";

export default defineConfig({
  branch: "main",
  clientId: "your-client-id",
  token: "your-token",
  
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  
  schema: {
    collections: [
      {
        name: "portfolio",
        label: "Portfolio Projects",
        path: "src/data",
        format: "json",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
          },
          {
            type: "image",
            name: "hero",
            label: "Hero Image",
          },
          {
            type: "object",
            name: "gallery",
            label: "Gallery",
            list: true,
            fields: [
              {
                type: "image",
                name: "src",
                label: "Image",
              },
              {
                type: "string",
                name: "alt",
                label: "Alt Text",
              },
            ],
          },
        ],
      },
    ],
  },
});
```

**Pros:**
- ✅ Visual editing on actual site
- ✅ Git-based (keeps your workflow)
- ✅ Great DX
- ✅ Live preview
- ✅ Works with existing JSON

**Cons:**
- ⚠️ Requires cloud service for media
- ⚠️ Free tier has limits
- ⚠️ Adds build complexity

**Free Tier:**
- 2 users
- Unlimited API requests
- Git-based editing

---

### 🚀 Cloudflare-Native: Workers + D1 + R2

**Build your own lightweight CMS:**
- Use Cloudflare Workers for API
- D1 for content metadata
- R2 for media storage
- Simple admin interface

**Setup Time:** 4-6 hours  
**Monthly Cost:** ~$0-5  
**Best For:** If you want full control and Cloudflare-native

#### Architecture:
```
Admin UI → Workers API → D1 Database + R2 Storage → Qwik site reads from API
```

#### Example Worker:
```typescript
// workers/cms-api.ts
export default {
  async fetch(request: Request, env: Env) {
    const { pathname } = new URL(request.url);
    
    // GET portfolio data
    if (pathname.startsWith('/api/portfolio')) {
      const data = await env.DB.prepare(
        'SELECT * FROM portfolio WHERE slug = ?'
      ).bind(slug).first();
      
      return Response.json(data);
    }
    
    // Upload media
    if (pathname === '/api/media' && request.method === 'POST') {
      const formData = await request.formData();
      const file = formData.get('file');
      
      await env.MEDIA_BUCKET.put(`portfolio/${filename}`, file);
      
      return Response.json({
        url: `https://media.jpstas.com/portfolio/${filename}`
      });
    }
  }
};
```

**Pros:**
- ✅ Fully Cloudflare-native
- ✅ Complete control
- ✅ Integrates with existing R2
- ✅ Very fast (edge computing)
- ✅ No external dependencies

**Cons:**
- ⚠️ You build and maintain it
- ⚠️ Takes most time to set up
- ⚠️ Need to build admin UI

---

### 📝 Simple: Directus

**Self-hosted or cloud option:**
- Open source
- Auto-generates API from database
- Great admin UI
- File management built-in
- Can use your R2 for storage

**Setup Time:** 2-3 hours  
**Monthly Cost:** Free (self-host) or $15-99/month (cloud)  
**Best For:** If you want ready-made admin panel

**Pros:**
- ✅ Ready-made admin UI
- ✅ Automatic API generation
- ✅ Good media library
- ✅ Can use R2 for storage
- ✅ Role-based access

**Cons:**
- ⚠️ Requires hosting (or pay for cloud)
- ⚠️ More complex than needed?
- ⚠️ Database required

---

## Recommendation for Your Use Case

### 🎯 **Start with: Decap CMS (Git-Based)**

**Why:**
1. Works with your existing JSON files
2. No migration needed
3. Free forever
4. Keeps Git workflow you're used to
5. 1-2 hour setup
6. Can integrate with R2

**Setup Steps:**

1. **Add Decap CMS to your project:**
```bash
npm install --save-dev netlify-cms-app
```

2. **Create admin interface:**
```html
<!-- public/admin/index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Portfolio CMS</title>
  </head>
  <body>
    <script src="https://unpkg.com/netlify-cms@^2.0.0/dist/netlify-cms.js"></script>
  </body>
</html>
```

3. **Configure:**
```yaml
# public/admin/config.yml
backend:
  name: git-gateway
  branch: main

media_folder: static/images/portfolio
public_folder: /images/portfolio

# Or use R2 directly
media_library:
  name: cloudinary # Or custom R2 plugin
  
collections:
  - name: portfolio
    label: Portfolio Projects
    folder: src/data
    extension: json
    create: true
    fields:
      - {label: "Slug", name: "slug", widget: "string"}
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Tagline", name: "tagline", widget: "string"}
      - label: "Hero"
        name: "hero"
        widget: "object"
        fields:
          - {label: "Image", name: "src", widget: "image"}
          - {label: "Alt Text", name: "alt", widget: "string"}
      - label: "Gallery"
        name: "gallery"
        widget: "list"
        fields:
          - {label: "Image", name: "src", widget: "image"}
          - {label: "Alt Text", name: "alt", widget: "string"}
          - {label: "Caption", name: "caption", widget: "string", required: false}
```

4. **Enable Identity & Git Gateway** (if using Cloudflare Pages):
- Use Cloudflare Access or implement OAuth

5. **Access at:** `https://jpstas.com/admin`

---

### 🚀 **Later: Consider Sanity.io**

If you want more power:
- Better media management
- Image transformations
- Real-time updates
- Team collaboration

---

## Comparison Table

| Feature | Decap CMS | Sanity | Tina CMS | Custom (Workers) |
|---------|-----------|--------|----------|------------------|
| **Setup Time** | 1-2 hours | 3-4 hours | 2-3 hours | 4-6 hours |
| **Monthly Cost** | Free | Free tier | Free tier | $0-5 |
| **Git-Based** | ✅ Yes | ❌ No | ✅ Yes | ⚡ Your choice |
| **Media Management** | Basic | Excellent | Good | DIY |
| **Live Preview** | Limited | ✅ Yes | ✅ Yes | DIY |
| **Learning Curve** | Low | Medium | Medium | High |
| **Maintenance** | Low | Low | Low | High |
| **Works w/ JSON** | ✅ Yes | Migration needed | ✅ Yes | ✅ Yes |
| **Cloudflare Native** | ⚡ Compatible | ⚡ Compatible | ⚡ Compatible | ✅ Yes |

---

## Implementation Plan

### Phase 1: Add Decap CMS (Weekend project)
```bash
# 1. Create admin folder
mkdir -p public/admin

# 2. Add config files (see above)
# 3. Enable Git Gateway
# 4. Test at /admin

# Access your CMS at:
# https://jpstas.com/admin
```

### Phase 2: Enhance R2 Integration
- Create custom R2 media backend for Decap
- Or use Git LFS for large files
- Keep URLs consistent

### Phase 3: Optional Migration to Sanity (if needed)
- Only if you need more features
- Migrate JSON → Sanity schemas
- Add API routes to Qwik
- Update components to fetch from API

---

## What I Recommend

**For your portfolio:**

1. **Immediate term:** Keep current workflow + add the R2 upload scripts
   - You're already efficient
   - Scripts make uploads easy
   - No learning curve

2. **Short term (1-2 months):** Add Decap CMS
   - Visual editor for future updates
   - Easy for non-developers to help
   - Keeps your Git workflow
   - Free forever

3. **Long term (if scaling):** Consider Sanity
   - When you have lots of content
   - If you need team collaboration
   - When you want advanced media features

**Start simple, add complexity only when needed.**

---

## Next Steps

Want me to:
1. ✅ Set up Decap CMS for your project?
2. ✅ Create Sanity schema for your portfolio?
3. ✅ Build a custom Cloudflare Workers CMS?
4. ✅ Stick with current setup + improved scripts?

Let me know what direction you prefer! 🚀

