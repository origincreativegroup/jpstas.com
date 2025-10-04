# 🐛 Debugging Guide

## Overview

A comprehensive debugging system has been integrated throughout the application to help identify and resolve issues, especially with file interactions, media management, and API calls.

## Quick Start

### Viewing Debug Logs

1. **Open your browser's Developer Console** (F12 or Cmd+Option+I)
2. **All debug logs are automatically enabled in development mode**
3. **Color-coded logs** make it easy to identify different operations:
   - 🎬 **Purple** - Media operations (upload, delete, update, select)
   - ⬆️ **Green** - Upload operations (start, progress, complete)
   - 🌐 **Amber** - API requests and responses
   - 🔄 **Pink** - State changes
   - 📁 **Violet** - File operations (read, validate)
   - ⚛️ **Cyan** - Component lifecycle (mount, unmount)

### Example Debug Output

```
🎬 [12:34:56] [MEDIA] Adding media file to context
📦 Data: { id: "abc123", name: "photo.jpg", type: "image/jpeg", size: 245678 }

⬆️ [12:34:57] [UPLOAD] Upload progress
📦 Data: { file: "photo.jpg", progress: 50 }

🌐 [12:34:58] [API] POST /api/upload - 200
📦 Data: { fileName: "photo.jpg", status: 200, fileId: "abc123" }

⏱️  Completed: upload:photo.jpg (1234.56ms)
```

## Global Debug API

The debug utility is available globally in development mode via `window.debug`:

### Basic Usage

```javascript
// In browser console
debug.media.upload('Testing upload', { fileName: 'test.jpg' })
debug.api.request('GET /api/media')
debug.state.update('Testing state change', { count: 5 })
```

### Available Categories

```javascript
debug.media.*      // Media operations
debug.content.*    // Content/CMS operations
debug.upload.*     // File upload tracking
debug.api.*        // API requests/responses
debug.state.*      // State management changes
debug.file.*       // File validation/reading
debug.component.*  // Component lifecycle
debug.log()        // General logging
debug.info()       // Informational messages
debug.warn()       // Warnings
debug.error()      // Errors with stack traces
```

### Performance Tracking

```javascript
// Start a timer
debug.perf.start('my-operation')

// ... do some work ...

// End timer and log duration
debug.perf.end('my-operation')
// Logs: ⏱️  Completed: my-operation (123.45ms)
```

### Configuration

```javascript
// Enable/disable debug mode
debug.config.enable()
debug.config.disable()

// Enable/disable specific categories
debug.config.enableCategory('media')
debug.config.disableCategory('upload')

// Show stack traces on errors
debug.config.showStack(true)
```

## Debugging Specific Areas

### Media Library Debugging

**What's being tracked:**
- ✅ Component mount/unmount
- ✅ File selection (single, multiple, range selection)
- ✅ File uploads (start, progress, complete)
- ✅ File deletion (single and bulk)
- ✅ Metadata updates
- ✅ Keyboard shortcuts (Esc, Ctrl+A, Delete, Ctrl+D)
- ✅ Drag & drop operations

**How to test:**
1. Open `/admin/media`
2. Open browser console
3. Try uploading, selecting, or deleting files
4. Watch color-coded logs in console

### Project Form Debugging

**What's being tracked:**
- ✅ MediaPicker opening/closing
- ✅ File selection from library
- ✅ Media reordering (drag & drop)
- ✅ Project save operations
- ✅ Form validation

**How to test:**
1. Open `/admin` and click "Add Project"
2. Open browser console
3. Click "Browse Media Library"
4. Select media and observe logs

### File Upload Debugging

**What's being tracked:**
- ✅ File validation (size, type, count)
- ✅ Upload start
- ✅ Upload progress (10% increments)
- ✅ API calls to `/api/upload`
- ✅ Upload completion/failure
- ✅ Performance timing

**How to test:**
1. Drag files into any upload zone
2. Watch console for:
   - File validation logs
   - Progress updates
   - API request/response logs
   - Performance timing

### API Request Debugging

**Every API call is automatically logged:**
- Request method and URL
- Request body/params
- Response status
- Response data
- Duration in milliseconds

**Example:**
```
🌐 [API] POST /api/upload
📦 Data: { fileName: "test.jpg", fileSize: 123456, fileType: "image/jpeg" }

🌐 [API] POST /api/upload - 200
📦 Data: { fileName: "test.jpg", status: 200, fileId: "abc123" }

⏱️  Completed: API: POST /api/upload (847.32ms)
```

