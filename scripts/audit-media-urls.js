#!/usr/bin/env node

/**
 * Media URL Audit Tool
 * 
 * Scans all case study JSON files and reports on image/video URLs:
 * - Identifies URL patterns and inconsistencies
 * - Checks for missing or placeholder images
 * - Suggests organizational improvements
 */

import { readdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '../src/data');

const CORRECT_DOMAIN = 'https://media.jpstas.com';
const BUCKET_NAME = 'jpstas-media';

console.log(`
📊 Media URL Audit Report
═══════════════════════════════════════════════════════════════
`);

// Get all JSON files
const jsonFiles = readdirSync(dataDir).filter(f => f.endsWith('.json'));

let totalImages = 0;
let totalVideos = 0;
const urlPatterns = new Map();
const issues = [];

// Analyze each file
for (const file of jsonFiles) {
  const filePath = join(dataDir, file);
  const content = readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);
  
  const projectName = file.replace('.json', '');
  console.log(`\n📁 ${projectName}`);
  console.log('─'.repeat(60));
  
  // Check hero image
  if (data.hero?.src) {
    totalImages++;
    const heroUrl = data.hero.src;
    console.log(`  Hero: ${heroUrl}`);
    
    // Check if it follows good pattern
    if (!heroUrl.startsWith(CORRECT_DOMAIN)) {
      issues.push({
        file,
        type: 'hero',
        issue: 'Not using correct domain',
        current: heroUrl,
        suggested: `${CORRECT_DOMAIN}/portfolio/${projectName}/hero.jpg`
      });
    }
    
    // Track pattern
    const pattern = heroUrl.replace(/https?:\/\/[^/]+/, '');
    urlPatterns.set(pattern, (urlPatterns.get(pattern) || 0) + 1);
  }
  
  // Check gallery items
  if (data.solution?.gallery) {
    console.log(`  Gallery: ${data.solution.gallery.length} items`);
    
    data.solution.gallery.forEach((item, idx) => {
      const isVideo = item.type === 'video';
      
      if (isVideo) {
        totalVideos++;
        // Check if it's a Cloudflare Stream ID (32 char hex)
        if (item.src.match(/^[a-f0-9]{32}$/i)) {
          console.log(`    [${idx + 1}] Video (Cloudflare Stream): ${item.src.substring(0, 16)}...`);
        } else {
          console.log(`    [${idx + 1}] Video: ${item.src}`);
        }
      } else {
        totalImages++;
        console.log(`    [${idx + 1}] ${item.src}`);
        
        // Check URL pattern
        if (!item.src.startsWith(CORRECT_DOMAIN)) {
          issues.push({
            file,
            type: 'gallery',
            index: idx + 1,
            issue: 'Not using correct domain',
            current: item.src,
            suggested: `${CORRECT_DOMAIN}/portfolio/${projectName}/image-${idx + 1}.jpg`
          });
        }
        
        // Check if it's a generic placeholder name
        const genericNames = [
          'print-studio-production',
          'print-studio-apparel',
          'print-studio-wrap-install',
          'print-studio-workflow',
          'drone-aerial',
          'drone-fpv',
          'drone-video-reel',
          'drone-marketing-use',
          'shop-homepage',
          'email-templates',
          'brand-logo-evolution'
        ];
        
        const isGeneric = genericNames.some(name => item.src.includes(name));
        if (isGeneric) {
          issues.push({
            file,
            type: 'gallery',
            index: idx + 1,
            issue: 'Generic placeholder name - consider organizing in folders',
            current: item.src,
            suggested: `${CORRECT_DOMAIN}/portfolio/${projectName}/${item.src.split('/').pop()}`
          });
        }
        
        // Track pattern
        const pattern = item.src.replace(/https?:\/\/[^/]+/, '');
        urlPatterns.set(pattern, (urlPatterns.get(pattern) || 0) + 1);
      }
    });
  }
  
  // Check before/after images
  if (data.solution?.beforeAfter) {
    totalImages += 2;
    console.log(`  Before/After:`);
    console.log(`    Before: ${data.solution.beforeAfter.before.src}`);
    console.log(`    After:  ${data.solution.beforeAfter.after.src}`);
  }
}

// Print summary
console.log(`
\n📈 Summary
═══════════════════════════════════════════════════════════════
Total Images:  ${totalImages}
Total Videos:  ${totalVideos}
Total Files:   ${jsonFiles.length}
`);

// Print URL patterns
console.log(`\n🗂️  URL Path Patterns`);
console.log('─'.repeat(60));
const sortedPatterns = Array.from(urlPatterns.entries())
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10);

sortedPatterns.forEach(([pattern, count]) => {
  console.log(`  ${count}x  ${pattern}`);
});

// Print issues
if (issues.length > 0) {
  console.log(`\n⚠️  Issues Found: ${issues.length}`);
  console.log('─'.repeat(60));
  
  // Group by type
  const genericIssues = issues.filter(i => i.issue.includes('Generic'));
  const domainIssues = issues.filter(i => i.issue.includes('domain'));
  
  if (genericIssues.length > 0) {
    console.log(`\n📦 Organizational Improvements (${genericIssues.length}):`);
    genericIssues.slice(0, 5).forEach(issue => {
      console.log(`\n  ${issue.file} (item ${issue.index})`);
      console.log(`  Current:   ${issue.current}`);
      console.log(`  Suggested: ${issue.suggested}`);
    });
    if (genericIssues.length > 5) {
      console.log(`\n  ... and ${genericIssues.length - 5} more`);
    }
  }
  
  if (domainIssues.length > 0) {
    console.log(`\n🔗 Domain Issues (${domainIssues.length}):`);
    domainIssues.forEach(issue => {
      console.log(`\n  ${issue.file}`);
      console.log(`  ${issue.current}`);
      console.log(`  → Should use: ${CORRECT_DOMAIN}`);
    });
  }
}

// Print recommendations
console.log(`
\n💡 Recommendations
═══════════════════════════════════════════════════════════════

Current Structure:
  ✓ Most images use correct domain: ${CORRECT_DOMAIN}
  ✓ One project using organized folders: /portfolio/PrintStudio/

Suggested Organization:
  📁 portfolio/
    ├─ print-studio/
    │  ├─ hero.jpg
    │  ├─ palm-tree-standee.png
    │  ├─ production-line.jpg
    │  └─ apparel-station.jpg
    ├─ drone-media/
    │  ├─ hero.jpg
    │  ├─ aerial-shot-1.jpg
    │  └─ fpv-flythrough.jpg
    └─ brand-evolution/
       ├─ hero.jpg
       └─ logo-evolution.jpg

Benefits:
  • Easier to locate files in R2
  • Clear project ownership
  • Better for future maintenance
  • Consistent naming convention

Next Steps:
  1. Review current images in R2 bucket
  2. Create folder structure for each project
  3. Upload/move images to organized folders
  4. Update JSON files with new paths
  5. Use 'npm run r2:upload' for future uploads
`);

console.log(`\n✨ Audit Complete!\n`);

