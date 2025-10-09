import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Read the q-manifest to get core, preloader, and qwikLoader
const manifestPath = join(process.cwd(), 'dist/q-manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));

const core = manifest.core;
const preloader = manifest.preloader;
const qwikLoader = manifest.qwikLoader;
const stylesheet = manifest.injections.find(i => i.tag === 'link')?.attributes?.href;

// Read the qwikLoader content to inline it
const qwikLoaderPath = join(process.cwd(), 'dist/build', qwikLoader);
const qwikLoaderContent = readFileSync(qwikLoaderPath, 'utf-8');

// Read index.html
const indexPath = join(process.cwd(), 'dist/index.html');
let html = readFileSync(indexPath, 'utf-8');

// Inject stylesheet
if (stylesheet && !html.includes(stylesheet)) {
  html = html.replace('</head>', `  <link rel="stylesheet" href="${stylesheet}">\n  </head>`);
}

// Inject inline qwikLoader script in the head (critical for Qwik to work)
if (!html.includes('qwikloader')) {
  html = html.replace('</head>', `  <script>${qwikLoaderContent}</script>\n  </head>`);
}

// Inject Qwik scripts before closing body tag
const scripts = `  <script type="module" src="/build/${preloader}"></script>
  <script nomodule src="/build/${core}"></script>
`;

if (!html.includes(preloader)) {
  html = html.replace('</body>', `${scripts}</body>`);
}

// Write back
writeFileSync(indexPath, html);
console.log('✓ Injected Qwik scripts into index.html');
console.log(`  - Stylesheet: ${stylesheet}`);
console.log(`  - QwikLoader: inlined (${qwikLoaderContent.length} bytes)`);
console.log(`  - Preloader: /build/${preloader}`);
console.log(`  - Core: /build/${core}`);

