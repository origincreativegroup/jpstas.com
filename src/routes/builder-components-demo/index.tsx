/**
 * Builder.io Custom Components Demo Page
 *
 * This page demonstrates the custom Cloudflare R2 and Stream components
 * that can be used in Builder.io's visual editor
 */

import { component$ } from '@builder.io/qwik';
import { CloudflareR2Image } from '~/components/builder/CloudflareR2Image';
import { CloudflareStreamVideo } from '~/components/builder/CloudflareStreamVideo';

export default component$(() => {
  return (
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        {/* Header */}
        <div class="text-center mb-16">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            Builder.io Custom Components Demo
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            These custom Qwik components integrate Cloudflare R2 images and Stream videos
            with Builder.io's drag-and-drop visual editor.
          </p>
        </div>

        {/* Component Demos */}
        <div class="space-y-20">
          {/* Cloudflare R2 Image Component */}
          <section>
            <div class="mb-8">
              <h2 class="text-3xl font-bold text-gray-900 mb-3">
                CloudflareR2Image Component
              </h2>
              <p class="text-gray-600 mb-4">
                Optimized image component with automatic Cloudflare Image Resizing, lazy loading,
                responsive srcset, and blur placeholders.
              </p>
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 class="font-semibold text-blue-900 mb-2">Features:</h3>
                <ul class="list-disc list-inside text-blue-800 space-y-1">
                  <li>Automatic image optimization via Cloudflare Image Resizing</li>
                  <li>Responsive srcset generation for multiple breakpoints</li>
                  <li>Lazy loading with Intersection Observer</li>
                  <li>Blur placeholder support for progressive loading</li>
                  <li>Format detection (WebP, AVIF, auto)</li>
                  <li>Customizable fit modes, gravity, and quality</li>
                </ul>
              </div>
            </div>

            {/* Basic Example */}
            <div class="mb-8">
              <h3 class="text-xl font-semibold text-gray-800 mb-4">Basic Usage</h3>
              <div class="bg-white rounded-lg shadow-md p-6">
                <CloudflareR2Image
                  src="https://media.jpstas.com/portfolio/PrintStudio/IMG_0620.jpeg"
                  alt="HP Latex printer in production - Print Studio project"
                  width={800}
                  height={600}
                  optimize={true}
                  lazy={true}
                  class="w-full rounded-lg"
                />
                <div class="mt-4 bg-gray-100 rounded p-3 text-sm text-gray-700 font-mono">
                  <code>
                    {`<CloudflareR2Image
  src="https://media.jpstas.com/portfolio/PrintStudio/IMG_0620.jpeg"
  alt="HP Latex printer in production"
  width={800}
  height={600}
  optimize={true}
  lazy={true}
/>`}
                  </code>
                </div>
              </div>
            </div>

            {/* Advanced Example with Blur Placeholder */}
            <div class="mb-8">
              <h3 class="text-xl font-semibold text-gray-800 mb-4">With Blur Placeholder</h3>
              <div class="bg-white rounded-lg shadow-md p-6">
                <CloudflareR2Image
                  src="https://media.jpstas.com/portfolio/Pablos/Screenshot%202024-10-28%20at%204.36.29%E2%80%AFPM.png"
                  alt="Pablo's restaurant website design"
                  width={1200}
                  height={800}
                  optimize={true}
                  lazy={true}
                  blurPlaceholder={true}
                  quality={90}
                  format="webp"
                  class="w-full rounded-lg"
                />
                <div class="mt-4 bg-gray-100 rounded p-3 text-sm text-gray-700 font-mono">
                  <code>
                    {`<CloudflareR2Image
  src="..."
  alt="Pablo's restaurant website"
  blurPlaceholder={true}
  quality={90}
  format="webp"
/>`}
                  </code>
                </div>
              </div>
            </div>
          </section>

          {/* Cloudflare Stream Video Component */}
          <section>
            <div class="mb-8">
              <h2 class="text-3xl font-bold text-gray-900 mb-3">
                CloudflareStreamVideo Component
              </h2>
              <p class="text-gray-600 mb-4">
                Video player component for Cloudflare Stream with customizable controls,
                aspect ratios, and lazy loading.
              </p>
              <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 class="font-semibold text-purple-900 mb-2">Features:</h3>
                <ul class="list-disc list-inside text-purple-800 space-y-1">
                  <li>Cloudflare Stream iframe player integration</li>
                  <li>Responsive aspect ratio support (16:9, 4:3, 1:1, 9:16, 21:9)</li>
                  <li>Lazy loading with custom play button overlay</li>
                  <li>Automatic thumbnail poster generation</li>
                  <li>Customizable controls and appearance</li>
                  <li>Video ID validation and extraction from URLs</li>
                </ul>
              </div>
            </div>

            {/* Basic Video Example */}
            <div class="mb-8">
              <h3 class="text-xl font-semibold text-gray-800 mb-4">Basic Usage (16:9)</h3>
              <div class="bg-white rounded-lg shadow-md p-6">
                <CloudflareStreamVideo
                  videoId="af4889355cd0d36bac6722871cb2bcb3"
                  title="FPV Drone Flythrough Demo"
                  aspectRatio="16:9"
                  autoplay={false}
                  loop={false}
                  controls={true}
                  loading="lazy"
                />
                <div class="mt-4 bg-gray-100 rounded p-3 text-sm text-gray-700 font-mono">
                  <code>
                    {`<CloudflareStreamVideo
  videoId="af4889355cd0d36bac6722871cb2bcb3"
  title="FPV Drone Flythrough"
  aspectRatio="16:9"
  controls={true}
/>`}
                  </code>
                </div>
              </div>
            </div>

            {/* Portrait Video Example */}
            <div class="mb-8">
              <h3 class="text-xl font-semibold text-gray-800 mb-4">Portrait/Vertical (9:16)</h3>
              <div class="bg-white rounded-lg shadow-md p-6">
                <div class="max-w-md mx-auto">
                  <CloudflareStreamVideo
                    videoId="af4889355cd0d36bac6722871cb2bcb3"
                    title="Portrait video example"
                    aspectRatio="9:16"
                    autoplay={false}
                    controls={true}
                    loading="lazy"
                  />
                </div>
                <div class="mt-4 bg-gray-100 rounded p-3 text-sm text-gray-700 font-mono">
                  <code>
                    {`<CloudflareStreamVideo
  videoId="af4889355cd0d36bac6722871cb2bcb3"
  aspectRatio="9:16"
/>`}
                  </code>
                </div>
              </div>
            </div>

            {/* Autoplay Muted Example */}
            <div class="mb-8">
              <h3 class="text-xl font-semibold text-gray-800 mb-4">Autoplay (Muted)</h3>
              <div class="bg-white rounded-lg shadow-md p-6">
                <CloudflareStreamVideo
                  videoId="af4889355cd0d36bac6722871cb2bcb3"
                  title="Autoplay video example"
                  aspectRatio="16:9"
                  autoplay={true}
                  loop={true}
                  muted={true}
                  controls={true}
                  loading="eager"
                />
                <div class="mt-4 bg-gray-100 rounded p-3 text-sm text-gray-700 font-mono">
                  <code>
                    {`<CloudflareStreamVideo
  videoId="af4889355cd0d36bac6722871cb2bcb3"
  autoplay={true}
  loop={true}
  muted={true}
  loading="eager"
/>`}
                  </code>
                </div>
              </div>
            </div>
          </section>

          {/* Builder.io Integration Guide */}
          <section class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-xl p-8 text-white">
            <h2 class="text-3xl font-bold mb-4">Using in Builder.io</h2>
            <div class="space-y-4">
              <p class="text-lg">
                These components are now registered with Builder.io and available in the visual editor:
              </p>
              <ol class="list-decimal list-inside space-y-3 text-lg">
                <li>Open Builder.io visual editor for any page</li>
                <li>Click "Insert" in the left sidebar</li>
                <li>Find "Cloudflare R2 Image" or "Cloudflare Stream Video" in the components list</li>
                <li>Drag and drop onto your page</li>
                <li>Configure properties in the right sidebar (src, alt, width, height, etc.)</li>
                <li>Publish when ready!</li>
              </ol>
              <div class="mt-6 bg-white/10 rounded-lg p-4">
                <p class="font-semibold mb-2">Pro Tips:</p>
                <ul class="list-disc list-inside space-y-1">
                  <li>Use the file picker for the R2 image "src" field</li>
                  <li>Enter your Cloudflare Stream video ID (32-character hex string)</li>
                  <li>Toggle "Advanced" to access quality, format, and optimization settings</li>
                  <li>Preview your changes in real-time before publishing</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Component Properties Reference */}
          <section class="mb-16">
            <h2 class="text-3xl font-bold text-gray-900 mb-6">Component Properties</h2>

            {/* R2 Image Props */}
            <div class="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 class="text-2xl font-semibold text-gray-800 mb-4">CloudflareR2Image Props</h3>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prop</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Default</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200 text-sm">
                    <tr>
                      <td class="px-6 py-4 font-mono">src</td>
                      <td class="px-6 py-4">string</td>
                      <td class="px-6 py-4 text-red-600">required</td>
                      <td class="px-6 py-4">Image URL from Cloudflare R2</td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 font-mono">alt</td>
                      <td class="px-6 py-4">string</td>
                      <td class="px-6 py-4 text-red-600">required</td>
                      <td class="px-6 py-4">Alt text for accessibility</td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 font-mono">width</td>
                      <td class="px-6 py-4">number</td>
                      <td class="px-6 py-4">-</td>
                      <td class="px-6 py-4">Target width in pixels</td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 font-mono">height</td>
                      <td class="px-6 py-4">number</td>
                      <td class="px-6 py-4">-</td>
                      <td class="px-6 py-4">Target height in pixels</td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 font-mono">optimize</td>
                      <td class="px-6 py-4">boolean</td>
                      <td class="px-6 py-4">true</td>
                      <td class="px-6 py-4">Enable Cloudflare optimization</td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 font-mono">quality</td>
                      <td class="px-6 py-4">number</td>
                      <td class="px-6 py-4">85</td>
                      <td class="px-6 py-4">Image quality (1-100)</td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 font-mono">format</td>
                      <td class="px-6 py-4">string</td>
                      <td class="px-6 py-4">auto</td>
                      <td class="px-6 py-4">Format: auto, webp, avif, jpeg, png</td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 font-mono">lazy</td>
                      <td class="px-6 py-4">boolean</td>
                      <td class="px-6 py-4">true</td>
                      <td class="px-6 py-4">Enable lazy loading</td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 font-mono">blurPlaceholder</td>
                      <td class="px-6 py-4">boolean</td>
                      <td class="px-6 py-4">false</td>
                      <td class="px-6 py-4">Show blur placeholder while loading</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Stream Video Props */}
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-2xl font-semibold text-gray-800 mb-4">CloudflareStreamVideo Props</h3>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prop</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Default</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200 text-sm">
                    <tr>
                      <td class="px-6 py-4 font-mono">videoId</td>
                      <td class="px-6 py-4">string</td>
                      <td class="px-6 py-4 text-red-600">required</td>
                      <td class="px-6 py-4">Cloudflare Stream video ID (32-char hex)</td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 font-mono">title</td>
                      <td class="px-6 py-4">string</td>
                      <td class="px-6 py-4">"Video"</td>
                      <td class="px-6 py-4">Video title for accessibility</td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 font-mono">aspectRatio</td>
                      <td class="px-6 py-4">string</td>
                      <td class="px-6 py-4">16:9</td>
                      <td class="px-6 py-4">Aspect ratio (16:9, 4:3, 1:1, 9:16, 21:9)</td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 font-mono">autoplay</td>
                      <td class="px-6 py-4">boolean</td>
                      <td class="px-6 py-4">false</td>
                      <td class="px-6 py-4">Autoplay video on load</td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 font-mono">loop</td>
                      <td class="px-6 py-4">boolean</td>
                      <td class="px-6 py-4">false</td>
                      <td class="px-6 py-4">Loop video playback</td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 font-mono">muted</td>
                      <td class="px-6 py-4">boolean</td>
                      <td class="px-6 py-4">false</td>
                      <td class="px-6 py-4">Mute audio by default</td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 font-mono">controls</td>
                      <td class="px-6 py-4">boolean</td>
                      <td class="px-6 py-4">true</td>
                      <td class="px-6 py-4">Show player controls</td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 font-mono">loading</td>
                      <td class="px-6 py-4">string</td>
                      <td class="px-6 py-4">lazy</td>
                      <td class="px-6 py-4">Loading strategy (lazy, eager)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div class="mt-20 text-center text-gray-600">
          <p class="mb-2">
            Built with Qwik + Builder.io + Cloudflare
          </p>
          <p class="text-sm">
            View this page at: <code class="bg-gray-200 px-2 py-1 rounded">/builder-components-demo</code>
          </p>
        </div>
      </div>
    </div>
  );
});
