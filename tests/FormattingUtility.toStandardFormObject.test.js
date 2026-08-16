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
})
