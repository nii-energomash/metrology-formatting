import { parseNumeric, roundTo, splitExponential } from './numeric'

// Знак снимается один раз, в toStandardFormParts, и ниже его не существует:
// форму представления определяет только величина. Поэтому toExponentialParts
// и toPlainParts принимают величину, а не число — подача им отрицательного
// не даст ни исключения, ни верного ответа: знак уедет в мантиссу, и вызывающий
// припишет к ней второй.

/**
 * Раскладывает величину на мантиссу и десятичный порядок
 * @param {Number} absValue Величина числа, строго больше нуля
 * @returns {Object} Части представления числами
 * @throws {Error} Если величина равна нулю
 */
function toExponentialParts(absValue) {
  // Разложение нуля молчит: (0).toExponential() даёт "0e+0", то есть нулевую
  // мантиссу вместо величины из [1, 10). Стандартного вида у нуля нет.
  if (absValue === 0)
    throw new Error('Невозможно представить ноль в стандартном виде')

  const { mantissa, exponent } = splitExponential(absValue)

  // Округление до двух знаков может дать перенос через разряд: 9.995 -> 10.
  // Мантисса стандартного вида лежит в [1, 10), поэтому перенос уходит
  // в порядок. Результат переноса всегда ровно десять, делить нечего.
  const roundedMantissa = roundTo(mantissa, 2)

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
 * @returns {Object} Части представления числами
 */
function toStandardFormParts(numericValue) {
  const absValue = Math.abs(numericValue)

  if (absValue === 0) return toPlainParts(absValue, 3)

  // Порог проверяется по уже округлённому значению: 0.0999 должно попасть
  // в трёхзначную ветку как 0.100, а не уйти в экспоненциальную запись.
  const roundedToHundredths = roundTo(absValue, 2)
  if (roundedToHundredths < 0.1) return toExponentialParts(absValue)

  const roundedToThousandths = roundTo(absValue, 3)
  if (roundedToThousandths < 1) return toPlainParts(roundedToThousandths, 3)

  if (roundedToHundredths < 10) return toPlainParts(roundedToHundredths, 2)

  const roundedToTenths = roundTo(absValue, 1)
  if (roundedToTenths < 100) return toPlainParts(roundedToTenths, 1)

  const roundedToInteger = roundTo(absValue, 0)
  if (roundedToInteger < 1000) return toPlainParts(roundedToInteger, 0)

  // В экспоненциальную ветку уходит исходная величина, а не округлённая:
  // округление до нужного числа значащих цифр выполняется за один шаг,
  // ступенчатое накапливает смещение — 1004.5 через целое даёт 1.01×10^3.
  return toExponentialParts(absValue)
}

/**
 * Записывает мантиссу строкой с заданным количеством знаков после запятой
 * @param {Number} mantissa Мантисса числом
 * @param {Number} decimalPlaces Количество знаков после запятой
 * @returns {String} Мантисса строкой
 */
function formatMantissa(mantissa, decimalPlaces) {
  // Округление выполняет roundTo, toFixed остаётся только дописать знаки:
  // сам по себе он округляет двоичное значение, а не десятичное.
  return roundTo(mantissa, decimalPlaces).toFixed(decimalPlaces)
}

/**
 * Собирает представление числа строками
 * @param {Number} numericValue Разобранное число, любого знака
 * @returns {Object} Стандартное представление числа { sign, mantissa, base, exponent }
 * @throws {Error} Если число невозможно представить в стандартном виде
 */
function toStandardFormObjectOrThrow(numericValue) {
  const { mantissa, decimalPlaces, base, exponent } =
    toStandardFormParts(numericValue)

  return {
    sign: numericValue < 0 ? '-' : '',
    mantissa: formatMantissa(mantissa, mantissa != 0 ? decimalPlaces : 2),
    base: base === null ? '' : String(base),
    exponent: exponent === null ? '' : String(exponent),
  }
}

/**
 * Возвращает объект, содержащий представление числа в стандартном виде или в обычном виде в зависимости от величины числа
 * @param {*} value Значение для форматирования
 * @returns {Object} Стандартное представление числа { sign, mantissa, base, exponent }, содержащее строки
 */
export function toStandardFormObject(value) {
  const numericValue = parseNumeric(value)

  if (numericValue === null)
    return {
      sign: '',
      mantissa: '',
      base: '',
      exponent: '',
    }

  return toStandardFormObjectOrThrow(numericValue)
}

/**
 * Возвращает строковое представление числа в стандартном виде или в обычном виде в зависимости от величины числа
 * @param {*} value Значение для форматирования
 * @returns {String} Строковое представление числа
 */
export function toStandardFormString(value) {
  const { sign, mantissa, base, exponent } = toStandardFormObject(value)

  if (!mantissa) return ''

  if (mantissa == 0) return '0.00'

  if (!base) return `${sign}${mantissa}`

  return `${sign}${mantissa}×${base}^${exponent}`
}
