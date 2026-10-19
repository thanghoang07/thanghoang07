import { defineConfig } from 'vite';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export default defineConfig(({ command, isPreview }) => ({
  base: process.env.BASE_PATH || (command === 'build' || isPreview ? '/thanghoang07/' : '/'),
  plugins: [{
    name: 'html-partials',
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.html') && file.includes('partials')) server.ws.send({ type: 'full-reload' });
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace(/<load-partial\s+src="([^"]+)"\s*\/>/g, (_, src) => {
          const path = resolve(src);
          if (!existsSync(path)) throw new Error('Missing HTML partial: ' + src);
          return readFileSync(path, 'utf8');
        });
      },
    },
  }],
  build: {
    minify: 'terser',
    terserOptions: { compress: { pure_funcs: ['console.log', 'console.info', 'console.debug'] } },
  },
  server: { open: false },
}));
