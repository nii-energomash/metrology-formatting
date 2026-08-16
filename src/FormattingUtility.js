import { toPercentageString } from './percentage'
import { toStandardFormObject, toStandardFormString } from './standardForm'

/**
 * Форматирование значений в указанный формат.
 *
 * Неймспейс-объект по образцу Math и JSON: экземпляров у него не бывает.
 */
export default Object.freeze({
  toPercentageString,
  toStandardFormString,
  toStandardFormObject,
})
