import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Vite plugin to inject QwikLoader inline script during build
 * This ensures the QwikLoader is always present in the HTML output
 */
export function qwikLoaderPlugin() {
  return {
    name: 'qwik-loader-injector',
    enforce: 'post',
    
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        // Only run during build, not dev
        if (!ctx.bundle) {
          return html;
        }
        
        try {
          // Check if qwikLoader is already injected
          if (html.includes('__q_context__') || html.includes('qwikloader')) {
            console.log('✅ QwikLoader already present in HTML');
            return html;
          }
          
          // Find the manifest in the bundle
          let manifestContent = null;
          for (const [fileName, chunk] of Object.entries(ctx.bundle)) {
            if (fileName === 'q-manifest.json' && chunk.type === 'asset') {
              manifestContent = chunk.source;
              break;
            }
          }
          
          if (!manifestContent) {
            console.warn('⚠️  Could not find q-manifest.json in bundle');
            return html;
          }
          
          const manifest = typeof manifestContent === 'string' 
            ? JSON.parse(manifestContent) 
            : manifestContent;
          
          if (!manifest.qwikLoader) {
            console.warn('⚠️  qwikLoader not found in manifest');
            return html;
          }
          
          // Find the qwikLoader in the bundle
          let qwikLoaderContent = null;
          const qwikLoaderFileName = `build/${manifest.qwikLoader}`;
          
          for (const [fileName, chunk] of Object.entries(ctx.bundle)) {
            if (fileName === qwikLoaderFileName) {
              qwikLoaderContent = chunk.type === 'chunk' ? chunk.code : chunk.source;
              break;
            }
          }
          
          if (!qwikLoaderContent) {
            console.warn(`⚠️  Could not find ${manifest.qwikLoader} in bundle`);
            return html;
          }
          
          // Inject the qwikLoader inline in the head
          const qwikLoaderScript = `<script>${qwikLoaderContent}</script>`;
          const modifiedHtml = html.replace('</head>', `  ${qwikLoaderScript}\n  </head>`);
          
          console.log(`✅ Injected QwikLoader (${qwikLoaderContent.length} bytes) into HTML`);
          
          return modifiedHtml;
          
        } catch (error) {
          console.error('❌ Error in qwik-loader-plugin:', error.message);
          // Return original HTML on error to avoid breaking the build
          return html;
        }
      }
    }
  };
}

