import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { createContext, runInContext } from 'node:vm'
import { describe, expect, it } from 'vitest'

// Пакет резолвится по имени, а не по путям в dist: так проверяется сама карта
// exports вместе с расширениями файлов, а не только факт их существования.
const require = createRequire(import.meta.url)
const packageName = '@nii-energomash/metrology-formatting'

describe('точки входа собранного пакета', () => {
  // createRequire обращается к загрузчику Node в обход конвейера Vite: только
  // так видно, что при "type": "module" Node читает файл как ESM или как CJS.
  it('require отдаёт FormattingUtility', () => {
    expect(Object.keys(require(packageName))).toContain('FormattingUtility')
  })

  it('import отдаёт FormattingUtility', async () => {
    expect(Object.keys(await import(packageName))).toContain(
      'FormattingUtility'
    )
  })

  // Контекст vm пустой — без module, exports и define, то есть ровно те условия,
  // в которых бандл оказывается на странице при подключении тегом script.
  it('браузерная сборка объявляет глобаль metrologyFormatting', () => {
    const source = readFileSync(
      require.resolve(`${packageName}/browser`),
      'utf8'
    )
    const context = createContext({})
    runInContext(source, context)

    expect(context.metrologyFormatting).toHaveProperty('FormattingUtility')
  })
})
