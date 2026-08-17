import { describe, it, expect } from 'vitest'
import FormattingUtility from '../src/FormattingUtility'

describe('Передаем неподходящие значения', () => {
  it('Когда не переданы параметры, вернуть пустую строку', () => {
    expect(FormattingUtility.toStandardFormString()).toBe('')
  })

  it('null -> "". Когда передан null, вернуть пустую строку', () => {
    expect(FormattingUtility.toStandardFormString(null)).toBe('')
  })

  it('"" -> "". Когда передана пустая строка, вернуть пустую строку', () => {
    expect(FormattingUtility.toStandardFormString('')).toBe('')
  })

  it('"asdf" -> "". Когда передана некорректная строка, вернуть пустую строку', () => {
    expect(FormattingUtility.toStandardFormString('asdf')).toBe('')
  })

  it('new Date() -> "". Когда передана дата, вернуть пустую строку', () => {
    expect(FormattingUtility.toStandardFormString(new Date())).toBe('')
  })

  it('{} -> "". Когда передан объект, вернуть пустую строку', () => {
    expect(FormattingUtility.toStandardFormString({})).toBe('')
  })

  it('"-2,16" -> "". Когда разделитель в строке не равен точке, вернуть пустую строку', () => {
    expect(FormattingUtility.toPercentageString('-2,16')).toBe('')
  })
})

describe('Передаем корректные значения в виде строки', () => {
  it('0 -> "0.00". Число равно нулю, вернуть ноль - 0', () => {
    expect(FormattingUtility.toStandardFormString('0')).toBe('0.00')
  })
})

describe('Передаем корректные значения', () => {
  it('-2.16 -> "-2.16". Отрицательное число, вернуть число, округленное по банковским правилам в большую сторону', () => {
    expect(FormattingUtility.toStandardFormString(-2.16)).toBe('-2.16')
  })

  it('0 -> "0.00". Число равно нулю, вернуть ноль - 0', () => {
    expect(FormattingUtility.toStandardFormString(0)).toBe('0.00')
  })

  it('-12345 -> "1.23×10^4". Число < 1000, вернуть в стандартном виде', () => {
    expect(FormattingUtility.toStandardFormString(-12345)).toBe('-1.23×10^4')
  })

  it('12345 -> "1.23×10^4". Число > 1000, вернуть в стандартном виде', () => {
    expect(FormattingUtility.toStandardFormString(12345)).toBe('1.23×10^4')
  })

  it('1000 -> "1.00×10^3". Число = 1000, вернуть в стандартном виде', () => {
    expect(FormattingUtility.toStandardFormString(1000)).toBe('1.00×10^3')
  })

  it('999.99 -> "1.00×10^3". Число менее 1000 на 0.01, вернуть в стандартном виде', () => {
    expect(FormattingUtility.toStandardFormString(999.99)).toBe('1.00×10^3')
  })

  it('9995 -> "1.00×10^4". Округление мантиссы даёт перенос, поднять порядок', () => {
    expect(FormattingUtility.toStandardFormString(9995)).toBe('1.00×10^4')
  })

  it('99950 -> "1.00×10^5". Округление мантиссы даёт перенос, поднять порядок', () => {
    expect(FormattingUtility.toStandardFormString(99950)).toBe('1.00×10^5')
  })

  it('1004.5 -> "1.00×10^3". Округление выполняется от исходного числа, а не от целого', () => {
    expect(FormattingUtility.toStandardFormString(1004.5)).toBe('1.00×10^3')
  })

  it('123.45 -> "123". Число > 100, вернуть целое число', () => {
    expect(FormattingUtility.toStandardFormString(123.45)).toBe('123')
  })

  it('100 -> "100". Число = 100, вернуть целое число', () => {
    expect(FormattingUtility.toStandardFormString(100)).toBe('100')
  })

  it('99.99 -> "100". Число менее 100 на 0.01, вернуть целое число', () => {
    expect(FormattingUtility.toStandardFormString(99.99)).toBe('100')
  })

  it('12.345 -> "12.3". Число > 10, вернуть десятичное число с одним знаком после запятой', () => {
    expect(FormattingUtility.toStandardFormString(12.345)).toBe('12.3')
  })

  it('12.000 -> "12.0". Число > 10, вернуть десятичное число с одним знаком после запятой', () => {
    expect(FormattingUtility.toStandardFormString(12.0)).toBe('12.0')
  })

  it('10 -> "10.0". Число = 10, вернуть десятичное число с одним знаком после запятой', () => {
    expect(FormattingUtility.toStandardFormString(10)).toBe('10.0')
  })

  it('9.999 -> "10.0". Число менее 10 на 0.001, вернуть десятичное число с одним знаком после запятой', () => {
    expect(FormattingUtility.toStandardFormString(9.999)).toBe('10.0')
  })

  it('9.995 -> "10.0". Округление до сотых даёт десять, вернуть десятичное число с одним знаком после запятой', () => {
    expect(FormattingUtility.toStandardFormString(9.995)).toBe('10.0')
  })

  it('1.2345 -> "1.23". Число > 1, вернуть десятичное число с двумя знаками после запятой', () => {
    expect(FormattingUtility.toStandardFormString(1.2345)).toBe('1.23')
  })

  it('1.2000 -> "1.20". Число > 1, вернуть десятичное число с двумя знаками после запятой', () => {
    expect(FormattingUtility.toStandardFormString(1.2)).toBe('1.20')
  })

  it('1 -> "1.00". Число = 1, вернуть десятичное число с двумя знаками после запятой', () => {
    expect(FormattingUtility.toStandardFormString(1)).toBe('1.00')
  })

  it('0.9999 -> "1.00". Число менее 1 на 0.0001, вернуть десятичное число с двумя знаками после запятой', () => {
    expect(FormattingUtility.toStandardFormString(0.9999)).toBe('1.00')
  })

  it('0.12345 -> "0.123". Число > 0.1, вернуть десятичное число с тремя знаками после запятой', () => {
    expect(FormattingUtility.toStandardFormString(0.123)).toBe('0.123')
  })

  it('0.10000 -> "0.100". Число > 0.1, вернуть десятичное число с тремя знаками после запятой', () => {
    expect(FormattingUtility.toStandardFormString(0.1)).toBe('0.100')
  })

  it('0.1 -> "0.100". Число = 0.1, вернуть десятичное число с тремя знаками после запятой', () => {
    expect(FormattingUtility.toStandardFormString(0.1)).toBe('0.100')
  })

  it('0.0999 -> "0.100". Число менее 0.1 на 0.0001, вернуть десятичное число с тремя знаками после запятой', () => {
    expect(FormattingUtility.toStandardFormString(0.0999)).toBe('0.100')
  })

  it('0.012345 -> "1.23×10^-2". Число менее 0.1, вернуть в стандартном виде', () => {
    expect(FormattingUtility.toStandardFormString(0.012345)).toBe('1.23×10^-2')
  })

  it('0.00009995 -> "1.00×10^-4". Округление мантиссы даёт перенос, поднять порядок', () => {
    expect(FormattingUtility.toStandardFormString(0.00009995)).toBe(
      '1.00×10^-4'
    )
  })
})

