import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import pkg from './package.json';

/**
 * Vite configuration for the SigHya application
 * Defines build settings, development server options, and optimization strategies
 */
export default defineConfig({
  // React plugin for JSX support and hot module replacement
  plugins: [react()],
  
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
