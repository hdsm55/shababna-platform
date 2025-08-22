import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import { splitVendorChunkPlugin } from 'vite'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      // تحسين إعدادات React
      jsxRuntime: 'automatic',
      jsxImportSource: undefined,
    }),
    splitVendorChunkPlugin(),
    // Generate pre-compressed assets for production (Brotli + Gzip)
    viteCompression({ algorithm: 'brotliCompress', ext: '.br', deleteOriginFile: false, threshold: 1024 }),
    viteCompression({ algorithm: 'gzip', ext: '.gz', deleteOriginFile: false, threshold: 1024 }),
  ],
  optimizeDeps: {
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
    force: true,
    esbuildOptions: {
      target: 'es2020',
    },
  },
  resolve: {
    // Ensure only one copy of these libs is used
    dedupe: ['react', 'react-dom', 'react-router', 'react-router-dom'],
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      'react-router': path.resolve(__dirname, 'node_modules/react-router'),
      'react-router-dom': path.resolve(__dirname, 'node_modules/react-router-dom'),
    },
  },
  define: {
    // Expose environment variables to the client
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
    // تحسين React
    __DEV__: mode === 'development',
    global: 'globalThis',
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
    // Strip debug code only in production
    drop: mode === 'production' ? ['console', 'debugger'] : [],
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
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' http://localhost:5000 http://127.0.0.1:5000 ws://localhost:* ws://127.0.0.1:* https://shababna-platform.onrender.com https://*.onrender.com https://*.render.com https://fonts.googleapis.com https://fonts.gstatic.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'"
      ].join('; ')
    },
    // تحسين سرعة التطوير
    hmr: {
      overlay: false, // إزالة overlay الأخطاء لتحسين الأداء
      clientPort: 5173,
      host: 'localhost'
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
          const normalizedId = id.split('\\').join('/');
          // Core React libraries
          if (normalizedId.includes('react') && !normalizedId.includes('react-router')) {
            return 'react-core';
          }

          // Router
          if (normalizedId.includes('react-router')) {
            return 'router';
          }

          // UI Libraries
          if (normalizedId.includes('framer-motion') || normalizedId.includes('lucide-react')) {
            return 'ui-libs';
          }

          // State Management
          if (normalizedId.includes('@tanstack/react-query') || normalizedId.includes('zustand')) {
            return 'state-management';
          }

          // Internationalization
          if (normalizedId.includes('react-i18next') || normalizedId.includes('i18next')) {
            return 'i18n';
          }

          // Dashboard pages - separate chunk
          if (normalizedId.includes('/dashboard/')) {
            return 'dashboard';
          }

          // Auth pages - separate chunk
          if (normalizedId.includes('/auth/')) {
            return 'auth';
          }

          // Public pages - separate chunk
          if (normalizedId.includes('/pages/') && !normalizedId.includes('/dashboard/') && !normalizedId.includes('/auth/')) {
            return 'public-pages';
          }

          // Components - separate chunk
          if (normalizedId.includes('/components/')) {
            return 'components';
          }

          // Services - separate chunk
          if (normalizedId.includes('/services/')) {
            return 'services';
          }

          // Utils - separate chunk
          if (normalizedId.includes('/utils/') || normalizedId.includes('/hooks/')) {
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
    cssCodeSplit: true,
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
}))
