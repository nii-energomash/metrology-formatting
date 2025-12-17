import FormattedPercentage from './FormattedPercentage'
import FormattedNumber from './FormattedNumber'

/**
 * Форматирование значений в указанный формат
 */
export default class FormattingUtility {
    /**
     * Вывод числа в виде строки в процентном формате
     * @param {*} number Значение для форматирования
     * @returns Строка в процентах
     */
    static toPercentageString(number) {
        const percentagesString = new FormattedPercentage(number)
        return percentagesString.toString()
    }

    /**
     * Вывод числа в виде строки в стандартном виде
     * @param {*} number Значение для форматирования
     * @returns Строка в стандартном виде
     */
    static toStandardFormString(number) {
        const formattedNumber = new FormattedNumber(number)
        return formattedNumber.toString()
    }

    /**
     * Вывод числа в виде объекта в стандартном виде
     * @param {*} number Значение для форматирования
     * @returns Объект в стандартном виде { sign, mantissa, base, exponent }, содержащий строки
     */
    static toStandardFormObject(number) {
        const formattedNumber = new FormattedNumber(number)
        return formattedNumber.toObjectValue()
    }
}
