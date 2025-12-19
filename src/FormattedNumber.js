import BaseNumericFormattedValue from "./BaseNumericFormattedValue"

/**
 * Форматированное число
 */
export default class FormattedNumber extends BaseNumericFormattedValue {
    #sign = null
    #mantissa = null
    #decimalPlaces = Infinity
    #base = null
    #exponent = null

    _calculateOrThrow() {
        const absValue = Math.abs(this.numericValue)

        if (absValue === 0) {
            this.#calculateSimpleStandardForm(this.numericValue, 3)
            return
        }

        const valueLessThanOneTenth = this._roundTo(absValue, 2)
        if (valueLessThanOneTenth < 0.1) {
            this.#calculateStandardForm(absValue)
            return
        }

        const valueLessThanOne = this._roundTo(absValue, 3)
        if (valueLessThanOne < 1) {
            this.#calculateSimpleStandardForm(valueLessThanOne, 3)
            return
        }

        const valueLessThanTen = this._roundTo(absValue, 2)
        if (valueLessThanTen < 10) {
            this.#calculateSimpleStandardForm(valueLessThanTen, 2)
            return
        }

        const valueLessThanHundred = this._roundTo(absValue, 1)
        if (valueLessThanHundred < 100) {
            this.#calculateSimpleStandardForm(valueLessThanHundred, 1)
            return
        }

        const valueLessThanThousand = this._roundTo(absValue, 0)
        if (valueLessThanThousand < 1000) {
            this.#calculateSimpleStandardForm(valueLessThanThousand, 0)
            return
        }

        const valueMoreThanThousand = this._roundTo(absValue, 0)
        this.#calculateStandardForm(valueMoreThanThousand)
    }

    #calculateStandardForm(value) {
        if (value === 0)
            throw new Error("Невозможно представить ноль в стандартном виде")

        let absNum = Math.abs(value)
        let exponent = 0

        // Для чисел меньше 1
        if (absNum < 1) {
            while (absNum < 1) {
                absNum *= 10
                exponent--
            }
        } else {
            // Для чисел больше или равных 10
            while (absNum >= 10) {
                absNum /= 10
                exponent++
            }
        }

        this.#sign = Math.sign(this.numericValue)
        this.#mantissa = Math.abs(absNum)
        this.#decimalPlaces = 2
        this.#base = 10
        this.#exponent = exponent
    }

    #calculateSimpleStandardForm(value, decimalPlaces = 0) {
        this.#sign = Math.sign(this.numericValue)
        this.#mantissa = Math.abs(value)
        this.#decimalPlaces = decimalPlaces
    }

    /**
     * Возвращает объект, содержащий представление числа в стандартном виде или в обычном виде в зависимости от величины числа
     * @returns {Object} Стандартное представление числа
     */
    toObjectValue() {
        try {
            this._ensureCalculateOrThrow()
            return {
                sign: Math.sign(this.#sign) === -1 ? '-' : '',
                mantissa: this.#mantissa != 0 ? this.#mantissa.toFixed(this.#decimalPlaces) : this.#mantissa.toFixed(2),
                base: this.#base ? '10' : '',
                exponent: this.#exponent ? this.#exponent.toString() : '',
            }
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
     * Возвращает числовое представление без форматирования
     * @returns {Number} Числовое представление без форматирования
     */
    toValue() { return this.numericValue }

    /**
     * Возвращает строковое представление числа в стандартном виде или в обычном виде в зависимости от величины числа
     * @returns {String} Строковое представление числа
     */
    toString() {
        var objectValue = this.toObjectValue()

        if (!objectValue.mantissa)
            return ''

        if (objectValue.mantissa == 0)
            return '0.00'

        if (!objectValue.base || !objectValue.exponent)
            return `${objectValue.sign}${objectValue.mantissa}`

        return `${objectValue.sign}${objectValue.mantissa}×${objectValue.base}^${objectValue.exponent}`
    }
}
