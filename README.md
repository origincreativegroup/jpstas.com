# John P. Stas - Portfolio

A modern, high-performance portfolio website built with Qwik and deployed on Cloudflare Pages.

## 🚀 Tech Stack

- **Framework**: [Qwik](https://qwik.builder.io/) - Resumable framework for instant page loads
- **Styling**: Tailwind CSS
- **CMS**: [Builder.io](https://builder.io) - Headless CMS with visual editor
- **Hosting**: Cloudflare Pages
- **Media Storage**: Cloudflare R2, Images & Stream
- **Language**: TypeScript

## 📁 Project Structure

```
/src
  /components      - Reusable UI components
  /routes          - File-based routing (pages)
  /styles          - Global styles
  /data            - Static data (projects, skills)
  root.tsx         - Root component
  entry.ssr.tsx    - Server-side rendering entry
```

## 🛠️ Development

### Prerequisites

- Node.js 18+ and npm
- Cloudflare account (for deployment)

### Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build.client

# Preview production build
npm run preview
```

### Local Development with Wrangler

```bash
# Serve with Cloudflare Pages environment
npm run serve
```

## 🧰 Asset Pipeline (jspow)

Media assets and Cloudflare mappings are curated in the [`jspow/jpstas_portfolio_assets_FINAL_with_portfolio`](../jspow/jpstas_portfolio_assets_FINAL_with_portfolio/) repository.

1. Stage and describe assets in that repo (see `docs/staging-pipeline.md`).
2. Fill R2 URLs / Stream IDs via `npm run assets:gui` in the jspow project.
3. Inject Markdown placeholders with `node scripts/inject-assets.mjs` (dry-run first).
4. Sync this site’s JSON data:
   ```bash
   cd ../jspow/jpstas_portfolio_assets_FINAL_with_portfolio
   node scripts/sync-jpstacom.mjs --dry   # preview changes
   node scripts/sync-jpstacom.mjs         # write updates into ../jpstas.com/src/data
   ```
5. Return here, review `git status`, and run `npm run build:check` before committing.

The sync script reconciles hero images, gallery assets, and Cloudflare Stream videos with `src/data/*.json`, ensuring URLs stay aligned with `media.jpstas.com`.

## 🌐 Deployment

The site automatically deploys to Cloudflare Pages when pushing to `main` branch.

### Manual Deployment

```bash
npm run build.client
npx wrangler pages deploy dist --project-name=jpstas-com
```

## 📝 Content Management

### Builder.io CMS (Primary)

**Builder.io** is the primary content management system, providing a visual editor for managing all content:

- ✅ Portfolio case studies (all projects)
- ✅ Homepage and About page content
- ✅ Site settings and SEO
- ✅ Custom pages with drag-and-drop builder
- ✅ Custom components (Cloudflare R2 Images, Stream Videos)

**Quick Start:**
1. Go to [Builder.io Dashboard](https://builder.io/content)
2. Edit content visually
3. Publish changes (live immediately)

**Documentation:**
- [Builder.io Quick Start](./docs/BUILDER_IO_QUICKSTART.md) - 5-minute setup guide
- [Builder.io Setup Guide](./docs/BUILDER_IO_SETUP.md) - Complete setup instructions
- [Builder.io Custom Components](./docs/BUILDER_IO_CUSTOM_COMPONENTS.md) - Component documentation
- [Builder.io Field Mapping](./docs/BUILDER_IO_FIELD_MAPPING.md) - All model fields

### CMS Admin (Decap CMS - Legacy)

Access the visual CMS at **`/admin`** (legacy option):

- ✅ Portfolio case studies (all projects)
- ✅ Homepage and About page content
- ✅ Media library (images/videos)
- ✅ Site settings and SEO

**Documentation:**
- [CMS Admin Guide](./docs/cms/CMS_ADMIN_GUIDE.md) - How to use the CMS
- [CMS Deployment Guide](./docs/cms/CMS_DEPLOYMENT.md) - Setup and configuration

### Media Management

Upload and manage media files:

```bash
# Upload image to R2
npm run r2:upload ./image.jpg portfolio/project/image.jpg

# Audit all media URLs
npm run r2:audit

# Update URLs to custom domain
npm run r2:update-urls
```

**See also:** [Media Management Guide](./docs/media/MEDIA_MANAGEMENT.md)

### Direct Content Editing

Content can also be edited directly:
- Portfolio projects: `/src/data/*.json`
- Static pages: `/src/data/site/*.json`
- Contact form: Cloudflare Functions at `/functions/api/contact.ts`

## 🎨 Features

- ⚡ Instant page loads with Qwik's resumability
- 📱 Fully responsive design
- 🎯 SEO optimized
- 📝 **Builder.io CMS** - Visual content management with drag-and-drop editor
- 🖼️ Optimized images with Cloudflare R2 & Image Resizing API
- 🎥 Video streaming with Cloudflare Stream
- 📧 Contact form with serverless function
- 🚀 Edge-deployed for global performance
- 🔐 Cloudflare Access authentication for admin
- 💾 Git-based content storage & version control (JSON fallback)

## 📚 Documentation

### AI Agent Handshake
- **[AI Agent Handshake](./AI-AGENT-HANDSHAKE.md)** - Complete Builder.io integration guide for AI agents

### CMS & Content Management
- **Builder.io (Primary)**
  - [Builder.io Quick Start](./docs/BUILDER_IO_QUICKSTART.md) - 5-minute setup
  - [Builder.io Setup Guide](./docs/BUILDER_IO_SETUP.md) - Complete setup
  - [Builder.io Custom Components](./docs/BUILDER_IO_CUSTOM_COMPONENTS.md) - Component docs
  - [Builder.io Field Mapping](./docs/BUILDER_IO_FIELD_MAPPING.md) - All model fields
- **Decap CMS (Legacy)**
  - [CMS Admin Guide](./docs/cms/CMS_ADMIN_GUIDE.md) - How to use the visual CMS
  - [CMS Deployment Guide](./docs/cms/CMS_DEPLOYMENT.md) - Setup and configuration
  - [CMS Implementation Summary](./docs/cms/CMS_IMPLEMENTATION_SUMMARY.md) - Technical details
  - [CMS Options](./docs/cms/CMS_OPTIONS.md) - Alternative CMS solutions

### Deployment & Build
- [Deployment Guide](./docs/deployment/DEPLOYMENT_GUIDE.md) - Main deployment procedures
- [Build Process](./docs/deployment/BUILD_PROCESS.md) - Build pipeline documentation

### Media Management
- [Media Management Guide](./docs/media/MEDIA_MANAGEMENT.md) - Media upload and management
- [Cloudflare Media Guide](./docs/media/CLOUDFLARE_MEDIA_GUIDE.md) - Cloudflare integration
- [R2 Upload Guide](./docs/media/R2_UPLOAD_GUIDE.md) - R2 upload procedures

### Accessibility
- [Accessibility Audit](./docs/accessibility/ACCESSIBILITY_AUDIT.md) - Audit results
- [Accessibility Summary](./docs/accessibility/ACCESSIBILITY_SUMMARY.md) - Summary of findings
- [Accessibility Testing Guide](./docs/accessibility/ACCESSIBILITY_TESTING_GUIDE.md) - Testing procedures

### Debugging & Development
- [Debugging Tools Summary](./docs/debugging/DEBUGGING_TOOLS_SUMMARY.md) - Available debugging tools

### Internal Operations (local only)
These documents are gitignored and intended for internal use:
- `docs/internal/SECRETS.md`
- `docs/internal/OPERATIONS.md`
- `docs/internal/WORKFLOWS.md`
- `docs/internal/ENVIRONMENT.md`
- `docs/internal/CONTACTS.md`

### Archive
Historical documentation and completed project summaries are archived in [`/archive`](./archive/) for reference.

## 📄 License

© 2025 John P. Stas. All rights reserved.

## 🔗 Links

- [Portfolio](https://www.jpstas.com)
- [LinkedIn](https://www.linkedin.com/in/john-stas-22b01054/)
- [GitHub](https://github.com/origincreativegroup)
