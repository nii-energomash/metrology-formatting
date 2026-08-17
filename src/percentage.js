import { parseNumeric, roundTo } from './numeric'

/**
 * Вывод процента с точностью до 1 знака после запятой
 * @param {*} value Значение для форматирования
 * @param {Object} [options] Настройки форматирования
 * @param {String} [options.roundingMode] Правило округления, значения те же, что у Intl.NumberFormat
 * @returns {String} Строка в процентах, либо пустая строка для непригодного значения
 * @throws {RangeError} Если правило округления неизвестно
 */
export function toPercentageString(value, { roundingMode } = {}) {
  const numericValue = parseNumeric(value)

  if (numericValue === null) return ''

  // Округление выполняет roundTo, toFixed остаётся только дописать знак:
  // сам по себе он округляет двоичное значение, а не десятичное.
  return roundTo(numericValue, 1, roundingMode).toFixed(1)
}