describe('Задаём правило округления', () => {
  it('Когда опции не переданы, округлять по halfExpand', () => {
    expect(FormattingUtility.toStandardFormString(9.995)).toBe(
      FormattingUtility.toStandardFormString(9.995, {
        roundingMode: 'halfExpand',
      })
    )
  })

  it('Когда объект опций пуст, округлять по правилу по умолчанию', () => {
    expect(FormattingUtility.toStandardFormString(9.995, {})).toBe('10.0')
  })

  it('9.995 -> "9.99" по trunc. Переноса через разряд не происходит', () => {
    expect(
      FormattingUtility.toStandardFormString(9.995, { roundingMode: 'trunc' })
    ).toBe('9.99')
  })

  it('2.113 -> "2.12" по ceil. Округление идёт вверх', () => {
    expect(
      FormattingUtility.toStandardFormString(2.113, { roundingMode: 'ceil' })
    ).toBe('2.12')
  })

  // Знак снимается до выбора формы записи, поэтому правило, отсчитанное
  // от знака, переписывается на равносильное беззнаковое. Проверки ниже ловят
  // подмену знака величиной: по величине -2.113 и 2.113 неразличимы,
  // а floor обязан развести их в разные стороны.
  it('-2.113 -> "-2.12" по floor. Направление отсчитывается от знака', () => {
    expect(
      FormattingUtility.toStandardFormString(-2.113, { roundingMode: 'floor' })
    ).toBe('-2.12')
  })

  it('-2.113 -> "-2.11" по trunc. Усечение идёт к нулю независимо от знака', () => {
    expect(
      FormattingUtility.toStandardFormString(-2.113, { roundingMode: 'trunc' })
    ).toBe('-2.11')
  })

  it('-9.995 -> "-10.0" по floor. Перенос через разряд на отрицательном', () => {
    expect(
      FormattingUtility.toStandardFormString(-9.995, { roundingMode: 'floor' })
    ).toBe('-10.0')
  })

  // Форму записи выбирает округлённая величина, поэтому правило способно
  // перевести число из десятичной ветки в экспоненциальную и обратно.
  it('0.0999 -> "9.99×10^-2" по trunc. Порог 0.1 не достигнут, уйти в стандартный вид', () => {
    expect(
      FormattingUtility.toStandardFormString(0.0999, { roundingMode: 'trunc' })
    ).toBe('9.99×10^-2')
  })

  it('-0.0999 -> "-0.100" по floor. Порог 0.1 достигнут, остаться в десятичной записи', () => {
    expect(
      FormattingUtility.toStandardFormString(-0.0999, { roundingMode: 'floor' })
    ).toBe('-0.100')
  })

  it('Когда правило неизвестно, бросить RangeError', () => {
    expect(() =>
      FormattingUtility.toStandardFormString(9.995, {
        roundingMode: 'halfeven',
      })
    ).toThrow(RangeError)
  })
})
