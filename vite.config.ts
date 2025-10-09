import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import { staticAdapter } from '@builder.io/qwik-city/adapters/static/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => {
  return {
    plugins: [
      qwikCity({
        staticGenerate: {
          origin: 'https://www.jpstas.com',
        },
      }),
      qwikVite(),
      staticAdapter({
        origin: 'https://www.jpstas.com',
      }),
      tsconfigPaths(),
    ],
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
