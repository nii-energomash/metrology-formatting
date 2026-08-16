import { parseNumericOrThrow } from './numeric'

/**
 * Вывод процента с точностью до 1 знака после запятой
 * @param {*} value Значение для форматирования
 * @returns {String} Строка в процентах, либо пустая строка для непригодного значения
 */
export function toPercentageString(value) {
  try {
    return parseNumericOrThrow(value).toFixed(1)
  } catch {
    return ''
  }
}
