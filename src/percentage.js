import { parseNumeric, roundTo, splitDigits } from './numeric'
import { joinNumber, resolveSymbols } from './symbols'

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
 *
 * По умолчанию вывод — ASCII: точка, дефис, без знака процента. Типографика
 * задаётся настройками.
 * @param {*} value Значение для форматирования
 * @param {Object} [options] Настройки форматирования
 * @param {String} [options.roundingMode] Правило округления, значения те же, что у Intl.NumberFormat
 * @param {String} [options.decimal] Десятичный разделитель, по умолчанию '.'
 * @param {String} [options.minusSign] Знак минуса, по умолчанию '-'
 * @param {String} [options.invalid] Текст для непригодного значения, по умолчанию ''
 * @param {String} [options.percentSign] Знак процента в конце, по умолчанию ''; пробел перед ним — частью значения
 * @returns {String} Строка в процентах, либо options.invalid для непригодного значения
 * @throws {RangeError} Если правило округления или способ записи порядка неизвестны
 */
export function toPercentageString(value, options) {
  const symbols = resolveSymbols(options)
  const parts = toPercentageObject(value, options)

  if (!parts.integer) return symbols.invalid

  return `${joinNumber(parts, symbols)}${symbols.percentSign}`
}
