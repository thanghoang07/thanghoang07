// vite.config.js
import { defineConfig } from "file:///D:/Documents/thanghoang07/node_modules/vite/dist/node/index.js";
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "fs";
import { join } from "path";
var vite_config_default = defineConfig({
  base: process.env.NODE_ENV === "production" ? "/thanghoang07/" : "/",
  build: {
    sourcemap: false,
    // Disable for production
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: false,
        // Keep console logs for debugging GitHub Pages
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js"
      }
    },
    chunkSizeWarningLimit: 1e3
  },
  plugins: [
    {
      name: "copy-assets",
      closeBundle() {
        const testsDir = "tests";
        const distTestsDir = "dist/tests";
        if (existsSync(testsDir)) {
          if (!existsSync(distTestsDir)) {
            mkdirSync(distTestsDir, { recursive: true });
          }
          const copyDir = (src, dest) => {
            const files = readdirSync(src);
            files.forEach((file) => {
              const srcPath = join(src, file);
              const destPath = join(dest, file);
              if (statSync(srcPath).isDirectory()) {
                if (!existsSync(destPath)) {
                  mkdirSync(destPath, { recursive: true });
                }
                copyDir(srcPath, destPath);
              } else {
                copyFileSync(srcPath, destPath);
              }
            });
          };
          copyDir(testsDir, distTestsDir);
          console.log("\u2705 Tests folder copied to dist/");
        }
        const translationsFile = "src/translations.json";
        const distSrcDir = "dist/src";
        const distTranslationsFile = "dist/src/translations.json";
        if (existsSync(translationsFile)) {
          if (!existsSync(distSrcDir)) {
            mkdirSync(distSrcDir, { recursive: true });
          }
          copyFileSync(translationsFile, distTranslationsFile);
          console.log("\u2705 translations.json copied to dist/src/");
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
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxEb2N1bWVudHNcXFxcdGhhbmdob2FuZzA3XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxEb2N1bWVudHNcXFxcdGhhbmdob2FuZzA3XFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Eb2N1bWVudHMvdGhhbmdob2FuZzA3L3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHsgY29weUZpbGVTeW5jLCBleGlzdHNTeW5jLCBta2RpclN5bmMsIHJlYWRkaXJTeW5jLCBzdGF0U3luYyB9IGZyb20gJ2ZzJ1xyXG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgYmFzZTogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyA/ICcvdGhhbmdob2FuZzA3LycgOiAnLycsXHJcbiAgYnVpbGQ6IHtcclxuICAgIHNvdXJjZW1hcDogZmFsc2UsIC8vIERpc2FibGUgZm9yIHByb2R1Y3Rpb25cclxuICAgIG1pbmlmeTogJ3RlcnNlcicsXHJcbiAgICB0ZXJzZXJPcHRpb25zOiB7XHJcbiAgICAgIGNvbXByZXNzOiB7XHJcbiAgICAgICAgZHJvcF9jb25zb2xlOiBmYWxzZSwgLy8gS2VlcCBjb25zb2xlIGxvZ3MgZm9yIGRlYnVnZ2luZyBHaXRIdWIgUGFnZXNcclxuICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIG1hbnVhbENodW5rczogKGlkKSA9PiB7XHJcbiAgICAgICAgICAvLyBPbmx5IGNyZWF0ZSBjaHVua3MgZm9yIGFjdHVhbGx5IHVzZWQgbW9kdWxlc1xyXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ3ZlbmRvcic7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyBMZXQgVml0ZSBoYW5kbGUgdGhlIHJlc3QgYXV0b21hdGljYWxseVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6IChhc3NldEluZm8pID0+IHtcclxuICAgICAgICAgIGNvbnN0IGluZm8gPSBhc3NldEluZm8ubmFtZS5zcGxpdCgnLicpO1xyXG4gICAgICAgICAgY29uc3QgZXh0ID0gaW5mb1tpbmZvLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgaWYgKC9wbmd8anBlP2d8c3ZnfGdpZnx0aWZmfGJtcHxpY28vaS50ZXN0KGV4dCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGBpbWFnZXMvW25hbWVdLVtoYXNoXVtleHRuYW1lXWA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoL2Nzcy9pLnRlc3QoZXh0KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gYGNzcy9bbmFtZV0tW2hhc2hdW2V4dG5hbWVdYDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBgYXNzZXRzL1tuYW1lXS1baGFzaF1bZXh0bmFtZV1gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdqcy9bbmFtZV0tW2hhc2hdLmpzJyxcclxuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2pzL1tuYW1lXS1baGFzaF0uanMnXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDEwMDBcclxuICB9LFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2NvcHktYXNzZXRzJyxcclxuICAgICAgY2xvc2VCdW5kbGUoKSB7XHJcbiAgICAgICAgLy8gQ29weSB0ZXN0cyBmb2xkZXIgdG8gZGlzdCBhZnRlciBidWlsZFxyXG4gICAgICAgIGNvbnN0IHRlc3RzRGlyID0gJ3Rlc3RzJ1xyXG4gICAgICAgIGNvbnN0IGRpc3RUZXN0c0RpciA9ICdkaXN0L3Rlc3RzJ1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChleGlzdHNTeW5jKHRlc3RzRGlyKSkge1xyXG4gICAgICAgICAgaWYgKCFleGlzdHNTeW5jKGRpc3RUZXN0c0RpcikpIHtcclxuICAgICAgICAgICAgbWtkaXJTeW5jKGRpc3RUZXN0c0RpciwgeyByZWN1cnNpdmU6IHRydWUgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgY29uc3QgY29weURpciA9IChzcmMsIGRlc3QpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZmlsZXMgPSByZWFkZGlyU3luYyhzcmMpXHJcbiAgICAgICAgICAgIGZpbGVzLmZvckVhY2goZmlsZSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc3Qgc3JjUGF0aCA9IGpvaW4oc3JjLCBmaWxlKVxyXG4gICAgICAgICAgICAgIGNvbnN0IGRlc3RQYXRoID0gam9pbihkZXN0LCBmaWxlKVxyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIGlmIChzdGF0U3luYyhzcmNQYXRoKS5pc0RpcmVjdG9yeSgpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWV4aXN0c1N5bmMoZGVzdFBhdGgpKSB7XHJcbiAgICAgICAgICAgICAgICAgIG1rZGlyU3luYyhkZXN0UGF0aCwgeyByZWN1cnNpdmU6IHRydWUgfSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvcHlEaXIoc3JjUGF0aCwgZGVzdFBhdGgpXHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvcHlGaWxlU3luYyhzcmNQYXRoLCBkZXN0UGF0aClcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGNvcHlEaXIodGVzdHNEaXIsIGRpc3RUZXN0c0RpcilcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdcdTI3MDUgVGVzdHMgZm9sZGVyIGNvcGllZCB0byBkaXN0LycpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDb3B5IHRyYW5zbGF0aW9ucy5qc29uIHRvIGRpc3Qvc3JjL1xyXG4gICAgICAgIGNvbnN0IHRyYW5zbGF0aW9uc0ZpbGUgPSAnc3JjL3RyYW5zbGF0aW9ucy5qc29uJ1xyXG4gICAgICAgIGNvbnN0IGRpc3RTcmNEaXIgPSAnZGlzdC9zcmMnXHJcbiAgICAgICAgY29uc3QgZGlzdFRyYW5zbGF0aW9uc0ZpbGUgPSAnZGlzdC9zcmMvdHJhbnNsYXRpb25zLmpzb24nXHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKGV4aXN0c1N5bmModHJhbnNsYXRpb25zRmlsZSkpIHtcclxuICAgICAgICAgIGlmICghZXhpc3RzU3luYyhkaXN0U3JjRGlyKSkge1xyXG4gICAgICAgICAgICBta2RpclN5bmMoZGlzdFNyY0RpciwgeyByZWN1cnNpdmU6IHRydWUgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNvcHlGaWxlU3luYyh0cmFuc2xhdGlvbnNGaWxlLCBkaXN0VHJhbnNsYXRpb25zRmlsZSlcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdcdTI3MDUgdHJhbnNsYXRpb25zLmpzb24gY29waWVkIHRvIGRpc3Qvc3JjLycpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgXSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIG9wZW46IHRydWVcclxuICB9LFxyXG4gIC8vIENTUyBvcHRpbWl6YXRpb25cclxuICBjc3M6IHtcclxu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
