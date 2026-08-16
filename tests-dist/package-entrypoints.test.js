import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { createContext, runInContext } from 'node:vm'
import { describe, expect, it } from 'vitest'

// Пакет резолвится по имени, а не по путям в dist: так проверяется сама карта
// exports вместе с расширениями файлов, а не только факт их существования.
const require = createRequire(import.meta.url)
const packageName = '@nii-energomash/metrology-formatting'

const publicExports = [
  'FormattingUtility',
  'toPercentageString',
  'toStandardFormObject',
  'toStandardFormString',
]

describe('точки входа собранного пакета', () => {
  // createRequire обращается к загрузчику Node в обход конвейера Vite: только
  // так видно, что при "type": "module" Node читает файл как ESM или как CJS.
  it('require отдаёт публичные экспорты', () => {
    expect(Object.keys(require(packageName))).toEqual(
      expect.arrayContaining(publicExports)
    )
  })

  it('import отдаёт публичные экспорты', async () => {
    expect(Object.keys(await import(packageName))).toEqual(
      expect.arrayContaining(publicExports)
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

    expect(Object.keys(context.metrologyFormatting)).toEqual(
      expect.arrayContaining(publicExports)
    )
  })
})
