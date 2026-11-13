import { describe, it, expect } from 'vitest'
import FormattingUtility from '../src/FormattingUtility'

describe('Передаем неподходящие значения', () => {
  it('Когда не переданы параметры, вернуть объект с пустыми строками и сброшенными признаками', () => {
    const result = FormattingUtility.toStandardFormObject()
    expect(result).toEqual({
      negative: false,
      integer: '',
      fraction: '',
      base: '',
      exponentNegative: false,
      exponent: '',
    })
  })

  it('null -> {,,,,}. Когда передан null, вернуть объект с пустыми строками и сброшенными признаками', () => {
    const result = FormattingUtility.toStandardFormObject(null)
    expect(result).toEqual({
      negative: false,
      integer: '',
      fraction: '',
      base: '',
      exponentNegative: false,
      exponent: '',
    })
  })

  it('"" -> {,,,,}. Когда передана пустая строка, вернуть объект с пустыми строками и сброшенными признаками', () => {
    const result = FormattingUtility.toStandardFormObject('')
    expect(result).toEqual({
      negative: false,
      integer: '',
      fraction: '',
      base: '',
      exponentNegative: false,
      exponent: '',
    })
  })

  it('"asdf" -> {,,,,}. Когда передана некорректная строка, вернуть объект с пустыми строками и сброшенными признаками', () => {
    const result = FormattingUtility.toStandardFormObject('asdf')
    expect(result).toEqual({
      negative: false,
      integer: '',
      fraction: '',
      base: '',
      exponentNegative: false,
      exponent: '',
    })
  })

  it('new Date() -> {,,,,}. Когда передана дата, вернуть объект с пустыми строками и сброшенными признаками', () => {
    const result = FormattingUtility.toStandardFormObject(new Date())
    expect(result).toEqual({
      negative: false,
      integer: '',
      fraction: '',
      base: '',
      exponentNegative: false,
      exponent: '',
    })
  })

  it('{} -> {,,,,}. Когда передан объект, вернуть объект с пустыми строками и сброшенными признаками', () => {
    const result = FormattingUtility.toStandardFormObject({})
    expect(result).toEqual({
      negative: false,
      integer: '',
      fraction: '',
      base: '',
      exponentNegative: false,
      exponent: '',
    })
  })

  it('"-2,16" -> {,,,,}. Когда разделитель в строке не равен точке, вернуть объект с пустыми строками и сброшенными признаками', () => {
    const result = FormattingUtility.toStandardFormObject('-2,16')
    expect(result).toEqual({
      negative: false,
      integer: '',
      fraction: '',
      base: '',
      exponentNegative: false,
      exponent: '',
    })
  })
})

describe('Передаем корректные значения в виде строки', () => {
  it('0 -> {,0.00,,,}. Число равно нулю, вернуть корректный объект', () => {
    const result = FormattingUtility.toStandardFormObject('0')
    expect(result).toEqual({
      negative: false,
      integer: '0',
      fraction: '00',
      base: '',
      exponentNegative: false,
      exponent: '',
    })
  })
})

