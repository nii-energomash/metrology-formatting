import BaseNumericFormattedValue from './BaseNumericFormattedValue'

/**
 * Форматированный процент
 */
export default class FormattedPercentage extends BaseNumericFormattedValue {
  _calculateOrThrow() {}

  /**
   * Вывод процента с точностью до 1 знака после запятой
   * @returns {String} Полученный результат в виде строки
   */
  toString() {
    try {
      this._ensureCalculateOrThrow()
      return this.numericValue.toFixed(1)
    } catch {
      return ''
    }
  }
}
