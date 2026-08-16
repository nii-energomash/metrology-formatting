import { describe, it, expect } from 'vitest'
import {
  FormattingUtility,
  toPercentageString,
  toStandardFormObject,
  toStandardFormString,
} from '../src/index'

// Тождество функций проверяется вместо повторения всех случаев: раз именованный
// экспорт и метод неймспейса — один и тот же объект, набор проверок из
// FormattingUtility.*.test.js распространяется на него целиком.
describe('именованные экспорты совпадают с методами FormattingUtility', () => {
  it('toPercentageString', () => {
    expect(toPercentageString).toBe(FormattingUtility.toPercentageString)
  })

  it('toStandardFormString', () => {
    expect(toStandardFormString).toBe(FormattingUtility.toStandardFormString)
  })

  it('toStandardFormObject', () => {
    expect(toStandardFormObject).toBe(FormattingUtility.toStandardFormObject)
  })
})

describe('именованные экспорты вызываются напрямую', () => {
  it('toPercentageString(2.16) -> "2.2"', () => {
    expect(toPercentageString(2.16)).toBe('2.2')
  })

  it('toPercentageString("asdf") -> ""', () => {
    expect(toPercentageString('asdf')).toBe('')
  })

  it('toStandardFormString(4520) -> "4.52×10^3"', () => {
    expect(toStandardFormString(4520)).toBe('4.52×10^3')
  })

  it('toStandardFormString(0.012345) -> "1.23×10^-2"', () => {
    expect(toStandardFormString(0.012345)).toBe('1.23×10^-2')
  })

  it('toStandardFormString(0) -> "0.00"', () => {
    expect(toStandardFormString(0)).toBe('0.00')
  })

  it('toStandardFormObject(-12345) раскладывает число на части', () => {
    expect(toStandardFormObject(-12345)).toEqual({
      sign: '-',
      mantissa: '1.23',
      base: '10',
      exponent: '4',
    })
  })

  it('toStandardFormObject("asdf") -> части пустыми строками', () => {
    expect(toStandardFormObject('asdf')).toEqual({
      sign: '',
      mantissa: '',
      base: '',
      exponent: '',
    })
  })
})

describe('FormattingUtility — неймспейс, а не класс', () => {
  it('экземпляр создать нельзя', () => {
    expect(() => new FormattingUtility()).toThrow(TypeError)
  })

  it('состав методов не подменяется', () => {
    expect(Object.isFrozen(FormattingUtility)).toBe(true)
  })
})
