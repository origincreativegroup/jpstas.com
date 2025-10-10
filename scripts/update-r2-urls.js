#!/usr/bin/env node

/**
 * Update R2 URLs to Custom Domain
 *
 * This script replaces all R2 public URLs with the custom domain.
 *
 * Before: https://fa917615d33ac203929027798644acef.r2.cloudflarestorage.com/jpstas-media/image.jpg
 * After:  https://media.jpstas.com/image.jpg
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Configuration
const OLD_URL_BASE = 'https://fa917615d33ac203929027798644acef.r2.cloudflarestorage.com/jpstas-media';
const NEW_URL_BASE = 'https://media.jpstas.com';

// File patterns to search and replace
const FILE_PATTERNS = [
  'src/**/*.json',
  'src/**/*.ts',
  'src/**/*.tsx',
  'src/**/*.js',
  'src/**/*.jsx',
];

// Files to exclude
const EXCLUDE_PATTERNS = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/.next/**',
];

console.log('🔍 Finding files with R2 URLs...\n');

// Find all matching files
let allFiles = [];
for (const pattern of FILE_PATTERNS) {
  const files = globSync(pattern, {
    cwd: rootDir,
    ignore: EXCLUDE_PATTERNS,
    absolute: true,
  });
  allFiles = [...allFiles, ...files];
}

// Remove duplicates
allFiles = [...new Set(allFiles)];

console.log(`Found ${allFiles.length} files to check\n`);

let totalReplacements = 0;
let filesModified = 0;

// Process each file
for (const filePath of allFiles) {
  try {
    const content = readFileSync(filePath, 'utf-8');

    // Check if file contains old URL
    if (!content.includes(OLD_URL_BASE)) {
      continue;
    }

    // Count occurrences
    const matches = content.match(new RegExp(OLD_URL_BASE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'));
    const count = matches ? matches.length : 0;

    // Replace all occurrences
    const newContent = content.replace(
      new RegExp(OLD_URL_BASE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      NEW_URL_BASE
    );

    // Write back to file
    writeFileSync(filePath, newContent, 'utf-8');

    // Show what was updated
    const relativePath = filePath.replace(rootDir + '/', '');
    console.log(`✅ ${relativePath}`);
    console.log(`   Replaced ${count} URL${count > 1 ? 's' : ''}\n`);

    totalReplacements += count;
    filesModified++;

  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

console.log('━'.repeat(60));
console.log(`\n✨ Update Complete!\n`);
console.log(`📊 Summary:`);
console.log(`   • Files modified: ${filesModified}`);
console.log(`   • Total URLs updated: ${totalReplacements}`);
console.log(`   • Old URL: ${OLD_URL_BASE}`);
console.log(`   • New URL: ${NEW_URL_BASE}\n`);

if (filesModified > 0) {
  console.log('📝 Next steps:');
  console.log('   1. Review the changes: git diff');
  console.log('   2. Test the site: npm run dev');
  console.log('   3. Build and verify: npm run build');
  console.log('   4. Commit changes: git add . && git commit -m "Update R2 URLs to custom domain"');
  console.log('   5. Deploy: git push\n');
} else {
  console.log('ℹ️  No files needed updating.\n');
}
