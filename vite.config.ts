import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { qwikLoaderPlugin } from './scripts/qwik-loader-plugin.js';

export default defineConfig(() => {
  return {
    plugins: [
      qwikCity(),
      qwikVite(),
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
