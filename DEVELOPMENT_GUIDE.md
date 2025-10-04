# Development Guide

## How Environment Variables Work

Your portfolio has **two separate environments** that need configuration:

### 1. **Frontend (React/Vite)** - Client-side
- Variables prefixed with `VITE_`
- Loaded from `.env` file
- Compiled into the frontend bundle
- **Examples**: `VITE_ADMIN_USERNAME`, `VITE_ADMIN_PASSWORD`

### 2. **Pages Functions (Workers)** - Server-side
- No prefix needed
- **Local dev**: Loaded from `.dev.vars` file
- **Production**: Set in Cloudflare Pages dashboard
- **Examples**: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_STREAM_TOKEN`, `CLOUDFLARE_IMAGES_TOKEN`

## Local Development

### Option 1: Frontend Only (Default)
Use this when you're working on UI/styling and don't need uploads:

```bash
npm run dev
```

**What works:**
- ✅ All pages and navigation
- ✅ Admin login (uses mock data)
- ✅ Viewing mock projects
- ❌ File uploads (no backend)
- ❌ Real API calls

**Environment:** Uses `.env` for `VITE_*` variables only

---

### Option 2: Full Stack with Pages Functions (Recommended)
Use this when testing uploads or other backend features:

```bash
npm run dev:pages
```

**What works:**
- ✅ Everything from Option 1
- ✅ File uploads to Cloudflare Stream/Images
- ✅ All Pages Functions (`/functions/*`)
- ✅ Real backend API calls

**Environment:** Uses both:
- `.env` for frontend (`VITE_*` variables)
- `.dev.vars` for Pages Functions (backend variables)

**How it works:**
1. Wrangler starts a local Pages server
2. Proxies Vite dev server for frontend
3. Runs your `/functions` with `.dev.vars` environment
4. Simulates production Cloudflare Pages environment

---

## Environment Files

### `.env` (Frontend variables - Client-side)
```bash
# These are built into your frontend bundle
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=jpstas2024
```

**Used by:** React components, Vite build
**Security:** ⚠️ Never put secrets here - these are public in the browser!

---

### `.dev.vars` (Backend variables - Server-side)
```bash
# These stay server-side during local development
CLOUDFLARE_ACCOUNT_ID=fa917615d33ac203929027798644acef
CLOUDFLARE_STREAM_TOKEN=q6jpinlnxzvoqbeh03ogJk5Si_gOhrXjCo4HE0-h
CLOUDFLARE_IMAGES_TOKEN=WJtWva9UD1ipMmDyEhc46lQQaW_yhkRA-rlPIWm3
```

**Used by:** Pages Functions (`/functions/api/upload.ts`, etc.)
**Security:** ✅ Safe - these never reach the browser
**Note:** This file is gitignored - never commit it!

---

## Production Deployment

### When you deploy to Cloudflare Pages:

1. **Frontend variables** are automatically included (from `.env` during build)

2. **Backend variables** must be set in Cloudflare Dashboard:
   - Go to **Cloudflare Pages** → Your project
   - **Settings** → **Environment variables**
   - Add for **Production** environment:
     - `CLOUDFLARE_ACCOUNT_ID`
     - `CLOUDFLARE_STREAM_TOKEN`
     - `CLOUDFLARE_IMAGES_TOKEN`

3. **How Pages Functions get variables in production:**
   ```typescript
   // In /functions/api/upload.ts
   export const onRequestPost: PagesFunction = async (context) => {
     const { env } = context;  // ← Cloudflare automatically provides this

     // Access your environment variables:
     const accountId = env.CLOUDFLARE_ACCOUNT_ID;
     const streamToken = env.CLOUDFLARE_STREAM_TOKEN;
     // etc...
   }
   ```

   Cloudflare **automatically injects** `env` into the function context!

---

## Quick Reference

| Command | Use Case | Environment |
|---------|----------|-------------|
| `npm run dev` | UI development only | `.env` |
| `npm run dev:pages` | Full stack testing | `.env` + `.dev.vars` |
| `npm run build` | Production build | `.env` |
| Deploy to CF Pages | Production | Dashboard env vars |

---

## Testing Upload Functionality

### 1. Start dev server with Pages Functions:
```bash
npm run dev:pages
```

### 2. Navigate to admin panel:
- http://localhost:8788/admin (if using Wrangler)
- Or http://localhost:5173/admin (if using just Vite)

### 3. Upload a test file:
- Image → Goes to Cloudflare Images
- Video → Goes to Cloudflare Stream

### 4. Check the response:
You'll see URLs like:
```json
{
  "success": true,
  "file": {
    "id": "abc123",
    "url": "https://customer-h044ipu9nb6m47zm.cloudflarestream.com/abc123/manifest/video.m3u8",
    "thumbnailUrl": "https://customer-h044ipu9nb6m47zm.cloudflarestream.com/abc123/thumbnails/thumbnail.jpg"
  }
}
```

---

## Troubleshooting

### "Can't access CLOUDFLARE_ACCOUNT_ID" in local dev
- ✅ **Solution:** Use `npm run dev:pages` instead of `npm run dev`
- **Why:** Regular Vite dev server doesn't run Pages Functions

### Environment variables not working
- Frontend vars: Check `.env` and ensure they start with `VITE_`
- Backend vars: Check `.dev.vars` exists and has correct format
- Restart dev server after changing environment files

### Upload fails with "credentials not configured"
1. Verify `.dev.vars` has all 3 Cloudflare variables
2. Check API tokens are valid (not expired)
3. Make sure you're using `npm run dev:pages`

### Different port than expected
- Wrangler uses port **8788** by default
- Regular Vite uses port **5173**
- Both work - just use the one shown in terminal

---

## Security Best Practices

✅ **DO:**
- Put API tokens in `.dev.vars` (gitignored)
- Set backend env vars in Cloudflare dashboard for production
- Use `VITE_` prefix only for non-sensitive client data

❌ **DON'T:**
- Put API tokens in `.env` with `VITE_` prefix
- Commit `.dev.vars` or `.env` to git
- Store secrets in frontend code

---

## Summary

**The key insight:**

Your frontend (React) and backend (Pages Functions) are **separate** and need **different** environment variables:

- **Frontend (.env):** Variables the browser needs - use `VITE_` prefix
- **Backend (.dev.vars):** Secret API tokens - NO prefix, never exposed to browser

When deployed, Cloudflare Pages:
- Builds frontend with `.env` variables baked in
- Provides `env` object to Functions at runtime with dashboard variables
- Keeps backend secrets secure and never sends them to clients

That's why you need both files locally and both configuration locations in production!
