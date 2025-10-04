
# jpstas.com — Portfolio (Cloudflare Pages)

A minimal, fast portfolio scaffold using **React + Vite + Tailwind**,
ready for **Cloudflare Pages**. Includes a simple **Pages Function**
(`/functions/submit-contact.ts`) you can later wire to email or a webhook.

## Quickstart (local)

```bash
pnpm i   # or npm i / yarn
pnpm dev # http://localhost:5173
```

## Deploy to Cloudflare Pages

1) Push this folder to a new GitHub repo.

2) In Cloudflare Dashboard → **Pages** → **Create a project** → Connect to GitHub.

- Build command: `pnpm i && pnpm build` (or `npm ci && npm run build`)
- Build output directory: `dist`
- Functions directory: `functions` (auto-detected)

3) For SPA routing, `_redirects` is included (`/* /index.html 200`).

4) After the first deploy, go to **jpstas.com** (in Cloudflare Registrar/DNS)
   and create a CNAME for the Pages project (Cloudflare UI will prompt you).

## Customizing

- Edit pages in `src/pages/*` and layout in `src/App.tsx`.
- Update nav links, add projects in `src/pages/Portfolio.tsx`.
- Tailwind config in `tailwind.config.ts`, global styles in `src/index.css`.

## Media Hosting with Cloudflare

This portfolio uses **Cloudflare Stream** for videos and **Cloudflare Images** for optimized image delivery.

**Features**:
- Automatic video transcoding and adaptive streaming
- Image optimization (WebP/AVIF) and resizing
- Global CDN delivery for fast loading
- Built-in analytics and security

**Setup**: See [CLOUDFLARE_SETUP.md](./CLOUDFLARE_SETUP.md) for detailed configuration instructions.

## Contact Form Notes

This starter includes a **Pages Function** at `/functions/submit-contact.ts`
that accepts `POST` form data. It currently logs to the worker and returns `{ ok: true }`.
To wire up email or notifications:

- **MailChannels** (free with Cloudflare Workers): add a dependency and send email.
- **Webhook**: forward to Slack/Discord/Make/Zapier endpoint.
- **R2/KV**: store submissions (requires binding in Pages → Settings → Functions).

## Security Configuration

### Environment Variables

Create a `.env` file (already gitignored) with your admin credentials:

```bash
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=your_secure_password_here
```

In **Cloudflare Pages → Settings → Environment variables**, add:

**Client-side** (prefix with `VITE_`):
- `VITE_ADMIN_USERNAME`
- `VITE_ADMIN_PASSWORD`

**Server-side** (Pages Functions):
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_STREAM_TOKEN`
- `CLOUDFLARE_IMAGES_TOKEN`

### Security Headers

Add these headers in **Cloudflare Pages → Settings → Functions**:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

For stricter CSP, add in **Custom domains → SSL/TLS → Transform Rules**:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:
```

## Production Checklist

- Replace footer links (LinkedIn, GitHub).
- Add your PDF resume at `/public/John_P_Stas_Resume.pdf` or update the link.
- Fill actual projects and images.
- Set up Analytics (Cloudflare Web Analytics) if desired.
- **Set environment variables for admin authentication** (see Security Configuration above).
