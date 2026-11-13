import {
  parseNumeric,
  roundTo,
  splitDigits,
  splitExponential,
  toUnsignedRoundingMode,
} from './numeric'

// Знак снимается один раз, в toStandardFormParts, и ниже его не существует:
// форму представления определяет только величина. Поэтому toExponentialParts
// и toPlainParts принимают величину, а не число — подача им отрицательного
// не даст ни исключения, ни верного ответа: знак уедет в мантиссу, и вызывающий
// припишет к ней второй.
//
// Вместе со знаком теряет смысл и правило округления, отсчитанное от знака,
// поэтому там же оно переписывается на равносильное беззнаковое: ниже
// по цепочке ходит уже результат toUnsignedRoundingMode, а не то, что назвал
// вызывающий.

/**
 * Раскладывает величину на мантиссу и десятичный порядок
 * @param {Number} absValue Величина числа, строго больше нуля
 * @param {String} [unsignedRoundingMode] Правило округления, уже переписанное для величины
 * @returns {Object} Части представления числами
 * @throws {Error} Если величина равна нулю
 */
function toExponentialParts(absValue, unsignedRoundingMode) {
  // Разложение нуля молчит: (0).toExponential() даёт "0e+0", то есть нулевую
  // мантиссу вместо величины из [1, 10). Стандартного вида у нуля нет.
  if (absValue === 0)
    throw new Error('Невозможно представить ноль в стандартном виде')

  const { mantissa, exponent } = splitExponential(absValue)

  // Округление до двух знаков может дать перенос через разряд: 9.995 -> 10.
  // Мантисса стандартного вида лежит в [1, 10), поэтому перенос уходит
  // в порядок. Результат переноса всегда ровно десять, делить нечего.
  const roundedMantissa = roundTo(mantissa, 2, unsignedRoundingMode)

  return roundedMantissa < 10
    ? { mantissa: roundedMantissa, decimalPlaces: 2, base: 10, exponent }
    : { mantissa: 1, decimalPlaces: 2, base: 10, exponent: exponent + 1 }
}

/**
 * Представляет величину как есть, без вынесения порядка
 * @param {Number} absValue Величина числа
 * @param {Number} decimalPlaces Количество знаков после запятой
 * @returns {Object} Части представления числами
 */
function toPlainParts(absValue, decimalPlaces = 0) {
  return { mantissa: absValue, decimalPlaces, base: null, exponent: null }
}

/**
 * Выбирает между экспоненциальной и обычной записью по величине числа
 * @param {Number} numericValue Разобранное число, любого знака
 * @param {String} [unsignedMode] Правило округления, уже переписанное для величины
 * @returns {Object} Части представления числами
 */
function toStandardFormParts(numericValue, unsignedMode) {
  const absValue = Math.abs(numericValue)

  if (absValue === 0) return toPlainParts(absValue, 3)

  // Порог проверяется по уже округлённому значению: 0.0999 должно попасть
  // в трёхзначную ветку как 0.100, а не уйти в экспоненциальную запись.
  const roundedToHundredths = roundTo(absValue, 2, unsignedMode)
  if (roundedToHundredths < 0.1)
    return toExponentialParts(absValue, unsignedMode)

  const roundedToThousandths = roundTo(absValue, 3, unsignedMode)
  if (roundedToThousandths < 1) return toPlainParts(roundedToThousandths, 3)

  if (roundedToHundredths < 10) return toPlainParts(roundedToHundredths, 2)

  const roundedToTenths = roundTo(absValue, 1, unsignedMode)
  if (roundedToTenths < 100) return toPlainParts(roundedToTenths, 1)

  const roundedToInteger = roundTo(absValue, 0, unsignedMode)
  if (roundedToInteger < 1000) return toPlainParts(roundedToInteger, 0)

  // В экспоненциальную ветку уходит исходная величина, а не округлённая:
  // округление до нужного числа значащих цифр выполняется за один шаг,
  // ступенчатое накапливает смещение — 1004.5 через целое даёт 1.01×10^3.
  return toExponentialParts(absValue, unsignedMode)
}

/** Объект для непригодного значения: строки пусты, признаки сброшены */
const EMPTY_STANDARD_FORM = Object.freeze({
  negative: false,
  integer: '',
  fraction: '',
  base: '',
  exponentNegative: false,
  exponent: '',
})

/**
 * Собирает представление числа данными, без глифов
 * @param {Number} numericValue Разобранное число, любого знака
 * @param {String} [roundingMode] Правило округления, значения те же, что у Intl.NumberFormat
 * @returns {Object} Стандартное представление числа { negative, integer, fraction, base, exponentNegative, exponent }
 * @throws {Error} Если число невозможно представить в стандартном виде
 * @throws {RangeError} Если правило округления неизвестно
 */
function toStandardFormObjectOrThrow(numericValue, roundingMode) {
  const isNegative = numericValue < 0
  const unsignedMode = toUnsignedRoundingMode(roundingMode, isNegative)

  const { mantissa, decimalPlaces, base, exponent } = toStandardFormParts(
    numericValue,
    unsignedMode
  )

  // Ноль выходит из toPlainParts с тремя знаками, а записывается с двумя: 0.00.
  const places = mantissa != 0 ? decimalPlaces : 2

  return {
    negative: isNegative,
    ...splitDigits(roundTo(mantissa, places, unsignedMode), places),
    base: base === null ? '' : String(base),
    exponentNegative: exponent !== null && exponent < 0,
    exponent: exponent === null ? '' : String(Math.abs(exponent)),
  }
}

/**
 * Возвращает объект, содержащий представление числа в стандартном виде или в обычном виде в зависимости от величины числа
 *
 * Объект несёт данные, а не типографику: знаки — признаками, цифры — строками
 * без разделителя. Какой глиф ставить для разделителя и минуса, решает тот,
 * кто строит вывод.
 * @param {*} value Значение для форматирования
 * @param {Object} [options] Настройки форматирования
 * @param {String} [options.roundingMode] Правило округления, значения те же, что у Intl.NumberFormat
 * @returns {Object} Стандартное представление числа { negative, integer, fraction, base, exponentNegative, exponent }
 * @throws {RangeError} Если правило округления неизвестно
 */
export function toStandardFormObject(value, { roundingMode } = {}) {
  const numericValue = parseNumeric(value)

  if (numericValue === null) return { ...EMPTY_STANDARD_FORM }

  return toStandardFormObjectOrThrow(numericValue, roundingMode)
}

/**
 * Возвращает строковое представление числа в стандартном виде или в обычном виде в зависимости от величины числа
 * @param {*} value Значение для форматирования
 * @param {Object} [options] Настройки форматирования
 * @param {String} [options.roundingMode] Правило округления, значения те же, что у Intl.NumberFormat
 * @returns {String} Строковое представление числа
 * @throws {RangeError} Если правило округления неизвестно
 */
export function toStandardFormString(value, options) {
  const { negative, integer, fraction, base, exponentNegative, exponent } =
    toStandardFormObject(value, options)

  if (!integer) return ''

  const sign = negative ? '-' : ''
  const mantissa = fraction ? `${integer}.${fraction}` : integer

  if (!exponent) return `${sign}${mantissa}`

  const exponentSign = exponentNegative ? '-' : ''

  return `${sign}${mantissa}×${base}^${exponentSign}${exponent}`
}
