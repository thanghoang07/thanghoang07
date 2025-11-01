import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/thanghoang07/' : '/',
  build: {
    sourcemap: false, // Disable for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console logs for debugging GitHub Pages
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          utils: ['src/utils.js'],
          templates: ['src/templates.js'], 
          config: ['src/config.js']
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js'
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    open: true
  },
  // CSS optimization
  css: {
    devSourcemap: false
  }
}) 