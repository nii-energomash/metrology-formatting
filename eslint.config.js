import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVitest from '@vitest/eslint-plugin'
import eslintConfigPrettier from 'eslint-config-prettier'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  js.configs.recommended,

  {
    ...pluginVitest.configs.recommended,
    files: ['tests/**/*.test.js'],
  },

  eslintConfigPrettier,

  {
    rules: {
      'no-unused-vars': 'warn',
      'prefer-const': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-alert': 'error',
      'no-debugger': 'error',
      'no-return-await': 'error',
    },
  },

  {
    name: 'app/node-scripts',
    files: ['*.config.js', 'scripts/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Вывод в консоль — это и есть интерфейс скриптов сборки.
      'no-console': 'off',
    },
  },
])
