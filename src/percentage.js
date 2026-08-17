import { parseNumeric, roundTo } from './numeric'

/**
 * Вывод процента с точностью до 1 знака после запятой
 * @param {*} value Значение для форматирования
 * @returns {String} Строка в процентах, либо пустая строка для непригодного значения
 */
export function toPercentageString(value) {
  const numericValue = parseNumeric(value)

  if (numericValue === null) return ''

  // Округление выполняет roundTo, toFixed остаётся только дописать знак:
  // сам по себе он округляет двоичное значение, а не десятичное.
  return roundTo(numericValue, 1).toFixed(1)
}
