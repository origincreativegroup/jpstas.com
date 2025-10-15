# CMS Deployment Guide

Step-by-step instructions to deploy Decap CMS to your portfolio site.

## Overview

What's been set up:
- ✅ Admin interface at `/admin`
- ✅ CMS configuration for all content types
- ✅ Custom R2 media backend
- ✅ Cloudflare Worker for media API
- ✅ Static page content files
- ✅ Updated configuration files

## Prerequisites

Before deploying:
- [ ] GitHub repository access
- [ ] Cloudflare account with Pages and R2
- [ ] Wrangler CLI installed (`npm install -g wrangler`)
- [ ] Authenticated with Wrangler (`npx wrangler login`)

---

## Step 1: Deploy the Media API Worker

The worker handles media uploads to R2.

### Deploy Worker

```bash
# From project root
npm run cms:deploy
```

This deploys `workers/cms-media-api.ts` to Cloudflare.

### Configure Worker Route

1. Go to Cloudflare Dashboard → Workers & Pages
2. Click on `cms-media-api` worker
3. Go to **Settings** → **Triggers**
4. Add Route:
   - **Route**: `jpstas.com/api/cms/*`
   - **Zone**: `jpstas.com`
5. Save

### Verify Worker

Test the worker:
```bash
curl https://jpstas.com/api/cms/media/list
```

Should return JSON with files list (or empty array).

---

## Step 2: Configure Cloudflare Access

Protect `/admin` route with authentication.

### Option A: Email OTP (Easiest)

1. Go to Cloudflare Dashboard → Zero Trust → Access → Applications
2. Click **Add an application** → **Self-hosted**
3. Configure:
   - **Name**: Portfolio CMS Admin
   - **Subdomain**: Leave blank
   - **Domain**: `jpstas.com`
   - **Path**: `/admin`
4. Click **Next**
5. Add Policy:
   - **Rule name**: Allow Admin
   - **Action**: Allow
   - **Include** → **Emails**: Add your email(s)
6. Click **Next** → **Add application**

### Option B: GitHub OAuth (Recommended)

1. Go to Zero Trust → Settings → Authentication
2. Click **Add new** → **GitHub**
3. Follow GitHub OAuth setup:
   - Create OAuth app in GitHub
   - Add Client ID and Secret to Cloudflare
4. Go back to Access Applications
5. Create application (as above)
6. In policies, use:
   - **Include** → **Emails ending in**: `@yourdomain.com`
   - Or **GitHub Organizations**: Your org name

### Test Access

1. Open `https://jpstas.com/admin` in incognito
2. You should see Cloudflare Access login
3. Authenticate with email or GitHub
4. You should see Decap CMS dashboard

---

## Step 3: Configure GitHub Backend

The CMS needs GitHub access to commit changes.

### Create GitHub OAuth App

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: Portfolio CMS
   - **Homepage URL**: `https://jpstas.com`
   - **Authorization callback URL**: `https://jpstas.com/api/cms/auth/callback`
4. Click **Register application**
5. Copy Client ID
6. Generate Client Secret

### Update CMS Configuration

Edit `public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: origincreativegroup/jpstas.com
  branch: main
  base_url: https://jpstas.com
  auth_endpoint: /api/cms/auth
```

### Create Auth Proxy Worker (Optional)

If using GitHub OAuth, you'll need an auth proxy worker.

**Create `workers/cms-auth.ts`:**

```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    
    if (!code) {
      return new Response('Missing code', { status: 400 });
    }
    
    // Exchange code for token
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
```

Deploy:
```bash
npx wrangler deploy workers/cms-auth.ts --name cms-auth
```

Add route: `jpstas.com/api/cms/auth*`

---

## Step 4: Build and Deploy Site

### Build with Admin Files

```bash
npm run build
```

This includes:
- `/admin/index.html`
- `/admin/config.yml`
- `/admin/r2-backend.js`

### Deploy to Cloudflare Pages

If using automatic deployment:
```bash
git add .
git commit -m "feat: add Decap CMS"
git push origin main
```

Cloudflare Pages will auto-build and deploy.

If manual:
```bash
npx wrangler pages publish dist
```

### Verify Deployment

Check that these files are accessible:
- `https://jpstas.com/admin/` (CMS dashboard)
- `https://jpstas.com/admin/config.yml` (CMS config)
- `https://jpstas.com/api/cms/media/list` (Media API)

---

## Step 5: Test the CMS

### Access CMS

1. Go to `https://jpstas.com/admin`
2. Authenticate via Cloudflare Access
3. You should see the Decap CMS dashboard

### Test Workflow

**Test 1: View Existing Content**
1. Click **Portfolio Projects**
2. You should see all 10 case studies
3. Click one to view/edit

**Test 2: Upload Media**
1. Click **Media** in top nav
2. Click **Upload**
3. Select an image
4. Verify it uploads to R2
5. Check URL is `https://media.jpstas.com/...`

**Test 3: Edit and Publish**
1. Edit a portfolio project
2. Change the tagline
3. Click **Save** (creates draft)
4. Click **Publish**
5. Verify commit appears in GitHub
6. Wait for Cloudflare Pages to rebuild
7. Check site reflects changes

**Test 4: Edit Homepage**
1. Go to **Home Page** → **Homepage Content**
2. Edit hero title
3. Publish
4. Verify changes on site

---

## Step 6: Configure Workers in Pages

Link the workers to your Pages project.

### Via Cloudflare Dashboard

