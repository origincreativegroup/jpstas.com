# Unified Cloudflare API Token Setup

This guide shows you how to create a single API token for Stream, Images, and Analytics instead of managing multiple tokens.

## Create Unified API Token

1. **Go to Cloudflare Dashboard** → **My Profile** → **API Tokens**
2. Click **Create Token** → **Create Custom Token**
3. Configure:
   - **Token name**: `Portfolio Media Management`
   - **Permissions**:
     - Account → **Stream** → Edit
     - Account → **Cloudflare Images** → Edit
     - Account → **Analytics** → Read (optional, for analytics)
   - **Account Resources**:
     - Include → Your specific account
4. Click **Continue to summary** → **Create Token**
5. **Copy the token** immediately (you won't see it again!)

## Configure Environment Variables

### Local Development (.env and .dev.vars)

Replace `your_unified_token_here` with your actual token:

```bash
CLOUDFLARE_ACCOUNT_ID=fa917615d33ac203929027798644acef
CLOUDFLARE_API_TOKEN=your_actual_token_here
```

### Production (Cloudflare Pages)

1. Go to **Cloudflare Pages Dashboard**
2. Select your `jpstas.com` project
3. Go to **Settings** → **Environment variables**
4. For **Production** environment, add:
   - `CLOUDFLARE_ACCOUNT_ID` = `fa917615d33ac203929027798644acef`
   - `CLOUDFLARE_API_TOKEN` = `your_actual_token_here`
   - `VITE_ADMIN_USERNAME` = `your_username`
   - `VITE_ADMIN_PASSWORD` = `your_password`
5. Click **Save**
6. **Redeploy** the site for changes to take effect

## How It Works

The code now uses a single token with fallback support:

```typescript
// Tries CLOUDFLARE_API_TOKEN first, falls back to legacy tokens
const token = env.CLOUDFLARE_API_TOKEN || env.CLOUDFLARE_STREAM_TOKEN;
```

This means:
- ✅ If you set `CLOUDFLARE_API_TOKEN`, it uses that for everything
- ✅ If not set, it falls back to the old separate tokens
- ✅ Backward compatible - won't break existing setups

## Benefits of Unified Token

1. **Simpler Management** - One token to manage instead of two
2. **Better Security** - Single point of rotation if compromised
3. **Analytics Access** - Can add Analytics permission for usage metrics
4. **Future-Proof** - Easy to add more Cloudflare services

## Migration Steps

1. Create the unified token (see above)
2. Update `.env` with `CLOUDFLARE_API_TOKEN=your_token`
3. Update `.dev.vars` with `CLOUDFLARE_API_TOKEN=your_token`
4. Update Cloudflare Pages environment variables
5. Test locally: `npm run dev`
6. Redeploy production
7. (Optional) Remove old `CLOUDFLARE_STREAM_TOKEN` and `CLOUDFLARE_IMAGES_TOKEN`

## Troubleshooting

### "Cloudflare credentials not configured"
- Verify `CLOUDFLARE_API_TOKEN` is set in environment variables
- Check for typos in the token value
- Ensure token has correct permissions (Stream Edit + Images Edit)

### Upload still not working in production
- Redeploy after setting environment variables
- Check Cloudflare Pages deployment logs for errors
- Verify token permissions in API Tokens page

### Token permissions error
- Token must have **Edit** permission, not just Read
- Must be assigned to your specific account
- Recreate token if permissions were wrong
