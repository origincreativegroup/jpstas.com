# Media Upload Guide

## 🎥 New Upload Features

Your portfolio now supports **image and video uploads** with a complete media management system! Here's everything you need to know.

## ✨ What's New

### 1. File Upload System
- **Drag & Drop Interface**: Simply drag files onto the upload area
- **Multiple File Support**: Upload multiple images/videos at once
- **Progress Tracking**: Real-time upload progress with visual feedback
- **File Validation**: Automatic type and size checking

### 2. Supported Media Types
**Images:**
- JPEG/JPG
- PNG
- GIF
- WebP
- SVG

**Videos:**
- MP4
- WebM
- QuickTime (MOV)
- AVI

**File Size Limit:** 10MB per file

### 3. Media Gallery Features
- **Lightbox Viewing**: Click any media to view full-screen
- **Video Playback**: Videos play with native controls
- **Navigation**: Arrow keys and click navigation between media
- **Captions**: Add descriptive text for each image/video
- **Responsive Design**: Works perfectly on all devices

## 🚀 How to Use

### Uploading Media

1. **Access Admin Panel**: Go to `/admin` in development mode
2. **Edit/Create Project**: Click "Add Project" or "Edit" on existing project
3. **Upload Files**: 
   - Drag files onto the upload area, OR
   - Click "Choose Files" to browse your computer
4. **Add Captions**: Click on each uploaded file to add descriptive text
5. **Save Project**: Click "Create Project" or "Update Project"

### Managing Media

- **Preview**: Hover over media to see preview controls
- **Remove**: Click the trash icon to delete unwanted files
- **Edit Captions**: Click the caption field to add/update descriptions
- **Reorder**: Media appears in the order you upload it

### Viewing Media

- **Portfolio Page**: All media displays in beautiful galleries
- **Case Study View**: Click any project to see detailed media galleries
- **Lightbox Mode**: Click any media for full-screen viewing
- **Video Controls**: Videos have play/pause/volume controls

## 🛠 Technical Details

### File Storage
- **Current Setup**: Files are logged and URLs are generated
- **Production Ready**: Easy to integrate with cloud storage (AWS S3, Cloudinary, etc.)
- **Security**: File type validation and size limits prevent abuse

### API Endpoints
- `POST /api/upload` - Upload new files
- `DELETE /api/upload?filename=...` - Delete files
- `GET /api/content?type=projects` - Get project data with media

### File Structure
```
functions/
  api/
    upload.ts          # File upload API
src/
  components/
    FileUpload.tsx     # Upload component with drag-and-drop
    ImageGallery.tsx   # Media gallery (images + videos)
```

## 🎨 Customization

### Styling
- Modify upload area appearance in `FileUpload.tsx`
- Customize gallery layout in `ImageGallery.tsx`
- Update admin interface styling in `Admin.tsx`

### File Limits
- Change size limits in `functions/api/upload.ts`
- Modify accepted file types in the same file
- Update validation in `FileUpload.tsx`

### Cloud Storage Integration
To connect with real cloud storage:

1. **Update Upload API**: Replace the mock upload in `functions/api/upload.ts`
2. **Add Storage Service**: Integrate with AWS S3, Cloudinary, or similar
3. **Update URLs**: Ensure uploaded files return proper public URLs

## 📱 Mobile Support

- **Touch-Friendly**: Upload area works with touch devices
- **Responsive Galleries**: Media adapts to screen size
- **Mobile Navigation**: Swipe gestures in lightbox mode
- **Fast Loading**: Optimized for mobile networks

## 🔒 Security Features

- **File Type Validation**: Only allowed formats accepted
- **Size Limits**: Prevents large file uploads
- **MIME Type Checking**: Validates actual file content
- **Error Handling**: Graceful failure with user feedback

## 🚀 Next Steps

1. **Test Uploads**: Try uploading different file types
2. **Add Real Media**: Replace placeholder images with your actual work
3. **Cloud Storage**: Set up real file storage for production
4. **Optimize Images**: Consider adding image compression
5. **Video Optimization**: Add video compression for web delivery

## 🐛 Troubleshooting

### Common Issues
- **Upload Fails**: Check file size and type
- **Images Don't Show**: Verify file URLs are correct
- **Videos Don't Play**: Ensure browser supports the format
- **Admin Not Loading**: Check that you're in development mode

### Getting Help
- Check browser console for error messages
- Verify file permissions and paths
- Ensure all dependencies are installed
- Test with different file types and sizes

---

Your portfolio now has professional-grade media management! Upload your best work and create stunning visual case studies. 🎨✨
