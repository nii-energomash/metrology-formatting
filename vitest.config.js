import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Библиотека не зависит от DOM — jsdom тут только замедлял бы старт.
    environment: 'node',
    include: ['tests/**/*.test.js'],
    exclude: [...configDefaults.exclude],
    isolate: true,
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      reporter: ['text', 'lcov'],
    },
  },
})
