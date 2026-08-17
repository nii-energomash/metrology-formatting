/**
 * Приводит значение к числу, пригодному для форматирования
 * @param {*} value Значение для разбора
 * @returns {Number|null} Числовое представление значения либо null, если значение непригодно
 */
export function parseNumeric(value) {
  // Глобальный isFinite приводит аргумент к числу, в отличие от Number.isFinite,
  // и потому пропускает числа, записанные строкой, — это поддержанный вход.
  if (!isFinite(value)) return null

  const numericValue = parseFloat(value)

  // Проверка не избыточна: '', null и [] проходят isFinite как ноль,
  // но parseFloat даёт по ним NaN.
  if (isNaN(numericValue)) return null

  return numericValue
}

/**
 * Раскладывает число на мантиссу из диапазона [1, 10) и десятичный порядок
 * @param {Number} value Раскладываемое число
 * @returns {Object} Части экспоненциальной записи числами { mantissa, exponent }
 */
export function splitExponential(value) {
  // Разложение берётся из toExponential, а не из деления на степень десяти:
  // toExponential отдаёт ровно столько цифр, сколько нужно для однозначного
  // представления числа, то есть то десятичное значение, которое написал
  // вызывающий, а не его двоичное приближение — у 2.15 это "2.15e+0", хотя
  // хранится 2.1499999999999999. Деление же вносит собственную погрешность,
  // причём накапливающуюся с числом шагов.
  //
  // Разбирается toExponential, а не String: у малых чисел строковое
  // представление уже экспоненциальное, но у остальных — нет.
  const [mantissa, exponent] = value.toExponential().split('e')
  return { mantissa: Number(mantissa), exponent: Number(exponent) }
}

/** Правило округления, применяемое, когда вызывающий не назвал своё */
const DEFAULT_ROUNDING_MODE = 'halfExpand'

// Форматтеры кэшируются, потому что их построение на порядок дороже самого
// форматирования: без кэша двести тысяч округлений занимают 6.7 с вместо 0.15 с.
// Расти кэшу некуда — decimalPlaces задаётся только внутри библиотеки и лежит
// в диапазоне 0…3, а правил округления девять.
const formatterCache = new Map()

/**
 * Отдаёт форматтер, округляющий до указанной точности по указанному правилу
 * @param {Number} decimalPlaces Количество знаков после запятой
 * @param {String} roundingMode Правило округления
 * @returns {Intl.NumberFormat} Форматтер
 * @throws {RangeError} Если правило округления неизвестно
 */
function getFormatter(decimalPlaces, roundingMode) {
  const key = `${roundingMode}:${decimalPlaces}`
  const cached = formatterCache.get(key)

  if (cached) return cached

  // Локаль и отключение группировки — требование к коду, а не оформление:
  // результат разбирается обратно через Number, и тому нужны ASCII-цифры,
  // точка в роли разделителя и отсутствие разделителей разрядов.
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
    roundingMode,
    useGrouping: false,
  })

  formatterCache.set(key, formatter)

  return formatter
}

// Правила, отсчитывающие направление от знака, а не от нуля. Для величины
// такое правило переписывается на равносильное ему беззнаковое, и переписать
// его надо, потому что в отрыве от знака оно означает уже не то: floor
// на отрицательном уводит от нуля, то есть по величине это expand.
// Таблица — GetUnsignedRoundingMode из ECMA-402; правила, не зависящие от
// знака, в ней отсутствуют и остаются собой.
const UNSIGNED_ROUNDING_MODES = {
  ceil: { positive: 'expand', negative: 'trunc' },
  floor: { positive: 'trunc', negative: 'expand' },
  halfCeil: { positive: 'halfExpand', negative: 'halfTrunc' },
  halfFloor: { positive: 'halfTrunc', negative: 'halfExpand' },
}

/**
 * Переписывает правило округления на равносильное ему правило для величины числа
 * @param {String} [roundingMode] Правило округления, значения те же, что у Intl.NumberFormat
 * @param {Boolean} isNegative Признак отрицательного числа
 * @returns {String|undefined} Правило, дающее на величине тот же результат
 */
export function toUnsignedRoundingMode(roundingMode, isNegative) {
  // Неизвестное правило проходит насквозь: сообщить о нём — дело Intl,
  // свой список значений тогда пришлось бы держать в актуальном состоянии.
  const equivalent = UNSIGNED_ROUNDING_MODES[roundingMode]

  if (!equivalent) return roundingMode

  return isNegative ? equivalent.negative : equivalent.positive
}

/**
 * Округляет число до указанного количества знаков после запятой
 * @param {Number} value Округляемое число
 * @param {Number} decimalPlaces Количество знаков после запятой
 * @param {String} [roundingMode] Правило округления, значения те же, что у Intl.NumberFormat
 * @returns {Number} Округлённое число
 * @throws {RangeError} Если правило округления неизвестно
 */
export function roundTo(
  value,
  decimalPlaces,
  roundingMode = DEFAULT_ROUNDING_MODE
) {
  // Округление отдано Intl.NumberFormat, а не собрано из Math.round и сдвига
  // порядка: ECMA-402 предписывает ему округлять кратчайшую десятичную запись
  // числа (ToIntlMathematicalValue берёт Number::toString), то есть ровно то
  // десятичное значение, которое написал вызывающий, а не его двоичное
  // приближение — у 2.675 это "2.675", хотя хранится 2.67499999999999982.
  // toFixed же округляет двоичное значение и даёт "2.67".
  //
  // Знак Intl обрабатывает сам, и снимать его нельзя: ceil и floor по
  // определению зависят от знака, а не от величины.
  return Number(getFormatter(decimalPlaces, roundingMode).format(value))
}
