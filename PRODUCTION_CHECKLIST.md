# 🚀 Production Deployment Checklist

## Pre-Deployment Checklist

### ✅ Code Quality
- [ ] All TypeScript errors resolved
- [ ] ESLint passes without warnings
- [ ] No console.log statements in production code
- [ ] Debug code only enabled in development mode
- [ ] All TODO comments addressed or documented

### ✅ Environment Configuration
- [ ] Production environment variables set in Cloudflare Pages dashboard:
  - [ ] `VITE_ADMIN_USERNAME` (set to secure username)
  - [ ] `VITE_ADMIN_PASSWORD` (set to secure password)
  - [ ] `CLOUDFLARE_API_TOKEN` (for file uploads)
  - [ ] `CLOUDFLARE_ACCOUNT_ID` (for Cloudflare services)
  - [ ] `VITE_CLOUDFLARE_STREAM_TOKEN` (for video uploads to Cloudflare Stream)
  - [ ] `VITE_CLOUDFLARE_IMAGES_TOKEN` (for image uploads to Cloudflare Images)
- [ ] No sensitive data in `.env` files (they're gitignored)
- [ ] Mock API disabled in production builds

### ✅ API Endpoints
- [ ] All API endpoints work correctly in production mode
- [ ] Cloudflare Pages Functions deployed and working
- [ ] KV namespaces properly configured (MEDIA_KV, CONTENT_KV)
- [ ] File upload functionality tested
- [ ] **NEW:** Bulk media operations endpoint (`/api/media/bulk`) working
- [ ] **NEW:** Media usage tracking API working
- [ ] Error handling implemented for all API calls

### ✅ Security
- [ ] Admin credentials are secure (not default values)
- [ ] No hardcoded secrets in code
- [ ] Authentication properly implemented
- [ ] File upload restrictions in place
- [ ] Input validation on all forms

### ✅ Performance
- [ ] Images optimized for web
- [ ] No unnecessary console logging
- [ ] Debug utilities disabled in production
- [ ] Build size optimized
- [ ] Lazy loading implemented where appropriate

### ✅ Testing
- [ ] Admin login works
- [ ] File upload works (images and videos)
- [ ] Project creation works
- [ ] Media library functions work
- [ ] **NEW:** Media library bulk operations work (bulk edit, bulk delete)
- [ ] **NEW:** Media usage tracking works (shows which projects use each file)
- [ ] **NEW:** Cloudflare Stream video uploads work
- [ ] **NEW:** Error handling and retry logic works for failed uploads
- [ ] All forms validate correctly
- [ ] Error messages are user-friendly

## Deployment Steps

### 1. Pre-Deployment
```bash
# Run the production deployment script
./scripts/deploy-production.sh
```

### 2. Manual Verification
- [ ] Visit https://jpstas.com
- [ ] Test admin login at https://jpstas.com/admin
- [ ] Create a test project
- [ ] Upload test files
- [ ] Verify all functionality works

### 3. Media Manager Specific Testing
- [ ] **Media Library Access**: Navigate to Media Library from admin dashboard
- [ ] **File Uploads**: Test uploading various file types:
  - [ ] Small image files (JPG, PNG, WebP)
  - [ ] Large image files (test size limits)
  - [ ] Video files (MP4, WebM) - should use Cloudflare Stream
  - [ ] Multiple files at once
- [ ] **Bulk Operations**: Test bulk functionality:
  - [ ] Select multiple files and bulk edit metadata (tags, collections)
  - [ ] Select multiple files and bulk delete
  - [ ] Verify partial failures are handled gracefully
- [ ] **Usage Tracking**: Test media usage features:
  - [ ] Add media files to projects
  - [ ] View usage data for individual files
  - [ ] Verify usage badges show correct counts
- [ ] **Error Handling**: Test error scenarios:
  - [ ] Upload invalid file types
  - [ ] Upload files that are too large
  - [ ] Test network failure scenarios (if possible)
  - [ ] Verify retry logic works for failed uploads

### 4. Post-Deployment
- [ ] Monitor Cloudflare Pages dashboard for errors
- [ ] Check browser console for any errors
- [ ] Test on different devices/browsers
- [ ] Verify file uploads work correctly
- [ ] Test admin functionality thoroughly

## Environment Variables Required

### Cloudflare Pages Dashboard Settings
Set these in **Cloudflare Pages → Settings → Environment Variables**:

#### Production Environment
```
VITE_ADMIN_USERNAME=your_secure_username
VITE_ADMIN_PASSWORD=your_secure_password
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CLOUDFLARE_ACCOUNT_ID=fa917615d33ac203929027798644acef
VITE_CLOUDFLARE_STREAM_TOKEN=your_stream_token
VITE_CLOUDFLARE_IMAGES_TOKEN=your_images_token
```

#### KV Namespaces (Already configured)
- `CONTENT_KV`: b75bcab3b9df4e639518196d8dc0353d
- `MEDIA_KV`: 94ff64faa5bc4d45aa27bafa0c260a07

## Rollback Plan

If issues occur after deployment:

1. **Immediate**: Revert to previous commit
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Cloudflare Pages**: Use the "Rollback" feature in the dashboard

3. **Database**: KV data is persistent, so no rollback needed

## Monitoring

### Key Metrics to Watch
- [ ] Page load times
- [ ] API response times
- [ ] Error rates in Cloudflare dashboard
- [ ] File upload success rates
- [ ] Admin login success rates
- [ ] **NEW:** Media library load times (should be faster with optimized usage loading)
- [ ] **NEW:** Bulk operation performance (bulk edit/delete should be faster than individual operations)
- [ ] **NEW:** Video upload processing times via Cloudflare Stream

### Alerts to Set Up
- [ ] High error rate alerts
- [ ] Slow response time alerts
- [ ] Failed authentication attempts
- [ ] Storage quota warnings

## Security Considerations

### Current Security Measures
- ✅ Admin authentication required
- ✅ Environment variables not exposed to client
- ✅ File upload restrictions
- ✅ Input validation on forms
- ✅ No sensitive data in client-side code

### Additional Recommendations
- [ ] Set up Cloudflare security rules
- [ ] Enable DDoS protection
- [ ] Monitor for suspicious activity
- [ ] Regular security audits
- [ ] Backup strategy for KV data

## Troubleshooting

### Common Issues
1. **File uploads not working**: Check Cloudflare API token permissions
2. **Admin login failing**: Verify environment variables are set correctly
3. **API errors**: Check Cloudflare Pages Functions logs
4. **Build failures**: Check TypeScript errors and dependencies

### Media Manager Specific Issues
5. **Video uploads failing**: 
   - Check `VITE_CLOUDFLARE_STREAM_TOKEN` is set correctly
   - Verify Cloudflare Stream is enabled for your account
   - Check video file format is supported (MP4, WebM, etc.)
6. **Image uploads failing**:
   - Check `VITE_CLOUDFLARE_IMAGES_TOKEN` is set correctly
   - Verify Cloudflare Images is enabled for your account
7. **Bulk operations failing**:
   - Check `/api/media/bulk` endpoint is deployed
   - Verify MEDIA_KV namespace is properly configured
   - Check Cloudflare Pages Functions logs for bulk operation errors
8. **Usage tracking not working**:
   - Verify media files are being properly linked to projects
   - Check if usage data is being stored in KV correctly
   - Test individual vs bulk usage queries
9. **Performance issues**:
   - Media library should load faster (no more preloading 20 files)
   - Bulk operations should be significantly faster than individual operations
   - If still slow, check Cloudflare KV response times

### Support Resources
- Cloudflare Pages Documentation
- Cloudflare KV Documentation
- Cloudflare Stream/Images Documentation
- Project README.md
- Development Guide