describe('Передаем корректные значения', () => {
  it('-2.16 -> "-2.16". Отрицательное число, вернуть вернуть корректный объект', () => {
    const result = FormattingUtility.toStandardFormObject(-2.16)
    expect(result).toEqual({
      negative: true,
      integer: '2',
      fraction: '16',
      base: '',
      exponentNegative: false,
      exponent: '',
    })
  })

  it('0 -> {,0.00,,,}. Число равно нулю, вернуть корректный объект', () => {
    const result = FormattingUtility.toStandardFormObject(0)
    expect(result).toEqual({
      negative: false,
      integer: '0',
      fraction: '00',
      base: '',
      exponentNegative: false,
      exponent: '',
    })
  })

  it('-12345 -> {"1.23×10^4"}. Число < 1000, вернуть в стандартном виде', () => {
    const result = FormattingUtility.toStandardFormObject(-12345)
    expect(result).toEqual({
      negative: true,
      integer: '1',
      fraction: '23',
      base: '10',
      exponentNegative: false,
      exponent: '4',
    })
  })

  it('12345 -> {"1.23×10^4"}. Число > 1000, вернуть в стандартном виде', () => {
    const result = FormattingUtility.toStandardFormObject(12345)
    expect(result).toEqual({
      negative: false,
      integer: '1',
      fraction: '23',
      base: '10',
      exponentNegative: false,
      exponent: '4',
    })
  })

  it('1000 -> {"1.00×10^3"}. Число = 1000, вернуть в стандартном виде', () => {
    const result = FormattingUtility.toStandardFormObject(1000)
    expect(result).toEqual({
      negative: false,
      integer: '1',
      fraction: '00',
      base: '10',
      exponentNegative: false,
      exponent: '3',
    })
  })

  it('999.99 -> {"1.00×10^3"}. Число менее 1000 на 0.01, вернуть в стандартном виде', () => {
    const result = FormattingUtility.toStandardFormObject(999.99)
    expect(result).toEqual({
      negative: false,
      integer: '1',
      fraction: '00',
      base: '10',
      exponentNegative: false,
      exponent: '3',
    })
  })

  it('9995 -> {"1.00×10^4"}. Округление мантиссы даёт перенос, поднять порядок', () => {
    const result = FormattingUtility.toStandardFormObject(9995)
    expect(result).toEqual({
      negative: false,
      integer: '1',
      fraction: '00',
      base: '10',
      exponentNegative: false,
      exponent: '4',
    })
  })

  it('99950 -> {"1.00×10^5"}. Округление мантиссы даёт перенос, поднять порядок', () => {
    const result = FormattingUtility.toStandardFormObject(99950)
    expect(result).toEqual({
      negative: false,
      integer: '1',
      fraction: '00',
      base: '10',
      exponentNegative: false,
      exponent: '5',
    })
  })

  it('1004.5 -> {"1.00×10^3"}. Округление выполняется от исходного числа, а не от целого', () => {
    const result = FormattingUtility.toStandardFormObject(1004.5)
    expect(result).toEqual({
      negative: false,
      integer: '1',
      fraction: '00',
      base: '10',
      exponentNegative: false,
      exponent: '3',
    })
  })

  it('123.45 -> {"123"}. Число > 100, вернуть целое число', () => {
    const result = FormattingUtility.toStandardFormObject(123.45)
    expect(result).toEqual({
      negative: false,
      integer: '123',
      fraction: '',
      base: '',
      exponentNegative: false,
      exponent: '',
    })
  })

  it('100 -> {"100"}. Число = 100, вернуть целое число', () => {
    const result = FormattingUtility.toStandardFormObject(100)
    expect(result).toEqual({
      negative: false,
      integer: '100',
      fraction: '',
      base: '',
      exponentNegative: false,
      exponent: '',
    })
  })

  it('99.99 -> {"100"}. Число менее 100 на 0.01, вернуть целое число', () => {
    const result = FormattingUtility.toStandardFormObject(99.99)
    expect(result).toEqual({
      negative: false,
      integer: '100',
      fraction: '',
      base: '',
      exponentNegative: false,
      exponent: '',
    })
  })

  it('12.345 -> {"12.3"}. Число > 10, вернуть десятичное число с одним знаком после запятой', () => {
    const result = FormattingUtility.toStandardFormObject(12.345)
    expect(result).toEqual({
      negative: false,
      integer: '12',
      fraction: '3',
      base: '',
      exponentNegative: false,
      exponent: '',
    })
  })

  it('12.000 -> {"12.0"}. Число > 10, вернуть десятичное число с одним знаком после запятой', () => {
    const result = FormattingUtility.toStandardFormObject(12.0)
    expect(result).toEqual({
      negative: false,
      integer: '12',
      fraction: '0',
      base: '',
      exponentNegative: false,
      exponent: '',
    })
  })

  it('10 -> {"10.0"}. Число = 10, вернуть десятичное число с одним знаком после запятой', () => {
    const result = FormattingUtility.toStandardFormObject(10)
    expect(result).toEqual({
      negative: false,
      integer: '10',
      fraction: '0',
      base: '',
      exponentNegative: false,
      exponent: '',
    })
  })

  it('9.999 -> {"10.0"}. Число менее 10 на 0.001, вернуть десятичное число с одним знаком после запятой', () => {
    const result = FormattingUtility.toStandardFormObject(9.999)
    expect(result).toEqual({
      negative: false,
      integer: '10',
      fraction: '0',
      base: '',
      exponentNegative: false,
      exponent: '',
    })
  })

  it('1.2345 -> {"1.23"}. Число > 1, вернуть десятичное число с двумя знаками после запятой', () => {
    const result = FormattingUtility.toStandardFormObject(1.2345)
    expect(result).toEqual({
      negative: false,
      integer: '1',
      fraction: '23',
      base: '',
      exponentNegative: false,
      exponent: '',
    })
  })

  it('1.2000 -> {"1.20"}. Число > 1, вернуть десятичное число с двумя знаками после запятой', () => {
    const result = FormattingUtility.toStandardFormObject(1.2)
    expect(result).toEqual({
      negative: false,
      integer: '1',
      fraction: '20',
      base: '',
      exponentNegative: false,
      exponent: '',
    })
  })

  it('1 -> {"1.00"}. Число = 1, вернуть десятичное число с двумя знаками после запятой', () => {
    const result = FormattingUtility.toStandardFormObject(1)
    expect(result).toEqual({
      negative: false,
      integer: '1',
      fraction: '00',
      base: '',
      exponentNegative: false,
      exponent: '',
    })
  })

  it('0.9999 -> {"1.00"}. Число менее 1 на 0.0001, вернуть десятичное число с двумя знаками после запятой', () => {
    const result = FormattingUtility.toStandardFormObject(0.9999)
    expect(result).toEqual({
      negative: false,
      integer: '1',
      fraction: '00',
      base: '',
      exponentNegative: false,
      exponent: '',
    })
  })

  it('0.12345 -> {"0.123"}. Число > 0.1, вернуть десятичное число с тремя знаками после запятой', () => {
    const result = FormattingUtility.toStandardFormObject(0.12345)
    expect(result).toEqual({
      negative: false,
      integer: '0',
      fraction: '123',
      base: '',
      exponentNegative: false,
      exponent: '',
    })
  })

  it('0.10000 -> {"0.100"}. Число > 0.1, вернуть десятичное число с тремя знаками после запятой', () => {
    const result = FormattingUtility.toStandardFormObject(0.1)
    expect(result).toEqual({
      negative: false,
      integer: '0',
      fraction: '100',
      base: '',
      exponentNegative: false,
      exponent: '',
    })
  })

  it('0.1 -> {"0.100"}. Число = 0.1, вернуть десятичное число с тремя знаками после запятой', () => {
    const result = FormattingUtility.toStandardFormObject(0.1)
    expect(result).toEqual({
      negative: false,
      integer: '0',
      fraction: '100',
      base: '',
      exponentNegative: false,
      exponent: '',
    })
  })

  it('0.0999 -> {"0.100"}. Число менее 0.1 на 0.0001, вернуть десятичное число с тремя знаками после запятой', () => {
    const result = FormattingUtility.toStandardFormObject(0.0999)
    expect(result).toEqual({
      negative: false,
      integer: '0',
      fraction: '100',
      base: '',
      exponentNegative: false,
      exponent: '',
    })
  })

  it('0.012345 -> {"1.23×10^-2"}. Число менее 0.1, вернуть в стандартном виде', () => {
    const result = FormattingUtility.toStandardFormObject(0.012345)
    expect(result).toEqual({
      negative: false,
      integer: '1',
      fraction: '23',
      base: '10',
      exponentNegative: true,
      exponent: '2',
    })
  })

  it('0.00009995 -> {"1.00×10^-4"}. Округление мантиссы даёт перенос, поднять порядок', () => {
    const result = FormattingUtility.toStandardFormObject(0.00009995)
    expect(result).toEqual({
      negative: false,
      integer: '1',
      fraction: '00',
      base: '10',
      exponentNegative: true,
      exponent: '4',
    })
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
    expect(result).toEqual({
      negative: false,
      integer: '9',
      fraction: '99',
      base: '',
      exponentNegative: false,
      exponent: '',
    })
  })

  it('0.00009995 -> {"9.99×10^-5"} по trunc. Переноса нет, порядок не поднимается', () => {
    const result = FormattingUtility.toStandardFormObject(0.00009995, {
      roundingMode: 'trunc',
    })
    expect(result).toEqual({
      negative: false,
      integer: '9',
      fraction: '99',
      base: '10',
      exponentNegative: true,
      exponent: '5',
    })
  })

  // Знак снимается до выбора формы записи, поэтому правило, отсчитанное
  // от знака, переписывается на равносильное беззнаковое.
  it('-0.0999 -> {"0.100"} по floor. Порог 0.1 достигнут, остаться в десятичной записи', () => {
    const result = FormattingUtility.toStandardFormObject(-0.0999, {
      roundingMode: 'floor',
    })
    expect(result).toEqual({
      negative: true,
      integer: '0',
      fraction: '100',
      base: '',
      exponentNegative: false,
      exponent: '',
    })
  })

  it('Когда правило неизвестно, бросить RangeError', () => {
    expect(() =>
      FormattingUtility.toStandardFormObject(9.995, {
        roundingMode: 'halfeven',
      })
    ).toThrow(RangeError)
  })
})

describe('Знаки передаются признаками, разделитель не передаётся', () => {
  it('-0.012345 -> отрицательны и мантисса, и порядок', () => {
    expect(FormattingUtility.toStandardFormObject(-0.012345)).toEqual({
      negative: true,
      integer: '1',
      fraction: '23',
      base: '10',
      exponentNegative: true,
      exponent: '2',
    })
  })

  it('-0 -> признак отрицательности у нуля сброшен', () => {
    expect(FormattingUtility.toStandardFormObject(-0).negative).toBe(false)
  })

  it('В объекте нет ни одного глифа: ни точки, ни минуса', () => {
    const values = Object.values(
      FormattingUtility.toStandardFormObject(-0.012345)
    ).filter(part => typeof part === 'string')

    expect(values.join('')).toMatch(/^\d+$/)
  })

  it('Непригодное значение отдаёт новый объект при каждом вызове', () => {
    const first = FormattingUtility.toStandardFormObject('asdf')
    first.integer = '1'

    expect(FormattingUtility.toStandardFormObject('asdf').integer).toBe('')
  })
})
