import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
export default defineConfig({
    plugins: [
        react(),
        visualizer({
            filename: './dist/stats.html',
            open: false,
            gzipSize: true,
            brotliSize: true,
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // Vendor chunks - separate large dependencies
                    'vendor-react': ['react', 'react-dom', 'react-router-dom'],
                    'vendor-animation': ['framer-motion'],
                    'vendor-auth': ['@stackframe/stack'],
                    'vendor-dnd': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
                    'vendor-utils': ['zustand', 'marked'],
                },
            },
        },
        // Enable minification and compression
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true, // Remove console.logs in production
                drop_debugger: true,
            },
        },
        // Chunk size warnings at 400kb instead of 500kb
        chunkSizeWarningLimit: 400,
        // Enable CSS code splitting
        cssCodeSplit: true,
        // Generate source maps for production debugging (optional)
        sourcemap: false,
    },
    // Optimize dependencies
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            'react-router-dom',
            'framer-motion',
            'zustand',
            'marked',
        ],
    },
});
