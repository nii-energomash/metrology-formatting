import { parseNumeric } from './numeric'

/**
 * Вывод процента с точностью до 1 знака после запятой
 * @param {*} value Значение для форматирования
 * @returns {String} Строка в процентах, либо пустая строка для непригодного значения
 */
export function toPercentageString(value) {
  const numericValue = parseNumeric(value)

  if (numericValue === null) return ''

  return numericValue.toFixed(1)
}
