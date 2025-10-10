import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const REQUIRED_ELEMENTS = {
  qwikLoader: {
    pattern: /<script>.*__q_context__.*<\/script>/is,
    description: 'QwikLoader inline script',
    critical: true
  },
  stylesheet: {
    pattern: /<link rel="stylesheet" href="\/assets\/.*\.css">/,
    description: 'Stylesheet link',
    critical: true
  },
  preloader: {
    pattern: /<script type="module" src="\/build\/q-.*\.js"><\/script>/,
    description: 'Qwik preloader module',
    critical: true
  },
  core: {
    pattern: /<script nomodule src="\/build\/q-.*\.js"><\/script>/,
    description: 'Qwik core script',
    critical: true
  },
  rootDiv: {
    pattern: /<div id="root"><!--qwik--><\/div>/,
    description: 'Root div with qwik comment',
    critical: true
  }
};

console.log('🔍 Validating build output...\n');

// Check if dist directory exists
const distPath = join(process.cwd(), 'dist');
if (!existsSync(distPath)) {
  console.error('❌ ERROR: dist directory does not exist!');
  console.error('   Run "npm run build" first.\n');
  process.exit(1);
}

// Check if index.html exists
const indexPath = join(distPath, 'index.html');
if (!existsSync(indexPath)) {
  console.error('❌ ERROR: dist/index.html does not exist!');
  console.error('   Build may have failed.\n');
  process.exit(1);
}

// Read index.html
const html = readFileSync(indexPath, 'utf-8');

console.log('📄 Analyzing dist/index.html...\n');
console.log(`   File size: ${html.length} bytes\n`);

// Validate each required element
let hasErrors = false;
let hasCriticalErrors = false;

for (const [key, check] of Object.entries(REQUIRED_ELEMENTS)) {
  const found = check.pattern.test(html);
  const status = found ? '✅' : (check.critical ? '❌' : '⚠️');
  const label = found ? 'FOUND' : (check.critical ? 'MISSING' : 'OPTIONAL');
  
  console.log(`${status} ${check.description}: ${label}`);
  
  if (!found) {
    hasErrors = true;
    if (check.critical) {
      hasCriticalErrors = true;
    }
  }
}

console.log('\n');

// Check for qwik-specific attributes
const hasQwikContainer = html.includes('q:container');
const hasQwikBase = html.includes('q:base');
const hasQwikVersion = html.includes('q:version');

console.log('🔧 Qwik Attributes:');
console.log(`   ${hasQwikContainer ? '✅' : '⚠️'} q:container`);
console.log(`   ${hasQwikBase ? '✅' : '⚠️'} q:base`);
console.log(`   ${hasQwikVersion ? '✅' : '⚠️'} q:version`);

console.log('\n');

// Check manifest
const manifestPath = join(distPath, 'q-manifest.json');
if (existsSync(manifestPath)) {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  console.log('📦 Qwik Manifest:');
  console.log(`   Core: ${manifest.core}`);
  console.log(`   Preloader: ${manifest.preloader}`);
  console.log(`   QwikLoader: ${manifest.qwikLoader}`);
  console.log(`   Bundles: ${Object.keys(manifest.bundles || {}).length}`);
  
  // Verify files exist
  const corePath = join(distPath, 'build', manifest.core);
  const preloaderPath = join(distPath, 'build', manifest.preloader);
  const qwikLoaderPath = join(distPath, 'build', manifest.qwikLoader);
  
  console.log('\n   File existence:');
  console.log(`   ${existsSync(corePath) ? '✅' : '❌'} ${manifest.core}`);
  console.log(`   ${existsSync(preloaderPath) ? '✅' : '❌'} ${manifest.preloader}`);
  console.log(`   ${existsSync(qwikLoaderPath) ? '✅' : '❌'} ${manifest.qwikLoader}`);
} else {
  console.log('⚠️  q-manifest.json not found');
}

console.log('\n');

// Summary
if (hasCriticalErrors) {
  console.error('❌ VALIDATION FAILED: Critical elements are missing!');
  console.error('   The site will show a white screen in production.\n');
  process.exit(1);
} else if (hasErrors) {
  console.warn('⚠️  VALIDATION WARNING: Some optional elements are missing.');
  console.log('   The site may work but could have issues.\n');
  process.exit(0);
} else {
  console.log('✅ VALIDATION PASSED: All required elements are present!\n');
  process.exit(0);
}

