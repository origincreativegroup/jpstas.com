import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import { staticAdapter } from '@builder.io/qwik-city/adapters/static/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { qwikLoaderPlugin } from './scripts/qwik-loader-plugin.js';

export default defineConfig(() => {
  return {
    plugins: [
      qwikCity(),
      qwikVite(),
      staticAdapter({
        origin: 'https://www.jpstas.com',
      }),
      tsconfigPaths(),
      qwikLoaderPlugin(), // Inject QwikLoader during build
    ],
    ssr: {
      noExternal: true,
    },
    build: {
      target: 'es2020',
    },
    publicDir: 'public',
    preview: {
      headers: {
        'Cache-Control': 'public, max-age=600',
      },
    },
  };
});
