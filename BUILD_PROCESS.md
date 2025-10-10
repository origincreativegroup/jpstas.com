# Build Process Documentation

## Overview

This document explains the build process for jpstas.com, a Qwik-based static site deployed on Cloudflare Pages.

## Build Pipeline

### 1. Development Mode

```bash
npm run dev
```

Starts the Vite development server with:
- Hot Module Replacement (HMR)
- SSR mode enabled
- Local development at `http://localhost:5173`

### 2. Production Build

```bash
npm run build
```

This command executes two steps:

#### Step 1: Vite Build
- Compiles TypeScript and JSX
- Bundles all components and routes
- Generates optimized CSS
- Creates the Qwik manifest (`q-manifest.json`)
- Outputs to `dist/` directory

**Critical Plugin**: `qwikLoaderPlugin` (in `vite.config.ts`)
- Runs during the Vite HTML transformation phase
- Injects the QwikLoader inline script into `<head>`
- Ensures QwikLoader is present before deployment

#### Step 2: Post-Build Script
```bash
node scripts/post-build.js
```

Legacy script that:
- Verifies build output
- Logs injected scripts for confirmation
- Acts as a backup injection method

**Note**: The Vite plugin is the primary injection mechanism. The post-build script is kept for verification.

### 3. Build Validation

```bash
npm run build:validate
```

Runs `scripts/validate-build.js` to check:
- ✅ QwikLoader inline script presence
- ✅ Stylesheet link
- ✅ Qwik preloader module
- ✅ Qwik core script
- ✅ Root div structure
- ✅ Qwik attributes (q:container, q:base, q:version)

**Exit Codes**:
- `0`: All checks passed
- `1`: Critical elements missing (build is broken)

### 4. Build Debugging

```bash
npm run build:debug
```

Runs `scripts/debug-build.js` to:
- Log environment information
- Verify file existence
- Analyze manifest content
- Simulate injection logic
- Generate `build-debug-report.json`

Use this when troubleshooting build issues.

### 5. Full Build Check

```bash
npm run build:check
```

Combines build + validation:
1. Runs full production build
2. Validates output
3. Fails if validation doesn't pass

**Recommended for CI/CD pipelines**.

## Critical Files

### QwikLoader
- **Source**: `dist/build/q-naDMFAHy.js` (filename may vary)
- **Purpose**: Bootstraps Qwik's resumability system
- **Size**: ~3KB minified
- **Location in HTML**: Inlined in `<head>` section

**Why it's critical**: Without this, Qwik cannot initialize, resulting in a white screen.

### Qwik Manifest
- **File**: `dist/q-manifest.json`
- **Purpose**: Maps components to bundles
- **Contains**:
  - `core`: Main Qwik runtime
  - `preloader`: Module loader
  - `qwikLoader`: Inline bootstrap script
  - `bundles`: Component chunks

### Index.html Structure

Expected structure after build:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/assets/[hash]-style.css">
    <script>/* QwikLoader inline code */</script>
  </head>
  <body>
    <div id="root"><!--qwik--></div>
    <script type="module" src="/build/q-[hash].js"></script>
    <script nomodule src="/build/q-[hash].js"></script>
  </body>
</html>
```

## Deployment to Cloudflare Pages

### Build Configuration

In `cloudflare-pages.toml`:

```toml
[build]
command = "npm run build"
publish = "dist"

[build.environment_variables]
NODE_VERSION = "18"
NPM_VERSION = "9"
```

### Build Process on Cloudflare

1. Cloudflare pulls latest code from GitHub
2. Installs dependencies: `npm install`
3. Runs build command: `npm run build`
4. Deploys `dist/` directory to CDN

### Important Notes

- The Vite plugin runs during the build phase
- Post-build script also runs (via `&& node scripts/post-build.js`)
- Both methods ensure QwikLoader injection

## Troubleshooting

### Problem: White Screen in Production

**Symptoms**:
- Blank white page
- No JavaScript errors in console
- View source shows missing QwikLoader

**Diagnosis**:
```bash
npm run check:production
```

This fetches the live site and validates its structure.

**Common Causes**:

1. **Build plugin not running**
   - Check `vite.config.ts` includes `qwikLoaderPlugin()`
   - Verify plugin import is correct

2. **Post-build script skipped**
   - Ensure build command includes `&& node scripts/post-build.js`
   - Check Cloudflare Pages build logs

3. **Caching issues**
   - Clear browser cache (Ctrl+Shift+R)
   - Purge Cloudflare cache
   - Wait for CDN propagation (~5 minutes)

4. **Deploy failure**
   - Check Cloudflare Pages deployment logs
   - Verify build completed successfully
   - Check for deployment errors

**Solutions**:

```bash
# 1. Validate local build
npm run build:check

# 2. Check production
npm run check:production

# 3. Debug build process
npm run build:debug

# 4. Rebuild and redeploy
npm run build
git add dist/ # if tracking dist
git commit -m "Rebuild with QwikLoader fix"
git push origin main
```

### Problem: Build Validation Fails

**Error**: "QwikLoader MISSING"

**Solution**:
1. Check if `qwik-loader-plugin.js` exists
2. Verify `vite.config.ts` imports and uses the plugin
3. Rebuild: `npm run build`
4. Validate: `npm run build:validate`

### Problem: Plugin Not Executing

**Symptoms**:
- Plugin console logs not appearing
- QwikLoader not injected despite plugin being added

**Diagnosis**:
```bash
npm run build:debug
```

**Solutions**:
1. Check plugin order in `vite.config.ts` (should be last)
2. Ensure plugin has `enforce: 'post'`
3. Verify `transformIndexHtml` is defined correctly

## Monitoring & Prevention

### Pre-Deployment Checklist

Before pushing to production:

- [ ] Run `npm run build:check` locally
- [ ] Verify QwikLoader in `dist/index.html`
- [ ] Check build logs for errors
- [ ] Test local build: `npm run serve`

### CI/CD Integration

Add to GitHub Actions (`.github/workflows/validate-build.yml`):

```yaml
name: Validate Build
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build:check
```

### Post-Deployment Verification

After deployment:

```bash
npm run check:production
```

This validates the live site has all required elements.

## Scripts Reference

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `npm run dev` | Start dev server | Local development |
| `npm run build` | Production build | Before deployment |
| `npm run build:validate` | Validate build output | After building |
| `npm run build:debug` | Debug build process | Troubleshooting |
| `npm run build:check` | Build + validate | CI/CD, pre-deploy |
| `npm run check:production` | Check live site | Post-deployment |
| `npm run preview` | Preview build locally | Testing prod build |
| `npm run serve` | Wrangler dev server | Testing with Cloudflare |

## Key Takeaways

1. **QwikLoader is essential** - Without it, the site won't work
2. **Two injection methods** - Vite plugin (primary) + post-build (backup)
3. **Always validate** - Run `build:validate` before deploying
4. **Monitor production** - Use `check:production` after deployment
5. **Debug systematically** - Use `build:debug` to diagnose issues

## Support

If issues persist:
1. Check Cloudflare Pages build logs
2. Review `build-debug-report.json`
3. Compare local `dist/index.html` with production source
4. Verify all build scripts are executable
5. Check for file system permission issues

For Qwik-specific issues, refer to: https://qwik.builder.io/docs/

