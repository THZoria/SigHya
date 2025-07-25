import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import pkg from './package.json';

/**
 * Vite configuration for the SigHya application
 * Defines build settings, development server options, and optimization strategies
 */
export default defineConfig({
  // React plugin for JSX support and hot module replacement
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/nxhub\.pw\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'nxhub-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
            },
          },
        ],
      },
      includeAssets: ['logo.png'],
      manifest: {
        name: 'SigHya - Modding de consoles',
        short_name: 'SigHya',
        description: 'Communauté française de modding de consoles. Guides, tutoriels et entraide pour le modding de Nintendo Switch, PS5 et plus encore.',
        theme_color: '#1a1a1a',
        background_color: '#111827',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/logo.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  
  // Global constants available in the application
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version)
  },
  
  // Development server configuration
  server: {
    port: 5173,
    host: true,
  },
  
  // Production build configuration
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching and loading performance
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'framer-motion': ['framer-motion'],
          'lucide-icons': ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/],
    },
  },
  
  // Module resolution configuration
  resolve: {
    alias: {
      '@': '/src', // Path alias for cleaner imports
    },
    mainFields: ['browser', 'module', 'main'],
  },
});
