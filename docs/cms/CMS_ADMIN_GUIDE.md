# CMS Admin Guide

Complete guide for managing content on jpstas.com using Decap CMS.

## Table of Contents

- [Getting Started](#getting-started)
- [Accessing the CMS](#accessing-the-cms)
- [Managing Portfolio Projects](#managing-portfolio-projects)
- [Uploading Media](#uploading-media)
- [Editing Static Pages](#editing-static-pages)
- [Publishing Changes](#publishing-changes)
- [Troubleshooting](#troubleshooting)

---

## Getting Started

### What is the CMS?

The CMS (Content Management System) provides a visual interface at `/admin` to manage all content on your portfolio site without touching code.

### What You Can Manage

- ✅ Portfolio case studies (all 10 projects)
- ✅ Homepage content and featured projects
- ✅ About page content
- ✅ Site settings and SEO
- ✅ Media files (images, videos)

### How It Works

```
Edit content in CMS → Saves to Git → Cloudflare builds → Site updates
```

All changes are version-controlled in Git, so you can always revert if needed.

---

## Accessing the CMS

### URL

Access the CMS at: **https://jpstas.com/admin**

### Authentication

1. Navigate to `https://jpstas.com/admin`
2. Authenticate with Cloudflare Access:
   - Email OTP
   - Or GitHub OAuth (if configured)
3. Once authenticated, you'll see the CMS dashboard

### Dashboard Overview

The CMS dashboard shows:
- **Collections** (Portfolio, Home Page, About, Settings)
- **Media Library** (Browse R2 storage)
- **Workflow** (Draft, In Review, Ready)

---

## Managing Portfolio Projects

### Viewing All Projects

1. Click **Portfolio Projects** in the sidebar
2. You'll see all 10 case studies listed
3. Click any project to edit

### Editing an Existing Project

1. Click the project name
2. Edit any field:
   - **Title** - Project name
   - **Tagline** - Short description
   - **Hero Image** - Main project image
   - **Metrics** - Key stats (3-4 items)
   - **Context** - Problem statement and constraints
   - **Solution** - Approach, features, gallery
   - **Impact** - Results and metrics
   - **Process** - Methodology steps
   - **Reflection** - Key learnings
   - **Related Projects** - Links to related work
3. Click **Save** (saves draft)
4. Click **Publish** to go live

### Adding a New Project

1. Click **New Portfolio Project**
2. Fill in required fields:
   - Slug (URL-friendly, e.g., `my-project`)
   - Title
   - Tagline
   - Hero image
   - Metrics (at least 3)
   - Context
   - Solution
   - Impact
   - Process
3. Click **Publish**

### Gallery Section

The gallery supports:
- **Images** - JPG, PNG, WebP
- **Videos** - Cloudflare Stream IDs (32-char hex)
- **Captions** - Optional descriptions

To add gallery items:
1. Scroll to **Gallery** section
2. Click **Add Gallery Item**
3. Fill in:
   - Media URL (or upload)
   - Alt text (for images)
   - Type (image/video)
   - Caption (optional)
4. Repeat for more items

### Before/After Comparisons

If your project has a before/after comparison:
1. Scroll to **Before & After** section
2. Upload/select before image
3. Upload/select after image
4. Add alt text for each

---

## Uploading Media

### Via Media Library

1. Click **Media** in top navigation
2. Click **Upload**
3. Select files from your computer
4. Files automatically upload to R2
5. Public URLs are generated

### Via Project Editor

While editing a project:
1. Click any image field
2. Click **Upload** or **Choose from library**
3. Select file
4. Image uploads to R2 and URL is inserted

### Media Organization

Files are organized in R2:
```
media.jpstas.com/
  └─ portfolio/
     ├─ project-name/
     │  ├─ hero.jpg
     │  └─ gallery-1.jpg
     └─ uploads/
        └─ misc-file.jpg
```

### Supported File Types

- **Images**: JPG, PNG, GIF, WebP, SVG
- **Videos**: MP4, WebM (or use Cloudflare Stream)
- **Max size**: 50 MB per file

### Image Best Practices

- **Hero images**: 1920x1080 or 1600x900 (16:9)
- **Gallery images**: 1200x800 or similar
- **Compress before upload**: Use 85% quality JPG
- **Descriptive filenames**: `hero-print-studio.jpg` not `img1.jpg`

---

## Editing Static Pages

### Homepage

Edit homepage content:
1. Go to **Home Page** → **Homepage Content**
2. Edit sections:
   - Hero title and subtitle
   - Description text
   - Hero image
   - Featured projects (max 3)
   - Homepage metrics
3. Click **Publish**

Changes appear immediately on homepage after build.

### About Page

Edit about page:
1. Go to **About Page** → **About Page Content**
2. Edit sections:
   - Heading and subheading
   - Bio (Markdown supported)
   - Profile photo
   - Background paragraphs
   - Skills (4 categories)
   - Experience timeline
   - CTA section
3. Click **Publish**

### Site Settings

Edit global settings:
1. Go to **Site Settings** → **General Settings**
2. Edit:
   - Site title and description
   - Author info
   - Social links (LinkedIn, GitHub, Email)
   - SEO defaults
3. Click **Publish**

---

## Publishing Changes

### Workflow States

- **Draft** - Saved but not published
- **In Review** - Optional review step
- **Ready** - Published to Git

### How to Publish

1. Make your changes
2. Click **Save** (creates draft)
3. Review changes
4. Click **Publish**
5. Add commit message (optional)
6. Confirm

### What Happens After Publishing

```
1. Changes commit to Git (main branch)
2. Cloudflare Pages detects commit
3. Site rebuilds automatically
4. Changes live in ~2-3 minutes
```

### Checking Deploy Status

After publishing:
1. Go to Cloudflare Pages dashboard
2. View **Deployments** tab
3. Monitor build progress
4. Check for errors

---

## Troubleshooting

### Can't Access /admin

**Problem**: 404 or access denied

**Solutions**:
- Check you're at correct URL: `https://jpstas.com/admin`
- Clear browser cache and cookies
- Verify Cloudflare Access is configured
- Check you're logged in with authorized email

### Images Not Uploading

**Problem**: Upload fails or hangs

**Solutions**:
- Check file size (max 50 MB)
- Verify file format is supported
- Check internet connection
- Try uploading via R2 CLI as backup:
  ```bash
  npm run r2:upload ./image.jpg portfolio/project/image.jpg
  ```

### Changes Not Appearing on Site

**Problem**: Published but site hasn't updated

**Solutions**:
- Wait 2-3 minutes for build to complete
- Check Cloudflare Pages deployment status
- Verify changes committed to Git
- Clear browser cache: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Check build logs for errors

### Can't See My Edits in CMS

**Problem**: Made changes but they're not in CMS

**Solutions**:
- Pull latest from Git: `git pull origin main`
- Check if someone else edited same file (merge conflict)
- Verify JSON file syntax is valid
- Check browser console for errors

### Media Library Empty

**Problem**: No files showing in media library

**Solutions**:
- Check R2 bucket has files:
  ```bash
  npx wrangler r2 object list jpstas-media
  ```
- Verify worker is deployed:
  ```bash
  npm run cms:deploy
  ```
- Check browser console for API errors
- Verify CORS headers are correct

### Rich Text Editor Issues

**Problem**: Formatting not working in Markdown fields

**Solutions**:
- Use Markdown syntax:
  - `**bold**` for bold
  - `*italic*` for italic
  - `[link](url)` for links
- Click preview to see rendered output
- Check for syntax errors

### Can't Delete Old Projects

**Problem**: Delete button not working

**Solutions**:
- Projects must be deleted from Git manually:
  ```bash
  rm src/data/old-project.json
  git add .
  git commit -m "Remove old project"
  git push
  ```
- Or use file editor to delete and commit

---

## Advanced Tips

### Bulk Operations

For bulk changes:
1. Clone repo locally
2. Edit JSON files directly
3. Commit and push
4. CMS will reflect changes

### Keyboard Shortcuts

- `Ctrl+S` / `Cmd+S` - Save draft
- `Ctrl+P` / `Cmd+P` - Publish
- `Esc` - Close editor

### Markdown Support

Markdown is supported in:
- About page bio
- Project descriptions (if enabled)
- Any field marked "text" or "markdown"

### Custom Media Paths

When uploading via worker:
```javascript
// Default: portfolio/filename.jpg
// Custom: portfolio/project-name/filename.jpg
```

Edit path in `r2-backend.js` if needed.

### Backup

All content is in Git, so backups are automatic:
- View history: `git log`
- Revert changes: `git revert <commit>`
- Restore file: `git checkout <commit> -- path/to/file`

---

## Quick Reference

### Common Tasks

| Task | Steps |
|------|-------|
| Add image to project | Edit project → Gallery → Add → Upload |
| Create new project | Portfolio → New → Fill fields → Publish |
| Update homepage hero | Home Page → Edit → Change title/image → Publish |
| Add featured project | Home Page → Featured Projects → Add → Publish |
| Change about bio | About Page → Edit bio → Publish |
| Upload media | Media → Upload → Select files |

### File Locations

```
src/data/
├─ portfolio projects (*.json)
├─ site/
│  ├─ homepage.json
│  ├─ about.json
│  └─ settings.json
```

### Media URLs

```
https://media.jpstas.com/portfolio/[project]/[filename]
```

### API Endpoints

```
POST /api/cms/media/upload  - Upload file
GET  /api/cms/media/list    - List files
DELETE /api/cms/media/delete - Delete file
```

---

## Getting Help

### Resources

- **Decap CMS Docs**: https://decapcms.org/docs/
- **R2 Documentation**: https://developers.cloudflare.com/r2/
- **Project README**: `/README.md`

### Support

For issues:
1. Check this guide's troubleshooting section
2. Check Cloudflare Pages deployment logs
3. Review browser console for errors
4. Check Git commit history

### Emergency Revert

If something breaks:
```bash
# Revert last commit
git revert HEAD
git push

# Or restore specific file
git checkout HEAD~1 -- src/data/project.json
git commit -m "Restore project.json"
git push
```

Site will rebuild automatically.

---

## Best Practices

### Content

- ✅ Write clear, concise project descriptions
- ✅ Use consistent terminology
- ✅ Include alt text for all images
- ✅ Add captions to gallery images
- ✅ Keep metrics focused and impactful

### Media

- ✅ Compress images before uploading
- ✅ Use descriptive filenames
- ✅ Organize files in project folders
- ✅ Delete unused media
- ✅ Use appropriate image dimensions

### Workflow

- ✅ Save drafts frequently
- ✅ Preview before publishing
- ✅ Write meaningful commit messages
- ✅ Test on staging if available
- ✅ Verify changes after deployment

### Security

- ✅ Keep login credentials secure
- ✅ Log out when done
- ✅ Don't share admin access
- ✅ Review changes before publishing

---

## Changelog

### Version 1.0
- Initial CMS implementation
- Decap CMS with R2 integration
- Portfolio, Homepage, About collections
- Cloudflare Access authentication
- Media library with upload/delete

---

**Last Updated**: January 2025  
**CMS Version**: Decap CMS 3.1.0  
**Maintained By**: John P. Stas

