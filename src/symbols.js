// Набор символов строкового вывода — по образцу DecimalFormatSymbols из Java
// и ICU: модель числа отдельно, глифы отдельно. Символы, зависящие от локали
// (разделитель, вид минуса), по умолчанию нейтральны: точка и дефис. Запись
// порядка от локали не зависит и по умолчанию надстрочная.

/** Способы записи порядка */
const EXPONENT_STYLES = ['superscript', 'caret', 'e']

/** Надстрочные цифры: ¹²³ лежат в блоке Latin-1, остальные — в U+2070…U+2079 */
const SUPERSCRIPT_DIGITS = [
  '\u2070',
  '\u00b9',
  '\u00b2',
  '\u00b3',
  '\u2074',
  '\u2075',
  '\u2076',
  '\u2077',
  '\u2078',
  '\u2079',
]

/** Надстрочный минус */
const SUPERSCRIPT_MINUS = '\u207b'

/**
 * Дополняет настройки умолчаниями и проверяет способ записи порядка
 * @param {Object} [options] Настройки форматирования
 * @param {String} [options.decimal] Десятичный разделитель
 * @param {String} [options.minusSign] Знак минуса
 * @param {String} [options.invalid] Текст для непригодного значения
 * @param {String} [options.percentSign] Знак процента, дописываемый в конец
 * @param {String} [options.exponentSeparator] Знак между мантиссой и основанием; в записи e не используется
 * @param {String} [options.exponentStyle] Способ записи порядка: superscript, caret или e
 * @param {String} [options.exponentMinusSign] Знак минуса в порядке
 * @returns {Object} Символы со всеми полями
 * @throws {RangeError} Если способ записи порядка неизвестен
 */
export function resolveSymbols({
  decimal = '.',
  minusSign = '-',
  invalid = '',
  percentSign = '',
  exponentSeparator = '\u00b7',
  exponentStyle = 'superscript',
  exponentMinusSign,
} = {}) {
  if (!EXPONENT_STYLES.includes(exponentStyle))
    throw new RangeError(
      `Неизвестный способ записи порядка: ${exponentStyle}. Допустимы: ${EXPONENT_STYLES.join(', ')}`
    )

  return {
    decimal,
    minusSign,
    invalid,
    percentSign,
    exponentSeparator,
    exponentStyle,
    exponentMinusSign:
      exponentMinusSign ??
      (exponentStyle === 'superscript' ? SUPERSCRIPT_MINUS : '-'),
  }
}

/**
 * Записывает цифры надстрочными символами
 * @param {String} digits Строка из цифр 0–9
 * @returns {String} Те же цифры надстрочными символами
 */
export function toSuperscript(digits) {
  return Array.from(digits, digit => SUPERSCRIPT_DIGITS[digit]).join('')
}

/**
 * Записывает мантиссу или процент заданными символами
 * @param {Object} parts Знак и цифры { negative, integer, fraction }
 * @param {Object} symbols Символы, разрешённые resolveSymbols
 * @returns {String} Число со знаком и разделителем
 */
export function joinNumber({ negative, integer, fraction }, symbols) {
  const sign = negative ? symbols.minusSign : ''
  return fraction
    ? `${sign}${integer}${symbols.decimal}${fraction}`
    : `${sign}${integer}`
}
