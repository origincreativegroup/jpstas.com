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
- [CMS Admin Guide](./CMS_ADMIN_GUIDE.md) - How to use the CMS
- [CMS Deployment Guide](./CMS_DEPLOYMENT.md) - Setup and configuration

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

**See also:** [Media Management Guide](./MEDIA_MANAGEMENT.md)

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

## 📄 License

© 2025 John P. Stas. All rights reserved.

## 🔗 Links

- [Portfolio](https://www.jpstas.com)
- [LinkedIn](https://www.linkedin.com/in/john-stas-22b01054/)
- [GitHub](https://github.com/origincreativegroup)