1. Go to Pages → `jpstas-portfolio` → Settings
2. Go to **Functions** tab
3. Add **Service Bindings**:
   - Name: `MEDIA_API`
   - Service: `cms-media-api`
4. Add **R2 Bucket Bindings**:
   - Variable: `MEDIA_BUCKET`
   - Bucket: `jpstas-media`

### Via wrangler.toml

This is already configured in `wrangler.toml`:

```toml
[[r2_buckets]]
binding = "MEDIA_BUCKET"
bucket_name = "jpstas-media"
```

---

## Troubleshooting Deployment

### Worker Not Responding

**Check worker is deployed:**
```bash
npx wrangler deployments list --name cms-media-api
```

**Check worker logs:**
```bash
npx wrangler tail cms-media-api
```

**Redeploy:**
```bash
npm run cms:deploy
```

### Can't Access /admin

**Check Cloudflare Access:**
- Verify policy is active
- Check email is whitelisted
- Try incognito mode
- Clear cookies

**Check deployment:**
```bash
# Verify files exist in build
ls -la dist/admin/
```

### Media Upload Fails

**Check R2 bucket:**
```bash
npx wrangler r2 bucket list
```

**Test R2 permissions:**
```bash
npx wrangler r2 object put jpstas-media/test.txt --file=test.txt
```

**Check worker binding:**
- Verify `MEDIA_BUCKET` is bound in Pages settings
- Redeploy worker if needed

### GitHub Auth Not Working

**Check OAuth app:**
- Verify callback URL is correct
- Ensure Client ID/Secret are valid
- Check app is not suspended

**Check auth worker:**
- Verify it's deployed
- Check route is configured
- Test endpoint manually

### Changes Not Appearing

**Check build:**
- Go to Cloudflare Pages → Deployments
- Check latest build status
- Review build logs for errors

**Check Git:**
```bash
git log
# Verify commit from CMS
```

**Clear cache:**
- Purge Cloudflare cache
- Clear browser cache (Ctrl+Shift+R)

---

## Post-Deployment

### Grant Access to Others

To add more admins:
1. Go to Cloudflare Access → Applications → Portfolio CMS
2. Edit policy
3. Add email addresses
4. Save

### Monitor Usage

**Track deployments:**
- Cloudflare Pages → Deployments tab

**Track R2 usage:**
- Cloudflare Dashboard → R2 → Analytics

**Track worker usage:**
- Workers → cms-media-api → Analytics

### Backup

Content is backed up via Git:
```bash
# Clone repo
git clone https://github.com/origincreativegroup/jpstas.com.git

# All content is in:
# - src/data/*.json (portfolio)
# - src/data/site/*.json (static pages)
```

---

## Configuration Summary

### Files Created

```
public/admin/
├─ index.html           # CMS interface
├─ config.yml           # CMS configuration
└─ r2-backend.js        # Custom R2 backend

workers/
├─ cms-media-api.ts     # R2 media API
└─ cms-auth.ts          # GitHub OAuth proxy (optional)

src/data/site/
├─ homepage.json        # Homepage content
├─ about.json           # About page content
└─ settings.json        # Site settings
```

### Configuration Changes

```
wrangler.toml           # Added worker config
package.json            # Added CMS scripts
cloudflare-pages.toml   # Added /admin headers
```

### Cloudflare Resources

```
Workers:
- cms-media-api         # Media uploads/management
- cms-auth (optional)   # GitHub OAuth

Access Applications:
- Portfolio CMS Admin   # Protects /admin

R2 Buckets:
- jpstas-media          # Media storage
```

---

## Next Steps

1. ✅ Deploy media worker: `npm run cms:deploy`
2. ✅ Configure Cloudflare Access for `/admin`
3. ✅ Set up GitHub OAuth (optional)
4. ✅ Build and deploy: `git push`
5. ✅ Test CMS at `https://jpstas.com/admin`
6. ✅ Train users with `CMS_ADMIN_GUIDE.md`

---

## Maintenance

### Update CMS

To update Decap CMS version:

Edit `public/admin/index.html`:
```html
<script src="https://unpkg.com/decap-cms@^3.2.0/dist/decap-cms.js"></script>
```

Rebuild and deploy.

### Update Worker

Edit `workers/cms-media-api.ts`, then:
```bash
npm run cms:deploy
```

### Add New Collections

Edit `public/admin/config.yml`, add collection:
```yaml
- name: "blog"
  label: "Blog Posts"
  folder: "src/data/blog"
  create: true
  fields:
    - {label: "Title", name: "title", widget: "string"}
    # ...
```

Rebuild and deploy.

---

## Security Checklist

- [ ] Cloudflare Access enabled for `/admin`
- [ ] Worker validates auth (if using API auth)
- [ ] R2 bucket has proper CORS settings
- [ ] GitHub OAuth app has correct callback URL
- [ ] Only authorized emails can access CMS
- [ ] HTTPS enforced on all routes
- [ ] Admin route has no-cache headers

---

## Cost Estimate

### Cloudflare Costs

| Service | Usage | Cost |
|---------|-------|------|
| Pages | Unlimited requests | $0 |
| Workers | <100k req/day | $0 |
| R2 Storage | ~1GB | ~$0.015/mo |
| R2 Reads | Via Cloudflare | $0 |
| Access | <50 users | $0 |

**Total**: ~$0-2/month

---

**Deployment Status**: Ready to deploy  
**Last Updated**: January 2025  
**Maintained By**: John P. Stas

