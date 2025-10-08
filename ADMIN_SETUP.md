# Admin Setup Guide for Cloudflare Pages

This guide explains how to set up the admin features (uploads, project editing) for your portfolio on Cloudflare Pages.

## 🔧 Requirements

- Cloudflare account with Pages enabled
- Cloudflare Images (for image uploads)
- Cloudflare Stream (for video uploads)
- Cloudflare KV (for storing projects data)

## 📋 Setup Steps

### 1. Create Cloudflare KV Namespace

1. Go to your Cloudflare dashboard
2. Navigate to **Workers & Pages** > **KV**
3. Click **Create namespace**
4. Name it: `PORTFOLIO_DATA`
5. Note the KV Namespace ID

### 2. Bind KV to Your Pages Project

1. Go to **Workers & Pages** in Cloudflare dashboard
2. Select your `jpstas.com` project
3. Go to **Settings** > **Functions**
4. Scroll to **KV Namespace Bindings**
5. Add binding:
   - **Variable name**: `PORTFOLIO_DATA`
   - **KV namespace**: Select the namespace you created
6. Save

### 3. Set Up Cloudflare API Tokens

You need API tokens for Images and Stream uploads:

#### For Cloudflare Images:
1. Go to **My Profile** > **API Tokens**
2. Create token with **Cloudflare Images** permissions
3. Save the token

#### For Cloudflare Stream:
1. Create another token with **Cloudflare Stream** permissions
2. Save the token

### 4. Configure Environment Variables in Cloudflare Pages

1. Go to your Pages project settings
2. Navigate to **Settings** > **Environment variables**
3. Add these variables for **Production** and **Preview**:

```
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_unified_token_or_images_token
CLOUDFLARE_STREAM_TOKEN=your_stream_token (if different)
```

To find your Account ID:
- Go to Cloudflare dashboard
- It's in the URL: `dash.cloudflare.com/{account_id}/...`
- Or check **Workers & Pages** overview

### 5. Deploy

Once you've completed the setup:

```bash
npm run build
git add -A
git commit -m "feat: add Cloudflare Functions API for admin features"
git push
```

Cloudflare Pages will automatically deploy with the new configuration.

## 🎯 How It Works

### Development Mode
- Uses **mock API** with localStorage
- No real uploads (creates blob URLs)
- Fast iteration without Cloudflare setup

### Production Mode
- Uses **real Cloudflare Functions** at `/api/*`
- Uploads to Cloudflare Images/Stream
- Stores projects in Cloudflare KV
- Persistent data across deployments

## 📡 API Endpoints

Your admin uses these Cloudflare Functions:

- `POST /api/upload` - Upload images/videos to Cloudflare
- `GET /api/projects` - Get all projects from KV
- `POST /api/projects` - Create new project in KV
- `PATCH /api/projects/:id` - Update project in KV
- `DELETE /api/projects/:id` - Delete project from KV
- `GET /api/media` - Get media files
- `GET /api/content` - Get page content

## 🔐 Authentication

Currently, authentication is handled client-side with:
- SimpleAuth (dev mode)
- No server-side auth (to be added)

### To Add Proper Auth:

1. Use Cloudflare Access for Pages
2. Or add API key validation in Functions
3. Or integrate with external auth provider

## 🐛 Troubleshooting

### Uploads Not Working
- Check that environment variables are set
- Verify API tokens have correct permissions
- Check browser console for errors

### Projects Not Saving
- Verify KV namespace is bound to Pages project
- Check that `PORTFOLIO_DATA` binding name matches code
- View Function logs in Cloudflare dashboard

### 404 on API Calls
- Ensure functions are in `/functions/api/` directory
- Check that TypeScript types are correct
- Rebuild and redeploy

## 📚 Additional Resources

- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/platform/functions/)
- [Cloudflare KV](https://developers.cloudflare.com/workers/runtime-apis/kv/)
- [Cloudflare Images](https://developers.cloudflare.com/images/)
- [Cloudflare Stream](https://developers.cloudflare.com/stream/)

## 💡 Tips

1. **Test locally with Wrangler**:
   ```bash
   npx wrangler pages dev dist --kv PORTFOLIO_DATA
   ```

2. **View KV data**:
   - Go to KV dashboard
   - Click on your namespace
   - View key-value pairs

3. **Monitor Function logs**:
   - Go to Pages project
   - Click on a deployment
   - View **Functions** tab for logs

4. **Keep mock API for dev**:
   - Faster iteration
   - No API setup needed
   - Just set `enableMockApi: true` in development config

