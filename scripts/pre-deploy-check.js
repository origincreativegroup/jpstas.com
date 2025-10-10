import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log('🚀 Pre-Deployment Check\n');
console.log('========================\n');

const errors = [];
const warnings = [];

// 1. Check dist directory exists
const distPath = join(process.cwd(), 'dist');
if (!existsSync(distPath)) {
  errors.push('dist directory does not exist - build has not been run');
} else {
  console.log('✅ dist directory exists');
}

// 2. Check critical files
const criticalFiles = [
  'index.html',
  'q-manifest.json',
  'favicon.svg'
];

criticalFiles.forEach(file => {
  const filePath = join(distPath, file);
  if (existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    errors.push(`${file} missing from dist/`);
  }
});

console.log('');

// 3. Validate index.html content
const indexPath = join(distPath, 'index.html');
if (existsSync(indexPath)) {
  const html = readFileSync(indexPath, 'utf-8');
  
  const requiredElements = [
    { name: 'QwikLoader', check: html.includes('__q_context__'), critical: true },
    { name: 'Stylesheet', check: /<link rel="stylesheet"/.test(html), critical: true },
    { name: 'Preloader script', check: /<script type="module"/.test(html), critical: true },
    { name: 'Core script', check: /<script nomodule/.test(html), critical: true },
    { name: 'Root div', check: html.includes('<!--qwik-->'), critical: true },
  ];
  
  console.log('📄 index.html validation:');
  requiredElements.forEach(elem => {
    if (elem.check) {
      console.log(`   ✅ ${elem.name}`);
    } else {
      const msg = `${elem.name} missing from index.html`;
      if (elem.critical) {
        errors.push(msg);
        console.log(`   ❌ ${elem.name}`);
      } else {
        warnings.push(msg);
        console.log(`   ⚠️  ${elem.name}`);
      }
    }
  });
  
  console.log(`   HTML size: ${html.length} bytes\n`);
}

// 4. Check manifest and referenced files
const manifestPath = join(distPath, 'q-manifest.json');
if (existsSync(manifestPath)) {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  
  console.log('📦 Checking manifest files:');
  
  const manifestFiles = [
    { name: 'Core', file: manifest.core },
    { name: 'Preloader', file: manifest.preloader },
    { name: 'QwikLoader', file: manifest.qwikLoader },
  ];
  
  manifestFiles.forEach(({ name, file }) => {
    const filePath = join(distPath, 'build', file);
    if (existsSync(filePath)) {
      const size = readFileSync(filePath, 'utf-8').length;
      console.log(`   ✅ ${name} (${file}): ${size} bytes`);
    } else {
      errors.push(`${name} file (${file}) missing from dist/build/`);
      console.log(`   ❌ ${name} (${file}): NOT FOUND`);
    }
  });
  
  console.log('');
}

// 5. Check assets directory
const assetsPath = join(distPath, 'assets');
if (existsSync(assetsPath)) {
  const fs = await import('fs');
  const files = fs.readdirSync(assetsPath);
  console.log(`✅ assets directory: ${files.length} files\n`);
} else {
  warnings.push('assets directory not found');
}

// 6. Check build directory
const buildPath = join(distPath, 'build');
if (existsSync(buildPath)) {
  const fs = await import('fs');
  const files = fs.readdirSync(buildPath);
  console.log(`✅ build directory: ${files.length} files\n`);
} else {
  errors.push('build directory not found');
}

// Summary
console.log('========================\n');

if (warnings.length > 0) {
  console.log('⚠️  WARNINGS:\n');
  warnings.forEach(w => console.log(`   - ${w}`));
  console.log('');
}

if (errors.length > 0) {
  console.error('❌ PRE-DEPLOYMENT CHECK FAILED\n');
  console.error('ERRORS:\n');
  errors.forEach(e => console.error(`   - ${e}`));
  console.error('\n⛔ DO NOT DEPLOY - Fix errors first!\n');
  process.exit(1);
} else {
  console.log('✅ PRE-DEPLOYMENT CHECK PASSED\n');
  console.log('🚀 Ready to deploy to production!\n');
  process.exit(0);
}

