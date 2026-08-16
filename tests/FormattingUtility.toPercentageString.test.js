import { describe, it, expect } from 'vitest'
import FormattingUtility from '../src/FormattingUtility'

describe('Передаем неподходящие значения', () => {
  it('Когда не переданы параметры, вернуть пустую строку', () => {
    expect(FormattingUtility.toPercentageString()).toBe('')
  })

  it('null -> "". Когда передан null, вернуть пустую строку', () => {
    expect(FormattingUtility.toPercentageString(null)).toBe('')
  })

  it('"" -> "". Когда передана пустая строка, вернуть пустую строку', () => {
    expect(FormattingUtility.toPercentageString('')).toBe('')
  })

  it('"asdf" -> "". Когда передана некорректная строка, вернуть пустую строку', () => {
    expect(FormattingUtility.toPercentageString('asdf')).toBe('')
  })

  it('new Date() -> "". Когда передана дата, вернуть пустую строку', () => {
    expect(FormattingUtility.toPercentageString(new Date())).toBe('')
  })

  it('{} -> "". Когда передан объект, вернуть пустую строку', () => {
    expect(FormattingUtility.toPercentageString({})).toBe('')
  })

  it('"-2,16" -> "". Когда разделитель в строке не равен точке, вернуть пустую строку', () => {
    expect(FormattingUtility.toPercentageString('-2,16')).toBe('')
  })
})

describe('Передаем корректные значения в виде строки', () => {
  it('"-2.16" -> "-2.2". Число передано строкой, вернуть корректное число', () => {
    expect(FormattingUtility.toPercentageString('-2.16')).toBe('-2.2')
  })
})

describe('Передаем корректные значения', () => {
  it('-2.16 -> "-2.2". Отрицательное число, вернуть число, округленное по банковским правилам в большую сторону', () => {
    expect(FormattingUtility.toPercentageString(-2.16)).toBe('-2.2')
  })

  it('0 -> "0.0". Число равно нулю, вернуть ноль и ноль десятых - n,0', () => {
    expect(FormattingUtility.toPercentageString(2)).toBe('2.0')
  })

  it('0.04 -> "0.0". Число менее 0.1, вернуть ноль и ноль десятых - n,0', () => {
    expect(FormattingUtility.toPercentageString(2)).toBe('2.0')
  })

  it('2 -> "2.0". Целое число процентов, вернуть само число и ноль десятых - n,0', () => {
    expect(FormattingUtility.toPercentageString(2)).toBe('2.0')
  })

  it('2.1 -> "2.1". Число содержит десятые доли, вернуть само число', () => {
    expect(FormattingUtility.toPercentageString(2.1)).toBe('2.1')
  })

  it('2.15 -> "2.1". Число содержит сотые доли, вернуть число, округленное по банковским правилам в меньшую сторону', () => {
    expect(FormattingUtility.toPercentageString(2.15)).toBe('2.1')
  })

  it('2.16 -> "2.2". Число содержит сотые доли, вернуть число, округленное по банковским правилам в большую сторону', () => {
    expect(FormattingUtility.toPercentageString(2.16)).toBe('2.2')
  })
})
