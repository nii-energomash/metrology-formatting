import { parseNumericOrThrow, roundTo } from './numeric'

// Знак снимается один раз, в toStandardFormParts, и ниже его не существует:
// форму представления определяет только величина. Поэтому toExponentialParts
// и toPlainParts принимают величину, а не число — подача им отрицательного не
// даст ни исключения, ни неверного ответа, а подвесит поток на цикле
// в toExponentialParts.

/**
 * Раскладывает величину на мантиссу и десятичный порядок
 * @param {Number} absValue Величина числа, строго больше нуля
 * @returns {Object} Части представления числами
 * @throws {Error} Если величина равна нулю
 */
function toExponentialParts(absValue) {
  // Не только запрет бессмысленной операции: на нуле цикл ниже не завершится,
  // потому что умножение нуля на десять из диапазона [0, 1) не выводит.
  if (absValue === 0)
    throw new Error('Невозможно представить ноль в стандартном виде')

  let mantissa = absValue
  let exponent = 0

  // Приведение к диапазону [1, 10): число шагов и есть десятичный порядок
  if (mantissa < 1) {
    while (mantissa < 1) {
      mantissa *= 10
      exponent--
    }
  } else {
    while (mantissa >= 10) {
      mantissa /= 10
      exponent++
    }
  }

  return { mantissa, decimalPlaces: 2, base: 10, exponent }
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

  return toExponentialParts(roundedToInteger)
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
    mantissa: mantissa.toFixed(mantissa != 0 ? decimalPlaces : 2),
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
  try {
    return toStandardFormObjectOrThrow(parseNumericOrThrow(value))
  } catch {
    return {
      sign: '',
      mantissa: '',
      base: '',
      exponent: '',
    }
  }
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
