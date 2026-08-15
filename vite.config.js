import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.js', import.meta.url)),
      name: 'metrologyFormatting',
      // fileName задаётся строкой, чтобы расширение выбирал Vite: при
      // "type": "module" он даёт .cjs формату cjs и .js остальным.
      // Функциональная форма возвращает имя целиком и этот подбор обходит.
      fileName: 'index',
      formats: ['es', 'cjs', 'iife'],
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
