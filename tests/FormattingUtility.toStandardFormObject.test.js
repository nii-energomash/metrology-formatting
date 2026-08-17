import { describe, it, expect } from 'vitest'
import FormattingUtility from '../src/FormattingUtility'

describe('Передаем неподходящие значения', () => {
  it('Когда не переданы параметры, вернуть объект, содержащий пустые строки', () => {
    const result = FormattingUtility.toStandardFormObject()
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('')
    expect(result.base).toBe('')
    expect(result.exponent).toBe('')
  })

  it('null -> {,,,,}. Когда передан null, вернуть объект, содержащий пустые строки', () => {
    const result = FormattingUtility.toStandardFormObject(null)
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('')
    expect(result.base).toBe('')
    expect(result.exponent).toBe('')
  })

  it('"" -> {,,,,}. Когда передана пустая строка, вернуть объект, содержащий пустые строки', () => {
    const result = FormattingUtility.toStandardFormObject('')
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('')
    expect(result.base).toBe('')
    expect(result.exponent).toBe('')
  })

  it('"asdf" -> {,,,,}. Когда передана некорректная строка, вернуть объект, содержащий пустые строки', () => {
    const result = FormattingUtility.toStandardFormObject('asdf')
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('')
    expect(result.base).toBe('')
    expect(result.exponent).toBe('')
  })

  it('new Date() -> {,,,,}. Когда передана дата, вернуть объект, содержащий пустые строки', () => {
    const result = FormattingUtility.toStandardFormObject(new Date())
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('')
    expect(result.base).toBe('')
    expect(result.exponent).toBe('')
  })

  it('{} -> {,,,,}. Когда передан объект, вернуть объект, содержащий пустые строки', () => {
    const result = FormattingUtility.toStandardFormObject({})
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('')
    expect(result.base).toBe('')
    expect(result.exponent).toBe('')
  })

  it('"-2,16" -> {,,,,}. Когда разделитель в строке не равен точке, вернуть объект, содержащий пустые строки', () => {
    const result = FormattingUtility.toStandardFormObject('-2,16')
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('')
    expect(result.base).toBe('')
    expect(result.exponent).toBe('')
  })
})

describe('Передаем корректные значения в виде строки', () => {
  it('0 -> {,0.00,,,}. Число равно нулю, вернуть корректный объект', () => {
    const result = FormattingUtility.toStandardFormObject('0')
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('0.00')
    expect(result.base).toBe('')
    expect(result.exponent).toBe('')
  })
})

