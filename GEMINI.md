# Project: John P. Stas - Portfolio

## Project Overview

This is a modern, high-performance portfolio website for John P. Stas. It is built with the Qwik framework for instant page loads and styled with Tailwind CSS. The project is deployed on Cloudflare Pages, utilizing Cloudflare R2 for media storage and Cloudflare Functions for the contact form. 

**Content Management:** The site uses **Builder.io** as the primary CMS with visual editor capabilities. Content can also be managed through Decap CMS at `/admin` (legacy) or directly via JSON files.

**For AI Agents:** See [AI-AGENT-HANDSHAKE.md](./AI-AGENT-HANDSHAKE.md) for complete Builder.io integration details.

## Building and Running

### Prerequisites

- Node.js 18+ and npm
- Cloudflare account (for deployment)

### Key Commands

- **Install dependencies:**
  ```bash
  npm install
  ```

- **Run development server:**
  ```bash
  npm run dev
  ```

- **Build for production:**
  ```bash
  npm run build
  ```

- **Preview production build:**
  ```bash
  npm run preview
  ```

- **Serve with Cloudflare Pages environment:**
  ```bash
  npm run serve
  ```

- **Deploy to Cloudflare Pages:**
  ```bash
  npm run build.client
  npx wrangler pages deploy dist --project-name=jpstas-com
  ```

## Development Conventions

- **Framework:** Qwik with Qwik City for routing.
- **Styling:** Tailwind CSS with a custom theme defined in `tailwind.config.ts`.
- **Language:** TypeScript.
- **Linting and Formatting:** ESLint and Prettier are used for code quality and consistency.
## Content Management

### Builder.io CMS (Primary)

Builder.io is the primary content management system with visual editor:
- **Dashboard:** https://builder.io/content
- **Models:** portfolio-project, homepage, about-page, site-settings
- **Custom Components:** CloudflareR2Image, CloudflareStreamVideo
- **API Key:** Configured in `.env` as `VITE_BUILDER_PUBLIC_KEY`

**Documentation:**
- [AI Agent Handshake](./AI-AGENT-HANDSHAKE.md) - Complete integration guide
- [Builder.io Setup](./docs/BUILDER_IO_SETUP.md) - Setup instructions
- [Builder.io Quick Start](./docs/BUILDER_IO_QUICKSTART.md) - 5-minute guide

### Content Management Options

1. **Builder.io CMS (Primary):** Visual editor with drag-and-drop components
2. **JSON Files (Fallback):** Direct editing in `/src/data/*.json` for portfolio projects and `/src/data/site/*.json` for static pages
3. **Decap CMS (Legacy):** Access the visual CMS at **/admin** to manage all content without touching code

### Other Systems

- **Serverless Functions:** Cloudflare Functions are used for backend logic, such as the contact form (`/functions/api/contact.ts`)
- **Media Management:** Media is stored in Cloudflare R2 and managed via npm scripts (`npm run r2:upload`, etc.)
