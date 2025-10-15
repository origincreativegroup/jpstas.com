# Deployment Guide

## Quick Start

### Build and Deploy

```bash
# 1. Build the site
npm run build

# 2. Validate the build
npm run build:validate

# 3. Pre-deployment check
npm run pre-deploy

# 4. Commit and push
git add .
git commit -m "Build: Ready for deployment"
git push origin main
```

Cloudflare Pages will automatically deploy within 2-3 minutes.

### Verify Deployment

```bash
# Check production site
npm run check:production
```

## Troubleshooting White Screen Issues

### Symptoms
- Production site shows blank white page
- No JavaScript errors in console
- View page source shows missing scripts

### Diagnosis Steps

#### 1. Check Local Build

```bash
npm run build:check
```

This runs a full build and validates the output. If this fails locally, fix it before deploying.

#### 2. Debug the Build Process

```bash
npm run build:debug
```

Generates a detailed report in `build-debug-report.json`. Look for:
- Missing QwikLoader
- Failed file operations
- Incorrect manifest structure

#### 3. Check Production

```bash
npm run check:production
```

Fetches the live site and validates its structure. Saves `production-output.html` for comparison.

### Common Issues and Solutions

#### Issue 1: QwikLoader Missing in Production

**Cause**: Post-build script didn't run on Cloudflare Pages

**Solution**:
1. Check `cloudflare-pages.toml` has: `command = "npm run build"`
2. Verify in Cloudflare dashboard: Settings → Builds & Deployments → Build command
3. Check build logs for post-build script output
4. Ensure Node version matches (18+)

#### Issue 2: Stale Cache

**Cause**: Browser or CDN caching old version

**Solution**:
```bash
# Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

# In Cloudflare Dashboard:
# - Go to Caching → Purge Cache
# - Select "Purge Everything"
```

Wait 1-2 minutes for CDN propagation.

#### Issue 3: Build Fails on Cloudflare

**Cause**: Different environment or missing dependencies

**Solution**:
1. Check Cloudflare Pages build logs
2. Verify `package.json` scripts are correct
3. Ensure all dependencies are in `dependencies` or `devDependencies`
4. Check Node version compatibility

#### Issue 4: Post-Build Script Fails

**Cause**: File paths or permissions issue

**Solution**:
1. Run locally: `npm run build`
2. Check for error messages from post-build script
3. Verify `dist/` directory structure
4. Check `scripts/post-build.js` file exists and is executable

## Build Validation Scripts

### validate-build.js
Validates the build output has all required elements.

**Run**: `npm run build:validate`

**Checks**:
- QwikLoader inline script
- Stylesheet link
- Preloader and Core scripts
- Root div structure
- Qwik attributes

**Exit codes**:
- 0: All checks passed
- 1: Critical elements missing

### debug-build.js
Provides detailed debugging information about the build.

**Run**: `npm run build:debug`

**Output**:
- Environment details
- File existence checks
- Manifest analysis
- HTML content validation
- Generates `build-debug-report.json`

### pre-deploy-check.js
Final check before deployment.

**Run**: `npm run pre-deploy`

**Validates**:
- All dist files exist
- Critical assets present
- index.html structure
- Manifest file references

### check-production.js
Validates the live production site.

**Run**: `npm run check:production`

**Checks**:
- Fetches live HTML
- Validates script presence
- Compares with expected structure
- Saves output for debugging

## CI/CD Integration

### GitHub Actions

The project includes `.github/workflows/validate-build.yml` that:
- Runs on every push to main
- Runs on pull requests
- Builds the project
- Validates the output
- Checks production after deployment

### Local Git Hooks

You can add a pre-commit hook to validate before committing:

```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "Running pre-commit validation..."
npm run build:check

if [ $? -ne 0 ]; then
    echo "Build validation failed. Commit aborted."
    exit 1
fi
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

## Cloudflare Pages Configuration

### Build Settings

In `cloudflare-pages.toml`:

```toml
[build]
command = "npm run build"
publish = "dist"

[build.environment_variables]
NODE_VERSION = "18"
NPM_VERSION = "9"
```

### Manual Configuration

If not using `cloudflare-pages.toml`, configure in dashboard:

1. Go to Cloudflare Pages project
2. Settings → Builds & deployments
3. Set:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: `18`

### Environment Variables

No environment variables are required for basic builds.

## Deployment Checklist

Before every deployment:

- [ ] Run `npm run build:check` - Build validates locally
- [ ] Check `dist/index.html` contains QwikLoader
- [ ] Review build logs for errors or warnings
- [ ] Test locally: `npm run serve` or `npm run preview`
- [ ] Commit all changes
- [ ] Push to GitHub
- [ ] Wait for Cloudflare Pages deployment (2-3 min)
- [ ] Run `npm run check:production` to verify
- [ ] Test production site in browser
- [ ] Clear cache if needed (Ctrl+Shift+R)

## Monitoring

### Post-Deployment

After each deployment:

1. **Check deployment status** in Cloudflare Dashboard
2. **Verify with automated check**: `npm run check:production`
3. **Manual browser test**: Visit www.jpstas.com
4. **Check browser console** for errors
5. **Test navigation** between pages

### Failed Deployment

If deployment fails:

1. Check Cloudflare Pages build logs
2. Look for npm install errors
3. Check for build command failures
4. Verify post-build script ran
5. Compare with last successful build

### Rollback

If production is broken:

1. In Cloudflare Pages dashboard
2. Go to Deployments
3. Find last working deployment
4. Click "..." → "Rollback to this deployment"

## Best Practices

1. **Always validate locally** before pushing
2. **Use validation scripts** in your workflow
3. **Check production** after every deployment
4. **Keep build logs** for troubleshooting
5. **Monitor first-load performance** with Chrome DevTools
6. **Test on multiple browsers** after major changes
7. **Clear cache** when testing changes

## Support Resources

- **Build Process Documentation**: See `BUILD_PROCESS.md`
- **White Screen Fix**: See `WHITE_SCREEN_FIX.md`
- **Qwik Documentation**: https://qwik.builder.io/docs/
- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages/

## Emergency Procedures

### Complete Site Failure

1. **Immediate**:
   - Rollback in Cloudflare Pages
   - Clear Cloudflare cache

2. **Investigation**:
   ```bash
   npm run check:production     # Save production HTML
   git log -5                   # Check recent changes
   npm run build:debug          # Debug build locally
   ```

3. **Fix**:
   - Identify failing component
   - Fix locally
   - Validate: `npm run build:check`
   - Test: `npm run serve`
   - Deploy

### Build Failures

1. Check Cloudflare build logs
2. Reproduce locally: `npm run build`
3. Check for package installation issues
4. Verify Node version matches
5. Check for file system issues

## Questions?

If issues persist after following this guide:

1. Review `build-debug-report.json`
2. Compare `production-output.html` with local `dist/index.html`
3. Check Cloudflare Pages deployment logs
4. Verify all npm scripts work locally
5. Check for recent Qwik version updates

Remember: The QwikLoader must be present for the site to work. Always verify with `npm run build:validate` before deploying.

