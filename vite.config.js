import { defineConfig } from 'vite'
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync, readFileSync } from 'fs'
import { join, resolve } from 'path'

function htmlPartials() {
  return {
    name: 'html-partials',
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.html') && file.includes('partials')) {
        server.ws.send({ type: 'full-reload' })
      }
    },
    transformIndexHtml(html) {
      return html.replace(/<load-partial\s+src="([^"]+)"\s*\/>/g, (match, src) => {
        const filePath = resolve(process.cwd(), src)
        if (existsSync(filePath)) {
          return readFileSync(filePath, 'utf-8')
        }
        console.warn(`Partial not found: ${filePath}`)
        return match
      })
    }
  }
}

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/thanghoang07/' : '/',
  build: {
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        // ✅ FIX 1: Xóa toàn bộ console.log/warn/info trong production build
        // Chỉ giữ lại console.error để catch lỗi thật sự
        drop_console: false,        // không drop hết — dùng pure_funcs để chọn lọc
        pure_funcs: [
          'console.log',
          'console.info',
          'console.warn',
          'console.debug',
          'console.group',
          'console.groupEnd',
          'console.groupCollapsed',
          'console.time',
          'console.timeEnd',
        ],
        drop_debugger: true,
        passes: 2,                  // 2 lần compress cho bundle nhỏ hơn
      },
      mangle: true,
      format: {
        comments: false,            // Xóa toàn bộ comments trong output
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
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
        entryFileNames: 'js/[name]-[hash].js',
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  plugins: [
    htmlPartials(),
    {
      name: 'copy-assets',
      async closeBundle() {
        // Copy tests folder to dist
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
                if (!existsSync(destPath)) mkdirSync(destPath, { recursive: true })
                copyDir(srcPath, destPath)
              } else {
                copyFileSync(srcPath, destPath)
              }
            })
          }

          copyDir(testsDir, distTestsDir)
        }

        // Copy translations.json to dist/src/
        const translationsFile = 'src/translations.json'
        const distSrcDir = 'dist/src'
        const distTranslationsFile = 'dist/src/translations.json'

        if (existsSync(translationsFile)) {
          if (!existsSync(distSrcDir)) {
            mkdirSync(distSrcDir, { recursive: true })
          }
          copyFileSync(translationsFile, distTranslationsFile)
        }

        // ✅ FIX 2: Tạo manifest.json vào dist/ để tránh 404 trên GitHub Pages
        const manifestSrc = 'public/manifest.json'
        const manifestDest = 'dist/manifest.json'
        if (existsSync(manifestSrc)) {
          copyFileSync(manifestSrc, manifestDest)
        } else {
          // Tạo manifest tối giản nếu chưa có file gốc
          const { writeFileSync } = await import('fs').then(m => m)
          writeFileSync(manifestDest, JSON.stringify({
            name: 'Thang Hoang Duc - Portfolio',
            short_name: 'Thang Portfolio',
            description: 'Frontend Developer Portfolio',
            start_url: '/thanghoang07/',
            display: 'standalone',
            background_color: '#080b14',
            theme_color: '#7c3aed',
            icons: [
              {
                src: 'https://ui-avatars.com/api/?name=Thang+Hoang+Duc&background=7c3aed&color=fff&size=192',
                sizes: '192x192',
                type: 'image/png',
              },
              {
                src: 'https://ui-avatars.com/api/?name=Thang+Hoang+Duc&background=7c3aed&color=fff&size=512',
                sizes: '512x512',
                type: 'image/png',
              },
            ],
          }, null, 2))
        }
      },
    },
  ],
  server: {
    open: true,
  },
  css: {
    devSourcemap: false,
  },
})