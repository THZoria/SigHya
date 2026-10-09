import { readFileSync } from 'node:fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: /\/api\/feeds\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'sighya-feeds-cache',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      includeAssets: ['logo.png'],
      manifest: {
        name: 'SigHya - Modding de consoles',
        short_name: 'SigHya',
        description:
          'Communauté française de modding de consoles. Guides, tutoriels et entraide pour le modding de Nintendo Switch, PS5 et plus encore.',
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
            purpose: 'any maskable',
          },
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],

  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },

  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            if (req.headers.host) proxyReq.setHeader('x-forwarded-host', req.headers.host)
            if (req.headers.origin) proxyReq.setHeader('origin', req.headers.origin)
            if (req.headers.referer) proxyReq.setHeader('referer', req.headers.referer)
          })
        },
      },
    },
  },

  build: {
    outDir: '.prod',
    emptyOutDir: true,
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-router-dom')
          ) {
            return 'react-vendor'
          }
          if (id.includes('node_modules/framer-motion')) return 'framer-motion'
          if (id.includes('node_modules/lucide-react')) return 'lucide-icons'
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
})
