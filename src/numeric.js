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
 * Округляет число до указанного количества знаков после запятой
 * @param {Number} value Округляемое число
 * @param {Number} decimalPlaces Количество знаков после запятой
 * @returns {Number} Округлённое число
 */
export function roundTo(value, decimalPlaces) {
  const multiplier = Math.pow(10, decimalPlaces)
  return Math.round(value * multiplier) / multiplier
}
