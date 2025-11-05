# Builder.io CMS Setup Guide

## Overview

This document explains how to set up and use Builder.io as the content management system for jpstas.com. Builder.io provides a visual, drag-and-drop interface for managing all content on the site, including portfolio projects, pages, and site-wide settings.

## Why Builder.io?

- **Visual Editor**: Non-technical users can edit content with a visual interface
- **Structured Content**: Define content models with custom fields
- **Real-time Preview**: See changes instantly before publishing
- **Version Control**: Built-in versioning and content scheduling
- **Headless CMS**: Content is delivered via API, keeping the site fast
- **Qwik Integration**: Official Qwik SDK for optimal performance

## Installation

Builder.io SDK is already installed in this project:

```bash
npm install @builder.io/sdk-qwik @builder.io/sdk
```

## Configuration

### 1. Environment Variables

The Builder.io public API key is configured in `.env`:

```env
VITE_BUILDER_PUBLIC_KEY=6dd7a0cce2ea426ebd00be77c2af34e3
```

### 2. Builder.io Account Setup

1. Go to https://builder.io/signup
2. Create an account or log in
3. Your API key is: `6dd7a0cce2ea426ebd00be77c2af34e3`
4. Access your space: https://builder.io/account/space

## Content Models

Builder.io uses "models" to define content types. Each model has custom fields that match your data structure.

### Creating Models in Builder.io

1. Log into https://builder.io
2. Navigate to **Models** in the sidebar
3. Click **+ New Model**
4. Choose model type and configure fields

### Model Definitions

#### 1. Portfolio Project (`portfolio-project`)

**Model Type**: Data Model (for structured content)

**Fields**:
- `slug` (Text) - Required, URL-friendly identifier
- `title` (Text) - Required, project title
- `tagline` (Text) - Short description
- `hero` (Object)
  - `src` (Image URL)
  - `alt` (Text)
- `cardImage` (Object)
  - `src` (Image URL)
  - `alt` (Text)
- `metrics` (List of Objects)
  - `label` (Text)
  - `value` (Text)
- `meta` (Object)
  - `tags` (List of Text)
  - `tools` (List of Text)
  - `year` (Text)
  - `client` (Text)
- `context` (Object)
  - `problem` (Long Text)
  - `constraints` (List of Text)
  - `quote` (Text)
- `solution` (Object)
  - `approach` (Long Text)
  - `bullets` (List of Text)
  - `gallery` (List of Objects)
    - `src` (Image/Video URL)
    - `alt` (Text)
    - `caption` (Text)
    - `type` (Select: image, video)
    - `poster` (Image URL - for videos)
- `impact` (List of Objects) - Same as metrics
- `process` (List of Objects)
  - `title` (Text)
  - `description` (Text)
- `reflection` (Object)
  - `learning` (Long Text)
  - `reuse` (List of Text)
- `related` (List of Objects)
  - `title` (Text)
  - `href` (Text)

#### 2. Homepage (`homepage`)

**Model Type**: Data Model

**Fields**:
- `title` (Text) - Main headline
- `subtitle` (Text) - Subheadline
- `description` (Long Text)
- `heroImage` (Image URL)
- `heroImageAlt` (Text)
- `featuredProjects` (List of Objects)
  - `title` (Text)
  - `slug` (Text)
  - `description` (Text)
  - `image` (Image URL)
  - `category` (Text)
  - `tags` (List of Text)
- `metrics` (List of Objects)
  - `label` (Text)
  - `value` (Text)

#### 3. About Page (`about-page`)

**Model Type**: Data Model

**Fields**:
- `title` (Text)
- `subtitle` (Text)
- `bio` (Long Text - Rich Text)
- `image` (Image URL)
- `skills` (List of Objects)
  - `category` (Text)
  - `skills` (List of Text)
- `experience` (List of Objects)
  - `title` (Text)
  - `company` (Text)
  - `period` (Text)
  - `description` (Long Text)
  - `achievements` (List of Text)