describe('Передаем корректные значения', () => {
  it('-2.16 -> "-2.16". Отрицательное число, вернуть вернуть корректный объект', () => {
    const result = FormattingUtility.toStandardFormObject(-2.16)
    expect(result.sign).toBe('-')
    expect(result.mantissa).toBe('2.16')
    expect(result.base).toBe('')
    expect(result.exponent).toBe('')
  })

  it('0 -> {,0.00,,,}. Число равно нулю, вернуть корректный объект', () => {
    const result = FormattingUtility.toStandardFormObject(0)
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('0.00')
    expect(result.base).toBe('')
    expect(result.exponent).toBe('')
  })

  it('-12345 -> {"1.23×10^4"}. Число < 1000, вернуть в стандартном виде', () => {
    const result = FormattingUtility.toStandardFormObject(-12345)
    expect(result.sign).toBe('-')
    expect(result.mantissa).toBe('1.23')
    expect(result.base).toBe('10')
    expect(result.exponent).toBe('4')
  })

  it('12345 -> {"1.23×10^4"}. Число > 1000, вернуть в стандартном виде', () => {
    const result = FormattingUtility.toStandardFormObject(12345)
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('1.23')
    expect(result.base).toBe('10')
    expect(result.exponent).toBe('4')
  })

  it('1000 -> {"1.00×10^3"}. Число = 1000, вернуть в стандартном виде', () => {
    const result = FormattingUtility.toStandardFormObject(1000)
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('1.00')
    expect(result.base).toBe('10')
    expect(result.exponent).toBe('3')
  })

  it('999.99 -> {"1.00×10^3"}. Число менее 1000 на 0.01, вернуть в стандартном виде', () => {
    const result = FormattingUtility.toStandardFormObject(999.99)
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('1.00')
    expect(result.base).toBe('10')
    expect(result.exponent).toBe('3')
  })

  it('9995 -> {"1.00×10^4"}. Округление мантиссы даёт перенос, поднять порядок', () => {
    const result = FormattingUtility.toStandardFormObject(9995)
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('1.00')
    expect(result.base).toBe('10')
    expect(result.exponent).toBe('4')
  })

  it('99950 -> {"1.00×10^5"}. Округление мантиссы даёт перенос, поднять порядок', () => {
    const result = FormattingUtility.toStandardFormObject(99950)
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('1.00')
    expect(result.base).toBe('10')
    expect(result.exponent).toBe('5')
  })

  it('1004.5 -> {"1.00×10^3"}. Округление выполняется от исходного числа, а не от целого', () => {
    const result = FormattingUtility.toStandardFormObject(1004.5)
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('1.00')
    expect(result.base).toBe('10')
    expect(result.exponent).toBe('3')
  })

  it('123.45 -> {"123"}. Число > 100, вернуть целое число', () => {
    const result = FormattingUtility.toStandardFormObject(123.45)
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('123')
    expect(result.base).toBe('')
    expect(result.exponent).toBe('')
  })

  it('100 -> {"100"}. Число = 100, вернуть целое число', () => {
    const result = FormattingUtility.toStandardFormObject(100)
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('100')
    expect(result.base).toBe('')
    expect(result.exponent).toBe('')
  })

  it('99.99 -> {"100"}. Число менее 100 на 0.01, вернуть целое число', () => {
    const result = FormattingUtility.toStandardFormObject(99.99)
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('100')
    expect(result.base).toBe('')
    expect(result.exponent).toBe('')
  })

  it('12.345 -> {"12.3"}. Число > 10, вернуть десятичное число с одним знаком после запятой', () => {
    const result = FormattingUtility.toStandardFormObject(12.345)
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('12.3')
    expect(result.base).toBe('')
    expect(result.exponent).toBe('')
  })

  it('12.000 -> {"12.0"}. Число > 10, вернуть десятичное число с одним знаком после запятой', () => {
    const result = FormattingUtility.toStandardFormObject(12.0)
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('12.0')
    expect(result.base).toBe('')
    expect(result.exponent).toBe('')
  })

  it('10 -> {"10.0"}. Число = 10, вернуть десятичное число с одним знаком после запятой', () => {
    const result = FormattingUtility.toStandardFormObject(10)
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('10.0')
    expect(result.base).toBe('')
    expect(result.exponent).toBe('')
  })

  it('9.999 -> {"10.0"}. Число менее 10 на 0.001, вернуть десятичное число с одним знаком после запятой', () => {
    const result = FormattingUtility.toStandardFormObject(9.999)
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('10.0')
    expect(result.base).toBe('')
    expect(result.exponent).toBe('')
  })

  it('1.2345 -> {"1.23"}. Число > 1, вернуть десятичное число с двумя знаками после запятой', () => {
    const result = FormattingUtility.toStandardFormObject(1.2345)
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('1.23')
    expect(result.base).toBe('')
    expect(result.exponent).toBe('')
  })

  it('1.2000 -> {"1.20"}. Число > 1, вернуть десятичное число с двумя знаками после запятой', () => {
    const result = FormattingUtility.toStandardFormObject(1.2)
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('1.20')
    expect(result.base).toBe('')
    expect(result.exponent).toBe('')
  })

  it('1 -> {"1.00"}. Число = 1, вернуть десятичное число с двумя знаками после запятой', () => {
    const result = FormattingUtility.toStandardFormObject(1)
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('1.00')
    expect(result.base).toBe('')
    expect(result.exponent).toBe('')
  })

  it('0.9999 -> {"1.00"}. Число менее 1 на 0.0001, вернуть десятичное число с двумя знаками после запятой', () => {
    const result = FormattingUtility.toStandardFormObject(0.9999)
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('1.00')
    expect(result.base).toBe('')
    expect(result.exponent).toBe('')
  })

  it('0.12345 -> {"0.123"}. Число > 0.1, вернуть десятичное число с тремя знаками после запятой', () => {
    const result = FormattingUtility.toStandardFormObject(0.12345)
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('0.123')
    expect(result.base).toBe('')
    expect(result.exponent).toBe('')
  })

  it('0.10000 -> {"0.100"}. Число > 0.1, вернуть десятичное число с тремя знаками после запятой', () => {
    const result = FormattingUtility.toStandardFormObject(0.1)
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('0.100')
    expect(result.base).toBe('')
    expect(result.exponent).toBe('')
  })

  it('0.1 -> {"0.100"}. Число = 0.1, вернуть десятичное число с тремя знаками после запятой', () => {
    const result = FormattingUtility.toStandardFormObject(0.1)
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('0.100')
    expect(result.base).toBe('')
    expect(result.exponent).toBe('')
  })

  it('0.0999 -> {"0.100"}. Число менее 0.1 на 0.0001, вернуть десятичное число с тремя знаками после запятой', () => {
    const result = FormattingUtility.toStandardFormObject(0.0999)
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('0.100')
    expect(result.base).toBe('')
    expect(result.exponent).toBe('')
  })

  it('0.012345 -> {"1.23×10^-2"}. Число менее 0.1, вернуть в стандартном виде', () => {
    const result = FormattingUtility.toStandardFormObject(0.012345)
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('1.23')
    expect(result.base).toBe('10')
    expect(result.exponent).toBe('-2')
  })

  it('0.00009995 -> {"1.00×10^-4"}. Округление мантиссы даёт перенос, поднять порядок', () => {
    const result = FormattingUtility.toStandardFormObject(0.00009995)
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('1.00')
    expect(result.base).toBe('10')
    expect(result.exponent).toBe('-4')
  })
})

