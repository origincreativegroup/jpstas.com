# Cloudflare Setup Guide

## Account Information
- **Account ID:** `fa917615d33ac203929027798644acef`
- **Project:** jpstas-portfolio

## Step 1: Create KV Namespaces

Run these commands to create the required KV namespaces:

```bash
# Create CONTENT_KV namespace (for CMS content storage)
npx wrangler kv:namespace create "CONTENT_KV"

# Create CONTENT_KV preview namespace (for local development)
npx wrangler kv:namespace create "CONTENT_KV" --preview

# Create MEDIA_KV namespace (for media library metadata)
npx wrangler kv:namespace create "MEDIA_KV"

# Create MEDIA_KV preview namespace (for local development)
npx wrangler kv:namespace create "MEDIA_KV" --preview
```

## Step 2: Update wrangler.toml

After creating the namespaces, copy the IDs from the output and update the file.

## Step 3: Deploy

```bash
npm run build
npx wrangler pages deploy dist --project-name=jpstas-portfolio
```

## Verification Checklist

- [ ] KV namespaces created
- [ ] wrangler.toml updated with namespace IDs
- [ ] Environment variables set in Cloudflare dashboard
- [ ] Production deployment successful
