import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { splitVendorChunkPlugin } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'framer-motion',
      'react-i18next',
      'i18next',
      'zustand',
      'react-helmet-async'
    ],
    // تحسين التبعيات
    force: false,
  },
  define: {
    // Expose environment variables to the client
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
  },
  esbuild: {
    // Ignore TypeScript errors during build
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    // تحسين البناء
    target: 'es2020',
    // تحسين الأداء
    treeShaking: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
    headers: {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' http://localhost:5000 http://127.0.0.1:5000 https://shababna-platform.onrender.com https://*.onrender.com https://*.render.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'"
      ].join('; ')
    },
    // تحسين سرعة التطوير
    hmr: {
      overlay: false, // إزالة overlay الأخطاء لتحسين الأداء
    },
    // تحسين الأداء
    fs: {
      strict: false,
    },
  },
  build: {
    rollupOptions: {
      output: {
        // تحسين تقسيم الباندل - تقسيم أكثر دقة
        manualChunks: (id) => {
          // Core React libraries
          if (id.includes('react') && !id.includes('react-router')) {
            return 'react-core';
          }

          // Router
          if (id.includes('react-router')) {
            return 'router';
          }

          // UI Libraries
          if (id.includes('framer-motion') || id.includes('lucide-react')) {
            return 'ui-libs';
          }

          // State Management
          if (id.includes('@tanstack/react-query') || id.includes('zustand')) {
            return 'state-management';
          }

          // Internationalization
          if (id.includes('react-i18next') || id.includes('i18next')) {
            return 'i18n';
          }

          // Dashboard pages - separate chunk
          if (id.includes('/dashboard/')) {
            return 'dashboard';
          }

          // Auth pages - separate chunk
          if (id.includes('/auth/')) {
            return 'auth';
          }

          // Public pages - separate chunk
          if (id.includes('/pages/') && !id.includes('/dashboard/') && !id.includes('/auth/')) {
            return 'public-pages';
          }

          // Components - separate chunk
          if (id.includes('/components/')) {
            return 'components';
          }

          // Services - separate chunk
          if (id.includes('/services/')) {
            return 'services';
          }

          // Utils - separate chunk
          if (id.includes('/utils/') || id.includes('/hooks/')) {
            return 'utils';
          }
        },
        // Ensure proper asset naming for Render
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/\.(css)$/.test(assetInfo.name)) {
            return `assets/[name]-[hash].${ext}`
          }
          if (/\.(png|jpe?g|gif|svg|ico|webp)$/.test(assetInfo.name)) {
            return `images/[name]-[hash].${ext}`
          }
          if (/\.(woff|woff2|eot|ttf|otf)$/.test(assetInfo.name)) {
            return `fonts/[name]-[hash].${ext}`
          }
          return `assets/[name]-[hash].${ext}`
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    // تحسين إعدادات البناء
    outDir: 'dist',
    assetsDir: 'assets',
    // إزالة source maps للإنتاج
    sourcemap: false,
    // تحسين حجم الباندل
    chunkSizeWarningLimit: 1000,
    // تحسين الأمان
    minify: 'esbuild',
    target: 'es2015',
    // تحسين الأداء
    reportCompressedSize: false, // تسريع البناء
    emptyOutDir: true,
    // تحسين التحميل
    modulePreload: {
      polyfill: false,
    },
    // تحسين التخزين المؤقت
    assetsInlineLimit: 4096,
  },
  base: '/',
  // Add preview configuration for SPA routing
  preview: {
    port: 5173,
    host: true,
  },
  // تحسين الأداء
  css: {
    devSourcemap: false,
  },
  // تحسين التطوير
  clearScreen: false,
  logLevel: 'info',
})