describe('Задаём правило округления', () => {
  it('Когда опции не переданы, округлять по halfExpand', () => {
    expect(FormattingUtility.toStandardFormObject(9.995)).toEqual(
      FormattingUtility.toStandardFormObject(9.995, {
        roundingMode: 'halfExpand',
      })
    )
  })

  it('9.995 -> {"9.99"} по trunc. Переноса через разряд не происходит', () => {
    const result = FormattingUtility.toStandardFormObject(9.995, {
      roundingMode: 'trunc',
    })
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('9.99')
    expect(result.base).toBe('')
    expect(result.exponent).toBe('')
  })

  it('0.00009995 -> {"9.99×10^-5"} по trunc. Переноса нет, порядок не поднимается', () => {
    const result = FormattingUtility.toStandardFormObject(0.00009995, {
      roundingMode: 'trunc',
    })
    expect(result.sign).toBe('')
    expect(result.mantissa).toBe('9.99')
    expect(result.base).toBe('10')
    expect(result.exponent).toBe('-5')
  })

  // Знак снимается до выбора формы записи, поэтому правило, отсчитанное
  // от знака, переписывается на равносильное беззнаковое.
  it('-0.0999 -> {"0.100"} по floor. Порог 0.1 достигнут, остаться в десятичной записи', () => {
    const result = FormattingUtility.toStandardFormObject(-0.0999, {
      roundingMode: 'floor',
    })
    expect(result.sign).toBe('-')
    expect(result.mantissa).toBe('0.100')
    expect(result.base).toBe('')
    expect(result.exponent).toBe('')
  })

  it('Когда правило неизвестно, бросить RangeError', () => {
    expect(() =>
      FormattingUtility.toStandardFormObject(9.995, {
        roundingMode: 'halfeven',
      })
    ).toThrow(RangeError)
  })
})
