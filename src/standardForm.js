import {
  parseNumeric,
  roundTo,
  splitDigits,
  splitExponential,
  toUnsignedRoundingMode,
} from './numeric'
import { joinNumber, resolveSymbols, toSuperscript } from './symbols'

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
 *
 * По умолчанию разделитель — точка, минус — дефис, порядок надстрочный, знак умножения — точка: 4.52·10³.
 * Для обратного разбора служит запись e (4.52e3), её понимает Number().
 * HTML-разметку функция не порождает — для неё есть toStandardFormObject.
 * @param {*} value Значение для форматирования
 * @param {Object} [options] Настройки форматирования
 * @param {String} [options.roundingMode] Правило округления, значения те же, что у Intl.NumberFormat
 * @param {String} [options.decimal] Десятичный разделитель, по умолчанию '.'
 * @param {String} [options.minusSign] Знак минуса, по умолчанию '-'
 * @param {String} [options.invalid] Текст для непригодного значения, по умолчанию ''
 * @param {String} [options.exponentSeparator] Знак между мантиссой и основанием, по умолчанию '·' (U+00B7); в записи e не используется
 * @param {String} [options.exponentStyle] Запись порядка: 'superscript' (10⁻², по умолчанию), 'caret' (10^-2) или 'e' (e-2)
 * @param {String} [options.exponentMinusSign] Минус в порядке, по умолчанию '⁻' при superscript и '-' в остальных записях
 * @returns {String} Строковое представление числа
 * @throws {RangeError} Если правило округления или способ записи порядка неизвестны
 */
export function toStandardFormString(value, options) {
  const symbols = resolveSymbols(options)
  const parts = toStandardFormObject(value, options)

  if (!parts.integer) return symbols.invalid

  const mantissa = joinNumber(parts, symbols)

  if (!parts.exponent) return mantissa

  const exponentSign = parts.exponentNegative ? symbols.exponentMinusSign : ''

  // Буква e заменяет весь фрагмент «×10^», как exponentSeparator в Intl:
  // ни разделитель, ни основание в этой записи не выводятся.
  if (symbols.exponentStyle === 'e')
    return `${mantissa}e${exponentSign}${parts.exponent}`

  const power =
    symbols.exponentStyle === 'superscript'
      ? `${exponentSign}${toSuperscript(parts.exponent)}`
      : `^${exponentSign}${parts.exponent}`

  return `${mantissa}${symbols.exponentSeparator}${parts.base}${power}`
}
