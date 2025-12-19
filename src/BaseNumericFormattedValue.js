/**
 * Базовый класс форматированных числовых значений
 */
export default class BaseNumericFormattedValue {
  rawValue = NaN
  numericValue = NaN

  _isCalculated = false

  constructor(value) {
    if (new.target === BaseNumericFormattedValue)
      throw new Error(`${new.target.name} нельзя инстанцировать напрямую`)

    this.rawValue = value
  }

  _ensureCalculateOrThrow() {
    if (!this._isCalculated) {
      this.numericValue = this._getValidNumericValueOrThrow()
      this._calculateOrThrow()
      this._isCalculated = true
    }
  }

  _getValidNumericValueOrThrow() {
    if (!isFinite(this.rawValue))
      throw new Error('Значение не может быть представлено числом')

    const numericValue = parseFloat(this.rawValue)

    if (isNaN(numericValue)) throw new Error('Значение является NaN')

    return numericValue
  }

  _roundTo(value, decimalPlaces) {
    const multiplier = Math.pow(10, decimalPlaces)
    return Math.round(value * multiplier) / multiplier
  }

  _calculateOrThrow() {
    throw new Error('Метод не переопределён')
  }
}
