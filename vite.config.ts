import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

/**
 * Vite configuration for the SigHya application
 */
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
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
                maxAgeSeconds: 60 * 60 * 24,
              },
            },
          },
        ],
      },
      includeAssets: ['logo.png'],
      manifest: {
        name: 'SigHya - Modding de consoles',
        short_name: 'SigHya',
        description: 'Communaut\u00e9 fran\u00e7aise de modding de consoles. Guides, tutoriels et entraide pour le modding de Nintendo Switch, PS5 et plus encore.',
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
  
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version)
  },
  
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/proxy/rss': {
        target: 'https://api.allorigins.win',
        changeOrigin: true,
        rewrite: () => `/raw?url=${encodeURIComponent('https://hacktuality.com/rss.xml')}`,
      },
    },
  },
  
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'framer-motion';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'lucide-icons';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
