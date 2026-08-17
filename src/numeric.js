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

/**
 * Сдвигает десятичный порядок числа на указанное количество разрядов
 * @param {Number} value Сдвигаемое число
 * @param {Number} places Количество разрядов, отрицательное сдвигает вправо
 * @returns {Number} Число со сдвинутым порядком
 */
function shiftExponent(value, places) {
  // Сдвиг порядка выполняется правкой текста записи, а не умножением на
  // степень десяти: новых цифр это не создаёт, а обратный разбор даёт
  // ближайшее к результату число, поэтому "2.15e1" превращается в ровно 21.5.
  // Умножение же вносит погрешность: 2.15 * 10 даёт 21.499999999999996,
  // и середина интервала округляется вниз вопреки правилу.
  //
  // Мантисса подставляется числом: она лежит в [1, 10), и её строковое
  // представление экспоненциальной формы не имеет.
  const { mantissa, exponent } = splitExponential(value)
  return Number(`${mantissa}e${exponent + places}`)
}

/**
 * Округляет число до указанного количества знаков после запятой.
 * Ровно на середине интервала округление идёт от нуля.
 * @param {Number} value Округляемое число
 * @param {Number} decimalPlaces Количество знаков после запятой
 * @returns {Number} Округлённое число
 */
export function roundTo(value, decimalPlaces) {
  // Знак снимается до округления и возвращается после: Math.round гонит
  // середину к плюс бесконечности, и на отрицательных правило без этого
  // отличалось бы от правила на положительных.
  const sign = value < 0 ? -1 : 1
  const shifted = shiftExponent(Math.abs(value), decimalPlaces)

  return sign * shiftExponent(Math.round(shifted), -decimalPlaces)
}
