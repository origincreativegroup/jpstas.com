import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Read the q-manifest to get core and preloader
const manifestPath = join(process.cwd(), 'dist/q-manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));

const core = manifest.core;
const preloader = manifest.preloader;
const stylesheet = manifest.injections.find(i => i.tag === 'link')?.attributes?.href;

// Read index.html
const indexPath = join(process.cwd(), 'dist/index.html');
let html = readFileSync(indexPath, 'utf-8');

// Inject stylesheet
if (stylesheet && !html.includes(stylesheet)) {
  html = html.replace('</head>', `  <link rel="stylesheet" href="${stylesheet}">\n  </head>`);
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
console.log(`  - Preloader: /build/${preloader}`);
console.log(`  - Core: /build/${core}`);

