import { defineConfig } from 'vite'
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

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
        manualChunks: (id) => {
          // Only create chunks for actually used modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          // Let Vite handle the rest automatically
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
  plugins: [
    {
      name: 'copy-tests',
      closeBundle() {
        // Copy tests folder to dist after build
        const testsDir = 'tests'
        const distTestsDir = 'dist/tests'
        
        if (existsSync(testsDir)) {
          if (!existsSync(distTestsDir)) {
            mkdirSync(distTestsDir, { recursive: true })
          }
          
          const copyDir = (src, dest) => {
            const files = readdirSync(src)
            files.forEach(file => {
              const srcPath = join(src, file)
              const destPath = join(dest, file)
              
              if (statSync(srcPath).isDirectory()) {
                if (!existsSync(destPath)) {
                  mkdirSync(destPath, { recursive: true })
                }
                copyDir(srcPath, destPath)
              } else {
                copyFileSync(srcPath, destPath)
              }
            })
          }
          
          copyDir(testsDir, distTestsDir)
          console.log('✅ Tests folder copied to dist/')
        }
      }
    }
  ],
  server: {
    open: true
  },
  // CSS optimization
  css: {
    devSourcemap: false
  }
}) 