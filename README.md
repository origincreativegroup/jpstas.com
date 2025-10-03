
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

## Contact Form Notes

This starter includes a **Pages Function** at `/functions/submit-contact.ts`
that accepts `POST` form data. It currently logs to the worker and returns `{ ok: true }`.
To wire up email or notifications:

- **MailChannels** (free with Cloudflare Workers): add a dependency and send email.
- **Webhook**: forward to Slack/Discord/Make/Zapier endpoint.
- **R2/KV**: store submissions (requires binding in Pages → Settings → Functions).

## Production Checklist

- Replace footer links (LinkedIn, GitHub).
- Add your PDF resume at `/public/John_P_Stas_Resume.pdf` or update the link.
- Fill actual projects and images.
- Set up Analytics (Cloudflare Web Analytics) if desired.
- Add security headers in Pages → Settings if you want stricter CSP.
