import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const timestamp = () => new Date().toISOString();
const log = (message) => console.log(`[${timestamp()}] ${message}`);

log('🔧 DEBUG BUILD PROCESS STARTED');
log('================================\n');

// 1. Check environment
log('📋 Environment:');
log(`   Node version: ${process.version}`);
log(`   Platform: ${process.platform}`);
log(`   CWD: ${process.cwd()}`);
log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set'}\n`);

// 2. Check if build has run
const distPath = join(process.cwd(), 'dist');
const manifestPath = join(distPath, 'q-manifest.json');
const indexPath = join(distPath, 'index.html');

log('📂 Build Output Check:');
log(`   dist exists: ${existsSync(distPath)}`);
log(`   q-manifest.json exists: ${existsSync(manifestPath)}`);
log(`   index.html exists: ${existsSync(indexPath)}\n`);

if (!existsSync(manifestPath)) {
  log('❌ ERROR: Build has not been run yet. Run "npm run build" first.\n');
  process.exit(1);
}

// 3. Read and analyze manifest
log('📦 Analyzing q-manifest.json:');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
log(`   Version: ${manifest.version}`);
log(`   Build mode: ${manifest.options?.buildMode}`);
log(`   Core: ${manifest.core}`);
log(`   Preloader: ${manifest.preloader}`);
log(`   QwikLoader: ${manifest.qwikLoader}`);
log(`   Manifest hash: ${manifest.manifestHash}\n`);

// 4. Check if files exist
log('📁 Checking build artifacts:');
const checkFile = (path, name) => {
  const fullPath = join(distPath, path);
  const exists = existsSync(fullPath);
  const size = exists ? readFileSync(fullPath, 'utf-8').length : 0;
  log(`   ${exists ? '✅' : '❌'} ${name}: ${exists ? `${size} bytes` : 'NOT FOUND'}`);
  return exists;
};

const coreExists = checkFile(`build/${manifest.core}`, 'Core');
const preloaderExists = checkFile(`build/${manifest.preloader}`, 'Preloader');
const qwikLoaderExists = checkFile(`build/${manifest.qwikLoader}`, 'QwikLoader');
const indexExists = checkFile('index.html', 'index.html');

log('\n');

// 5. Analyze index.html if it exists
if (indexExists) {
  log('📄 Analyzing index.html:');
  const html = readFileSync(indexPath, 'utf-8');
  
  const checks = {
    'QwikLoader inline script': html.includes('qwikloader') || html.includes('__q_context__'),
    'Stylesheet link': /<link rel="stylesheet"/.test(html),
    'Preloader script': html.includes(manifest.preloader),
    'Core script': html.includes(manifest.core),
    'Root div with qwik comment': html.includes('<!--qwik-->'),
    'q:container attribute': html.includes('q:container'),
    'q:base attribute': html.includes('q:base'),
  };
  
  for (const [check, passed] of Object.entries(checks)) {
    log(`   ${passed ? '✅' : '❌'} ${check}`);
  }
  
  log(`\n   Total HTML size: ${html.length} bytes`);
  log(`   Lines: ${html.split('\n').length}\n`);
}

// 6. Test reading QwikLoader content
if (qwikLoaderExists) {
  log('🔍 QwikLoader Content Check:');
  const qwikLoaderPath = join(distPath, 'build', manifest.qwikLoader);
  const qwikLoaderContent = readFileSync(qwikLoaderPath, 'utf-8');
  log(`   Size: ${qwikLoaderContent.length} bytes`);
  log(`   Contains '__q_context__': ${qwikLoaderContent.includes('__q_context__')}`);
  log(`   Contains 'qwikevents': ${qwikLoaderContent.includes('qwikevents')}`);
  log(`   First 100 chars: ${qwikLoaderContent.substring(0, 100)}...\n`);
}

// 7. Simulate post-build script
log('🔄 Simulating post-build.js logic:');
try {
  const testHtml = readFileSync(indexPath, 'utf-8');
  const qwikLoaderPath = join(distPath, 'build', manifest.qwikLoader);
  const qwikLoaderContent = readFileSync(qwikLoaderPath, 'utf-8');
  
  let modifiedHtml = testHtml;
  
  // Check if qwikloader is already present
  if (modifiedHtml.includes('qwikloader') || modifiedHtml.includes('__q_context__')) {
    log('   ✅ QwikLoader already present in HTML');
  } else {
    log('   ⚠️  QwikLoader NOT present - needs injection');
    
    // Try injection
    if (modifiedHtml.includes('</head>')) {
      modifiedHtml = modifiedHtml.replace('</head>', `  <script>${qwikLoaderContent}</script>\n  </head>`);
      log('   ✅ Injection would succeed');
    } else {
      log('   ❌ No </head> tag found for injection!');
    }
  }
  
  // Check preloader
  if (modifiedHtml.includes(manifest.preloader)) {
    log('   ✅ Preloader script reference present');
  } else {
    log('   ⚠️  Preloader script reference MISSING');
  }
  
  // Check core
  if (modifiedHtml.includes(manifest.core)) {
    log('   ✅ Core script reference present');
  } else {
    log('   ⚠️  Core script reference MISSING');
  }
  
} catch (error) {
  log(`   ❌ Error during simulation: ${error.message}`);
}

log('\n');

// 8. Generate report
const report = {
  timestamp: timestamp(),
  nodeVersion: process.version,
  platform: process.platform,
  buildExists: existsSync(distPath),
  manifestExists: existsSync(manifestPath),
  files: {
    core: coreExists,
    preloader: preloaderExists,
    qwikLoader: qwikLoaderExists,
    indexHtml: indexExists
  },
  manifest: {
    core: manifest.core,
    preloader: manifest.preloader,
    qwikLoader: manifest.qwikLoader,
    buildMode: manifest.options?.buildMode
  }
};

const reportPath = join(process.cwd(), 'build-debug-report.json');
writeFileSync(reportPath, JSON.stringify(report, null, 2));
log(`📊 Debug report saved to: ${reportPath}\n`);

log('✅ DEBUG BUILD PROCESS COMPLETED\n');

