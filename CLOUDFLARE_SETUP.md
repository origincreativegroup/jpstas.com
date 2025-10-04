# Cloudflare Setup Guide

## Account Information
- **Account ID:** `fa917615d33ac203929027798644acef`
- **Project:** jpstas-portfolio

## Step 1: Create KV Namespaces ✅

~~Run these commands to create the required KV namespaces:~~

```bash
# ✅ COMPLETED - Namespaces created with the following IDs:
# CONTENT_KV:          b75bcab3b9df4e639518196d8dc0353d
# CONTENT_KV preview:  670588b8fc774796b5571b00857732d5
# MEDIA_KV:            94ff64faa5bc4d45aa27bafa0c260a07
# MEDIA_KV preview:    812a537c49664d4e86e87a3a690c6bed
```

## Step 2: Update wrangler.toml ✅

~~After creating the namespaces, copy the IDs from the output and update the file.~~

**COMPLETED** - wrangler.toml has been updated with all namespace IDs.

## Step 3: Deploy

```bash
npm run build
npx wrangler pages deploy dist --project-name=jpstas-portfolio
```

## Verification Checklist

- [x] KV namespaces created
- [x] wrangler.toml updated with namespace IDs
- [ ] Environment variables set in Cloudflare dashboard (CLOUDFLARE_API_TOKEN)
- [ ] Production deployment successful
