import { defineConfig } from 'vitest/config'

// Проверка собранного пакета вынесена в отдельный конфиг: этим тестам нужен
// готовый dist, и в выборку `npm test` (только tests/) они попадать не должны.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests-dist/**/*.test.js'],
  },
})
