import { parseNumeric, roundTo, splitDigits } from './numeric'

/**
 * Представление процента данными, с точностью до 1 знака после запятой
 *
 * Объект несёт данные, а не типографику: знак — признаком, цифры — строками
 * без разделителя и без знака процента.
 * @param {*} value Значение для форматирования
 * @param {Object} [options] Настройки форматирования
 * @param {String} [options.roundingMode] Правило округления, значения те же, что у Intl.NumberFormat
 * @returns {Object} Представление процента { negative, integer, fraction }; для непригодного значения строки пусты
 * @throws {RangeError} Если правило округления неизвестно
 */
export function toPercentageObject(value, { roundingMode } = {}) {
  const numericValue = parseNumeric(value)

  if (numericValue === null)
    return { negative: false, integer: '', fraction: '' }

  const rounded = roundTo(numericValue, 1, roundingMode)

  // Знак берётся у округлённого значения, а не у исходного: -0.03 округляется
  // в ноль, и признак отрицательности у нуля был бы ложным.
  return { negative: rounded < 0, ...splitDigits(Math.abs(rounded), 1) }
}

/**
 * Вывод процента с точностью до 1 знака после запятой
 * @param {*} value Значение для форматирования
 * @param {Object} [options] Настройки форматирования
 * @param {String} [options.roundingMode] Правило округления, значения те же, что у Intl.NumberFormat
 * @returns {String} Строка в процентах, либо пустая строка для непригодного значения
 * @throws {RangeError} Если правило округления неизвестно
 */
export function toPercentageString(value, options) {
  const { negative, integer, fraction } = toPercentageObject(value, options)

  if (!integer) return ''

  return `${negative ? '-' : ''}${integer}.${fraction}`
}