- `education` (List of Objects)
  - `degree` (Text)
  - `school` (Text)
  - `year` (Text)

#### 4. Site Settings (`site-settings`)

**Model Type**: Data Model (Single Entry)

**Fields**:
- `siteName` (Text)
- `siteDescription` (Text)
- `siteUrl` (Text)
- `author` (Object)
  - `name` (Text)
  - `email` (Text)
  - `social` (Object)
    - `linkedin` (Text)
    - `github` (Text)
    - `twitter` (Text)
- `navigation` (List of Objects)
  - `label` (Text)
  - `href` (Text)
  - `external` (Boolean)
- `footer` (Object)
  - `copyright` (Text)
  - `links` (List of Objects)
    - `label` (Text)
    - `href` (Text)

#### 5. Page (`page`)

**Model Type**: Page Model (for visual builder)

For custom pages that need visual editing capabilities.

## Code Integration

### Utility Functions

Located in `src/lib/builder.ts`:

```typescript
import { BUILDER_PUBLIC_KEY, BUILDER_MODELS } from '~/lib/builder';
```

### Fetching Content

Located in `src/lib/use-builder-content.ts`:

**Single Entry**:
```typescript
export const useHomepageData = createBuilderLoader<HomepageContent>('homepage');

// In component:
const homepage = useHomepageData();
console.log(homepage.value?.data);
```

**Multiple Entries**:
```typescript
export const usePortfolioProjects = createBuilderListLoader<PortfolioProject>('portfolio-project');

// In component:
const projects = usePortfolioProjects();
console.log(projects.value);
```

**Entry by Slug**:
```typescript
export const usePortfolioProject = createPortfolioLoader();

// In component (portfolio/[slug]/):
const project = usePortfolioProject();
console.log(project.value?.data);
```

### Type Safety

All content types are defined in `src/types/builder.ts`:

```typescript
import type { PortfolioProject, HomepageContent } from '~/types/builder';
```

## Usage Examples

### Example 1: Homepage with Builder.io

```typescript
// src/routes/index.tsx
import { component$ } from '@builder.io/qwik';
import { createBuilderLoader } from '~/lib/use-builder-content';
import type { HomepageContent } from '~/types/builder';
import homepageData from '~/data/site/homepage.json'; // Fallback

export const useHomepage = createBuilderLoader<HomepageContent>('homepage');

export default component$(() => {
  const builderContent = useHomepage();

  // Use Builder.io content if available, fallback to JSON
  const homepage = builderContent.value?.data || homepageData;

  return (
    <div>
      <h1>{homepage.title}</h1>
      <p>{homepage.subtitle}</p>

      {homepage.featuredProjects.map((project) => (
        <div key={project.slug}>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  );
});
```

### Example 2: Portfolio Project Page

```typescript
// src/routes/portfolio/[slug]/index.tsx
import { component$ } from '@builder.io/qwik';
import { createPortfolioLoader } from '~/lib/use-builder-content';

export const useProject = createPortfolioLoader();

export default component$(() => {
  const builderContent = useProject();

  // 404 if not found
  if (!builderContent.value) {
    return <div>Project not found</div>;
  }

  const project = builderContent.value.data;

  return (
    <article>
      <h1>{project.title}</h1>
      <p>{project.tagline}</p>

      <img src={project.hero.src} alt={project.hero.alt} />

      <section>
        <h2>The Problem</h2>
        <p>{project.context.problem}</p>
      </section>

      <section>
        <h2>The Solution</h2>
        <p>{project.solution.approach}</p>

        <div class="gallery">
          {project.solution.gallery.map((item, index) => (
            <img
              key={index}
              src={item.src}
              alt={item.alt}
            />
          ))}
        </div>
      </section>
    </article>
  );
});
```

## Content Migration

### Step 1: Create Models in Builder.io

1. Follow the model definitions above
2. Create each model in the Builder.io dashboard
3. Configure all custom fields

