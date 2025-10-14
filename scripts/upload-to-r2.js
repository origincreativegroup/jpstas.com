#!/usr/bin/env node

/**
 * Easy R2 Upload Script
 * 
 * Upload files to Cloudflare R2 with simple command:
 * npm run r2:upload <local-file-path> <destination-path>
 * 
 * Examples:
 * npm run r2:upload ./image.jpg portfolio/print-studio/image.jpg
 * npm run r2:upload ./video.mp4 videos/demo.mp4
 */

import { execSync } from 'child_process';
import { existsSync, statSync } from 'fs';
import { basename } from 'path';

const BUCKET_NAME = 'jpstas-media';
const PUBLIC_URL_BASE = 'https://media.jpstas.com';

// Get command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
📦 R2 Upload Tool
═══════════════════════════════════════════════════════════════

Usage:
  npm run r2:upload <local-file> [destination-path]

Examples:
  # Upload with auto-generated path
  npm run r2:upload ./my-image.jpg
  → Uploads to: portfolio/my-image.jpg
  → Public URL: https://media.jpstas.com/portfolio/my-image.jpg

  # Upload to specific path
  npm run r2:upload ./photo.jpg portfolio/print-studio/photo.jpg
  → Public URL: https://media.jpstas.com/portfolio/print-studio/photo.jpg

  # Upload video
  npm run r2:upload ./demo.mp4 videos/demo.mp4
  → Public URL: https://media.jpstas.com/videos/demo.mp4

Tips:
  • Use forward slashes (/) for paths
  • File extensions are preserved
  • URLs are automatically copied to clipboard
  • Files are immediately available via CDN

Bucket: ${BUCKET_NAME}
Public URL: ${PUBLIC_URL_BASE}
  `);
  process.exit(0);
}

const localFile = args[0];
const destinationPath = args[1];

// Validate local file exists
if (!existsSync(localFile)) {
  console.error(`❌ Error: File not found: ${localFile}`);
  process.exit(1);
}

// Get file stats
const stats = statSync(localFile);
const fileSizeKB = (stats.size / 1024).toFixed(2);
const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

// Determine destination path
let r2Path;
if (destinationPath) {
  r2Path = destinationPath;
} else {
  // Auto-generate path: portfolio/<filename>
  const filename = basename(localFile);
  r2Path = `portfolio/${filename}`;
}

// Construct full R2 object key
const r2ObjectKey = `${BUCKET_NAME}/${r2Path}`;
const publicUrl = `${PUBLIC_URL_BASE}/${r2Path}`;

console.log(`
📤 Uploading to R2
═══════════════════════════════════════════════════════════════
Local File:   ${localFile}
File Size:    ${fileSizeKB} KB ${fileSizeMB > 1 ? `(${fileSizeMB} MB)` : ''}
Destination:  ${r2Path}
Public URL:   ${publicUrl}
`);

try {
  // Upload using wrangler
  console.log('⏳ Uploading...\n');
  
  const command = `npx wrangler r2 object put ${r2ObjectKey} --file="${localFile}"`;
  execSync(command, { stdio: 'inherit' });
  
  console.log(`
✅ Upload Complete!
═══════════════════════════════════════════════════════════════

🌐 Public URL:
   ${publicUrl}

📋 To use in your site:

   JSON format:
   {
     "src": "${publicUrl}",
     "alt": "Description here"
   }

   HTML format:
   <img src="${publicUrl}" alt="Description" />

   Markdown format:
   ![Description](${publicUrl})

💡 Next steps:
   1. Add the URL to your case study JSON file
   2. Test locally: npm run dev
   3. Build and deploy: npm run build && npm run deploy

`);

  // Try to copy URL to clipboard
  try {
    execSync(`echo "${publicUrl}" | pbcopy`, { stdio: 'ignore' });
    console.log('📎 URL copied to clipboard!\n');
  } catch (e) {
    // Clipboard copy failed - no big deal
  }

} catch (error) {
  console.error(`
❌ Upload Failed
═══════════════════════════════════════════════════════════════

Error: ${error.message}

Troubleshooting:
  • Make sure you're logged in: npx wrangler login
  • Check your internet connection
  • Verify the file path is correct
  • Ensure you have R2 permissions

Need help? Check: https://developers.cloudflare.com/r2/
`);
  process.exit(1);
}

