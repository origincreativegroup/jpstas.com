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

Content is managed through:
- Static JSON files in `/src/data/`
- Contact form submissions via Cloudflare Functions
- Media stored in Cloudflare R2 bucket

## 🎨 Features

- ⚡ Instant page loads with Qwik's resumability
- 📱 Fully responsive design
- 🎯 SEO optimized
- 🖼️ Optimized images with Cloudflare Images
- 🎥 Video streaming with Cloudflare Stream
- 📧 Contact form with serverless function
- 🚀 Edge-deployed for global performance

## 📄 License

© 2025 John P. Stas. All rights reserved.

## 🔗 Links

- [Portfolio](https://www.jpstas.com)
- [LinkedIn](https://linkedin.com/in/johnpstas)
- [GitHub](https://github.com/johnpstas)