### Step 2: Import Existing Content

For each JSON file in `src/data/`:

1. Go to Builder.io dashboard
2. Select the appropriate model
3. Click **+ New Entry**
4. Copy/paste content from JSON files
5. Publish the entry

**Tip**: You can use the Builder.io API to bulk import content programmatically.

### Step 3: Update Components

Replace JSON imports with Builder.io loaders:

**Before**:
```typescript
import homepageData from '~/data/site/homepage.json';
```

**After**:
```typescript
export const useHomepage = createBuilderLoader<HomepageContent>('homepage');
const homepage = useHomepage();
const data = homepage.value?.data || fallbackData;
```

## Builder.io Visual Editor

### Enabling Visual Editing

For pages that need visual editing (not just structured data):

1. Create a **Page** model in Builder.io
2. Use `<Content>` component from Builder.io SDK
3. Register custom components

```typescript
import { Content } from '@builder.io/sdk-qwik';

export default component$(() => {
  return (
    <Content
      model="page"
      apiKey={BUILDER_PUBLIC_KEY}
    />
  );
});
```

### Registering Custom Components

```typescript
import { registerComponent } from '@builder.io/sdk-qwik';
import { Hero } from '~/components/hero';

registerComponent(Hero, {
  name: 'Hero',
  inputs: [
    { name: 'title', type: 'string' },
    { name: 'image', type: 'file' },
  ],
});
```

## Best Practices

### 1. Fallback Content

Always provide fallback content for development:

```typescript
const data = builderContent.value?.data || fallbackData;
```

### 2. Caching

Content is cached automatically in `createBuilderLoader()`:
- Client cache: 1 hour
- CDN cache: 24 hours
- Stale-while-revalidate: 7 days

### 3. Type Safety

Use TypeScript types for all content:

```typescript
const useHomepage = createBuilderLoader<HomepageContent>('homepage');
```

### 4. Preview Mode

Builder.io automatically enables preview mode when editing. The site will show draft content in the visual editor.

### 5. Image Optimization

Use Builder.io's built-in image optimization:

```html
<img src={`${project.hero.src}?width=800&format=webp`} />
```

## Testing

### Local Development

```bash
npm run dev
```

Visit `http://localhost:5173` - content will be fetched from Builder.io.

### Testing Without Builder.io

The site will fall back to JSON files if Builder.io is unavailable:

```typescript
const data = builderContent.value?.data || fallbackData;
```

## Deployment

Builder.io content is automatically available in production. No additional configuration needed.

### Environment Variables

Ensure `VITE_BUILDER_PUBLIC_KEY` is set in:
- Local: `.env`
- Cloudflare Pages: Environment Variables dashboard
- Pi-Forge: Add to deployment workflow

## Troubleshooting

### Content Not Loading

1. Check API key is correct in `.env`
2. Verify model name matches in `BUILDER_MODELS`
3. Check Builder.io dashboard for published content
4. Look for errors in browser console

### Type Errors

1. Update types in `src/types/builder.ts`
2. Ensure model fields match TypeScript interfaces
3. Run `npm run build.types` to check

### Preview Not Working

1. Clear browser cache
2. Check if in Builder.io editor
3. Verify `isBuilderPreview()` is working

## Resources

- Builder.io Documentation: https://www.builder.io/c/docs/developers
- Qwik SDK Docs: https://www.builder.io/c/docs/developers/qwik
- API Reference: https://www.builder.io/c/docs/api-intro
- Your Builder.io Dashboard: https://builder.io/content

## Support

For Builder.io specific issues:
- Documentation: https://www.builder.io/c/docs
- Community: https://forum.builder.io
- Support: help@builder.io

## Next Steps

1. ✅ Install Builder.io SDK
2. ✅ Configure API key
3. ✅ Create utility functions
4. ⏭️ Create models in Builder.io dashboard
5. ⏭️ Import existing content
6. ⏭️ Update components to use Builder.io
7. ⏭️ Test and deploy
