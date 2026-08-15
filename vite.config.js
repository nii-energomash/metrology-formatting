import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.js', import.meta.url)),
      name: 'metrologyFormatting',
      fileName: format => `index.${format}.js`,
      formats: ['es', 'umd'],
    },
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      format: {
        comments: 'some',
      },
    },
  },
  server: {
    open: '/samples/index.html',
  },
})
