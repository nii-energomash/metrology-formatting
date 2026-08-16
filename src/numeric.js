/**
 * Приводит значение к числу, пригодному для форматирования
 * @param {*} value Значение для разбора
 * @returns {Number} Числовое представление значения
 * @throws {Error} Если значение не может быть представлено числом
 */
export function parseNumericOrThrow(value) {
  // Глобальный isFinite приводит аргумент к числу, в отличие от Number.isFinite,
  // и потому пропускает числа, записанные строкой, — это поддержанный вход.
  if (!isFinite(value))
    throw new Error('Значение не может быть представлено числом')

  const numericValue = parseFloat(value)

  if (isNaN(numericValue)) throw new Error('Значение является NaN')

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
