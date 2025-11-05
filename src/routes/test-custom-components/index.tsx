/**
 * Test Page for Custom Cloudflare Components
 *
 * This page shows the components working directly (not through Builder.io)
 * so you can verify they work before setting up Builder.io visual editor
 */

import { component$ } from '@builder.io/qwik';
import { CloudflareR2Image } from '~/components/builder/CloudflareR2Image';
import { CloudflareStreamVideo } from '~/components/builder/CloudflareStreamVideo';

export default component$(() => {
  return (
    <div class="min-h-screen bg-gray-50 py-12 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
          <h1 class="text-3xl font-bold text-blue-900 mb-2">
            ✅ Custom Components Test Page
          </h1>
          <p class="text-blue-800">
            These components are working! Now they need to be registered in Builder.io's visual editor.
          </p>
        </div>

        {/* Test Cloudflare R2 Image */}
        <section class="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            CloudflareR2Image Component
          </h2>
          <p class="text-gray-600 mb-6">
            Optimized image with Cloudflare Image Resizing
          </p>

          <CloudflareR2Image
            src="https://media.jpstas.com/portfolio/PrintStudio/IMG_0620.jpeg"
            alt="HP Latex printer in production"
            width={800}
            height={600}
            optimize={true}
            lazy={true}
            quality={85}
            class="w-full rounded-lg shadow-md"
          />

          <div class="mt-4 bg-gray-100 p-4 rounded text-sm font-mono text-gray-700">
            <pre>{`<CloudflareR2Image
  src="https://media.jpstas.com/..."
  alt="HP Latex printer"
  width={800}
  height={600}
  optimize={true}
/>`}</pre>
          </div>
        </section>

        {/* Test Cloudflare Stream Video */}
        <section class="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            CloudflareStreamVideo Component
          </h2>
          <p class="text-gray-600 mb-6">
            Video player for Cloudflare Stream
          </p>

          <CloudflareStreamVideo
            videoId="af4889355cd0d36bac6722871cb2bcb3"
            title="FPV Drone Flythrough Demo"
            aspectRatio="16:9"
            autoplay={false}
            controls={true}
            loading="lazy"
          />

          <div class="mt-4 bg-gray-100 p-4 rounded text-sm font-mono text-gray-700">
            <pre>{`<CloudflareStreamVideo
  videoId="af4889355cd0d36bac6722871cb2bcb3"
  title="Demo Video"
  aspectRatio="16:9"
  controls={true}
/>`}</pre>
          </div>
        </section>

        {/* Builder.io Setup Instructions */}
        <section class="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-lg p-8 text-white">
          <h2 class="text-2xl font-bold mb-4">
            📋 To Use in Builder.io Visual Editor:
          </h2>
          <ol class="space-y-3 text-lg">
            <li>
              <strong>1.</strong> Go to{' '}
              <a href="https://builder.io" target="_blank" class="underline">
                builder.io
              </a>
            </li>
            <li>
              <strong>2.</strong> Create a <strong>"Page"</strong> model (Models → + New Model → Page)
            </li>
            <li>
              <strong>3.</strong> Create a new page entry (+ New Entry)
            </li>
            <li>
              <strong>4.</strong> Click "Edit" to open visual editor
            </li>
            <li>
              <strong>5.</strong> Click "Insert" → Find "Cloudflare R2 Image" and "Cloudflare Stream Video"
            </li>
            <li>
              <strong>6.</strong> Drag components onto your page
            </li>
            <li>
              <strong>7.</strong> Configure in right sidebar (src, videoId, etc.)
            </li>
          </ol>

          <div class="mt-6 bg-white/20 rounded p-4">
            <p class="font-semibold mb-2">📚 Full Documentation:</p>
            <ul class="space-y-1 text-sm">
              <li>• Demo page: <code class="bg-black/20 px-2 py-1 rounded">/builder-components-demo</code></li>
              <li>• Docs: <code class="bg-black/20 px-2 py-1 rounded">docs/BUILDER_IO_CUSTOM_COMPONENTS.md</code></li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
});
