import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log('\n🔧 Post-Build Script: Injecting Qwik Scripts\n');

try {
  // Read the q-manifest to get core, preloader, and qwikLoader
  const manifestPath = join(process.cwd(), 'dist/q-manifest.json');
  
  if (!existsSync(manifestPath)) {
    throw new Error('q-manifest.json not found in dist/. Build may have failed.');
  }
  
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  
  const core = manifest.core;
  const preloader = manifest.preloader;
  const qwikLoader = manifest.qwikLoader;
  const stylesheet = manifest.injections.find(i => i.tag === 'link')?.attributes?.href;
  
  if (!core || !preloader || !qwikLoader) {
    throw new Error('Manifest is missing required fields (core, preloader, or qwikLoader)');
  }
  
  // Read the qwikLoader content to inline it
  const qwikLoaderPath = join(process.cwd(), 'dist/build', qwikLoader);
  
  if (!existsSync(qwikLoaderPath)) {
    throw new Error(`QwikLoader file not found: ${qwikLoaderPath}`);
  }
  
  const qwikLoaderContent = readFileSync(qwikLoaderPath, 'utf-8');
  
  if (qwikLoaderContent.length === 0) {
    throw new Error('QwikLoader content is empty');
  }
  
  // Read index.html
  const indexPath = join(process.cwd(), 'dist/index.html');
  
  if (!existsSync(indexPath)) {
    throw new Error('index.html not found in dist/');
  }
  
  let html = readFileSync(indexPath, 'utf-8');
  const originalHtml = html;
  
  // Inject stylesheet
  if (stylesheet && !html.includes(stylesheet)) {
    html = html.replace('</head>', `  <link rel="stylesheet" href="${stylesheet}">\n  </head>`);
    console.log(`✅ Injected stylesheet: ${stylesheet}`);
  } else if (stylesheet) {
    console.log(`⏭️  Stylesheet already present: ${stylesheet}`);
  }
  
  // Inject inline qwikLoader script in the head (critical for Qwik to work)
  if (!html.includes('__q_context__')) {
    if (!html.includes('</head>')) {
      throw new Error('No </head> tag found in HTML - cannot inject QwikLoader');
    }
    html = html.replace('</head>', `  <script>${qwikLoaderContent}</script>\n  </head>`);
    console.log(`✅ Injected QwikLoader: ${qwikLoaderContent.length} bytes (inline)`);
  } else {
    console.log(`⏭️  QwikLoader already present`);
  }
  
  // Inject Qwik scripts before closing body tag
  const scripts = `  <script type="module" src="/build/${preloader}"></script>
  <script nomodule src="/build/${core}"></script>
`;
  
  if (!html.includes(preloader)) {
    if (!html.includes('</body>')) {
      throw new Error('No </body> tag found in HTML - cannot inject scripts');
    }
    html = html.replace('</body>', `${scripts}</body>`);
    console.log(`✅ Injected Preloader: /build/${preloader}`);
    console.log(`✅ Injected Core: /build/${core}`);
  } else {
    console.log(`⏭️  Preloader and Core scripts already present`);
  }
  
  // Only write if changes were made
  if (html !== originalHtml) {
    writeFileSync(indexPath, html);
    console.log(`\n✅ Successfully updated index.html (${html.length} bytes)`);
  } else {
    console.log(`\n✅ No changes needed - index.html already has all scripts`);
  }
  
  // Final verification
  const finalHtml = readFileSync(indexPath, 'utf-8');
  const checks = {
    qwikLoader: finalHtml.includes('__q_context__'),
    preloader: finalHtml.includes(preloader),
    core: finalHtml.includes(core),
  };
  
  console.log('\n🔍 Verification:');
  console.log(`   ${checks.qwikLoader ? '✅' : '❌'} QwikLoader present`);
  console.log(`   ${checks.preloader ? '✅' : '❌'} Preloader present`);
  console.log(`   ${checks.core ? '✅' : '❌'} Core present`);
  
  if (!checks.qwikLoader || !checks.preloader || !checks.core) {
    throw new Error('Verification failed - not all scripts were injected correctly');
  }
  
  console.log('\n✅ Post-build script completed successfully\n');
  
} catch (error) {
  console.error('\n❌ POST-BUILD SCRIPT FAILED\n');
  console.error(`Error: ${error.message}\n`);
  console.error('Stack trace:');
  console.error(error.stack);
  console.error('\n⚠️  Build artifacts may be incomplete. Do not deploy!\n');
  process.exit(1);
}

