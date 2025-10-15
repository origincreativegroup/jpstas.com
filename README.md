# John P. Stas - Portfolio

A modern, high-performance portfolio website built with Qwik and deployed on Cloudflare Pages.

## 🚀 Tech Stack

- **Framework**: [Qwik](https://qwik.builder.io/) - Resumable framework for instant page loads
- **Styling**: Tailwind CSS
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

## 🌐 Deployment

The site automatically deploys to Cloudflare Pages when pushing to `main` branch.

### Manual Deployment

```bash
npm run build.client
npx wrangler pages deploy dist --project-name=jpstas-com
```

## 📝 Content Management

### CMS Admin (Decap CMS)

Access the visual CMS at **`/admin`** to manage all content without touching code:

- ✅ Portfolio case studies (all projects)
- ✅ Homepage and About page content
- ✅ Media library (images/videos)
- ✅ Site settings and SEO

**Quick Start:**
1. Navigate to `https://jpstas.com/admin`
2. Authenticate with Cloudflare Access
3. Edit content visually
4. Publish changes (auto-commits to Git)

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
- 📝 **Decap CMS** - Visual content management at `/admin`
- 🖼️ Optimized images with Cloudflare R2 & custom CDN
- 🎥 Video streaming with Cloudflare Stream
- 📧 Contact form with serverless function
- 🚀 Edge-deployed for global performance
- 🔐 Cloudflare Access authentication for admin
- 💾 Git-based content storage & version control

## 📚 Documentation

### CMS & Content Management
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

### Archive
Historical documentation and completed project summaries are archived in [`/archive`](./archive/) for reference.

## 📄 License

© 2025 John P. Stas. All rights reserved.

## 🔗 Links

- [Portfolio](https://www.jpstas.com)
- [LinkedIn](https://www.linkedin.com/in/john-stas-22b01054/)
- [GitHub](https://github.com/origincreativegroup)