### State Management Debugging

**What's being tracked:**
- Media library state updates
- Selection changes
- Bulk operation results

**Example:**
```
🔄 [STATE] Media state updated
📦 Data: { totalFiles: 25 }

🔄 [STATE] Bulk deleted from state
📦 Data: { removedCount: 3, totalFiles: 22 }
```

## Common Debug Scenarios

### Scenario 1: Upload Not Working

**Debug steps:**
1. Open console before uploading
2. Look for:
   ```
   📁 [FILE] Validating files
   ⬆️ [UPLOAD] Starting file upload
   🌐 [API] POST /api/upload
   ```
3. Check for error logs (red text with ❌)
4. Note the error message and stack trace

### Scenario 2: Files Not Appearing in Library

**Debug steps:**
1. Look for:
   ```
   🎬 [MEDIA] Adding media file to context
   🔄 [STATE] Media state updated
   ```
2. Check if `refreshMedia` was called:
   ```
   🎬 [MEDIA] Refreshing media library
   🌐 [API] GET /api/media
   ```
3. Verify API response contains files

### Scenario 3: Delete Not Working

**Debug steps:**
1. Look for:
   ```
   🎬 [MEDIA] Removing media file
   🌐 [API] DELETE /api/upload?id=...&type=...
   ```
2. Check API response status
3. Look for state update:
   ```
   🔄 [STATE] Media removed from state
   ```

### Scenario 4: Slow Performance

**Debug steps:**
1. Look for performance timers:
   ```
   ⏱️  Started: upload:file.jpg
   ⏱️  Completed: upload:file.jpg (5432.10ms)
   ```
2. Identify operations taking >1000ms
3. Check API response times

## Advanced Debugging

### Network Tab Integration

1. Open Developer Tools → Network tab
2. Debug logs include `requestId` for correlating with network requests
3. Compare debug log timing with network waterfall

### Filtering Logs

**In browser console:**
```javascript
// Only show media operations
debug.config.disableCategory('upload')
debug.config.disableCategory('api')
debug.config.disableCategory('state')

// Re-enable all
debug.config.enableCategory('upload')
debug.config.enableCategory('api')
debug.config.enableCategory('state')
```

### Export Debug Logs

**Right-click in console → Save as...**
- Saves all console output to a file
- Useful for sharing with developers or creating bug reports

## Debugging Checklist

When reporting issues, include:

- [ ] **Console logs** - Copy relevant debug output
- [ ] **Network tab** - Screenshot of failed requests
- [ ] **Steps to reproduce** - Exact steps that caused the issue
- [ ] **Browser/OS** - Chrome 120, macOS 14, etc.
- [ ] **Environment** - Development or production
- [ ] **Error messages** - Full error text including stack trace

## Tips & Tricks

### 1. Filter Console by Category

Type `[MEDIA]` in console filter to see only media operations

### 2. Pause on Exceptions

Developer Tools → Sources → Pause on exceptions
- Automatically breaks when errors occur
- Shows exact line of code that failed

### 3. Monitor Specific Operations

```javascript
// Watch for a specific file
const fileId = 'abc123'
debug.media.select('Watching file', { id: fileId })

// Monitor all API calls to a specific endpoint
debug.api.request('Monitoring /api/upload')
```

### 4. Performance Profiling

```javascript
// Start Chrome DevTools Performance recording
// Perform operations
// Stop recording
// Check debug.perf timings alongside Chrome profile
```

## Production Mode

**Debug logs are automatically disabled in production** to:
- Reduce bundle size
- Prevent exposing internal logic
- Improve performance

To enable in production (emergency debugging):
```javascript
// In browser console
if (window.debug) {
  window.debug.config.enable()
}
```

## Files with Debugging

### Core Components
- ✅ `src/context/MediaContext.tsx` - All media operations
- ✅ `src/components/FileUpload.tsx` - File upload and validation
- ✅ `src/pages/MediaLibraryEnhanced.tsx` - Media library UI and interactions

### Utilities
- ✅ `src/utils/debug.ts` - Debug utility (this system)

### Next to Add Debugging
- ⏳ `src/components/MediaPicker.tsx`
- ⏳ `src/pages/Admin.tsx` (ProjectForm)
- ⏳ `src/context/ContentContext.tsx`

## Support

If you encounter issues:
1. Check console for debug logs
2. Look for error messages (❌)
3. Note the category and operation
4. Check API response status codes
5. Verify file/network state

**Debug mode is your friend! 🐛✨**
