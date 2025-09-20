import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@services': resolve(__dirname, 'src/services'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@types': resolve(__dirname, 'src/types'),
      '@store': resolve(__dirname, 'src/store'),
      '@i18n': resolve(__dirname, 'src/i18n'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@images': resolve(__dirname, 'public/images'),
    },
  },
  build: {
    // تحسين حجم الباندل
    target: 'es2015',
    minify: 'esbuild',

    // تقسيم الباندل
    rollupOptions: {
      output: {
        manualChunks: {
          // المكتبات الأساسية
          vendor: ['react', 'react-dom'],

          // التوجيه
          router: ['react-router-dom', 'react-router'],

          // واجهة المستخدم والحركات
          ui: ['framer-motion', 'lucide-react'],

          // إدارة الحالة والاستعلامات
          state: ['@tanstack/react-query', 'zustand'],

          // الترجمة
          i18n: ['react-i18next', 'i18next', 'i18next-browser-languagedetector'],

          // SEO
          seo: ['react-helmet-async'],

          // الأدوات المساعدة
          utils: ['clsx'],
        },

        // تحسين أسماء الملفات
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '')
            : 'chunk'
          return `js/${facadeModuleId}-[hash].js`
        },

        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || []
          const ext = info[info.length - 1]
          if (/\.(css)$/.test(assetInfo.name || '')) {
            return `css/[name]-[hash].${ext}`
          }
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name || '')) {
            return `images/[name]-[hash].${ext}`
          }
          if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name || '')) {
            return `fonts/[name]-[hash].${ext}`
          }
          return `assets/[name]-[hash].${ext}`
        },
      },
    },

    // تحسين CSS
    cssCodeSplit: true,

    // تحسين Source Maps
    sourcemap: false,

    // تحسين Assets
    assetsInlineLimit: 4096,

    // تحسين Chunk Size
    chunkSizeWarningLimit: 1000,
  },

  // تحسينات التطوير
  server: {
    port: 5173,
    host: true,
    open: true,

    // تحسين Hot Module Replacement
    hmr: {
      overlay: false,
    },
  },

  // تحسينات Preview
  preview: {
    port: 4173,
    host: true,
    open: true,
  },

  // تحسينات CSS
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },

  // تحسينات الأداء
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      '@tanstack/react-query',
      'react-i18next',
      'i18next',
      'zustand',
    ],

    exclude: ['@tanstack/react-query-devtools'],
  },

  // تحسينات PWA والأيقونات
  define: {
    __PWA_ENABLED__: JSON.stringify(true),
    __PWA_VERSION__: JSON.stringify('1.0.0'),
    // ضمان تحميل الأيقونات
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },

  // تحسينات Worker
  worker: {
    format: 'es',
  },

  // تحسينات Legacy
  legacy: {
    // buildSsrCjsExternalHeuristics: true, // غير مدعوم في الإصدار الحالي
  },

  // تحسينات Experimental
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        return { js: `/${filename}` }
      } else {
        return { relative: true }
      }
    },
  },
})
