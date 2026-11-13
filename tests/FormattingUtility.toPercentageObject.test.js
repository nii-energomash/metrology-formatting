import { describe, it, expect } from 'vitest'
import FormattingUtility from '../src/FormattingUtility'

const EMPTY = { negative: false, integer: '', fraction: '' }

describe('Передаем неподходящие значения', () => {
  it('Когда не переданы параметры, вернуть объект с пустыми строками', () => {
    expect(FormattingUtility.toPercentageObject()).toEqual(EMPTY)
  })

  it('null -> пустой объект', () => {
    expect(FormattingUtility.toPercentageObject(null)).toEqual(EMPTY)
  })

  it('"asdf" -> пустой объект', () => {
    expect(FormattingUtility.toPercentageObject('asdf')).toEqual(EMPTY)
  })

  it('"-2,16" -> пустой объект. Разделитель в строке не равен точке', () => {
    expect(FormattingUtility.toPercentageObject('-2,16')).toEqual(EMPTY)
  })

  it('Infinity -> пустой объект', () => {
    expect(FormattingUtility.toPercentageObject(Infinity)).toEqual(EMPTY)
  })
})

describe('Передаем корректные значения', () => {
  it('-2.15 -> отрицательный, 2 и 2 десятых', () => {
    expect(FormattingUtility.toPercentageObject(-2.15)).toEqual({
      negative: true,
      integer: '2',
      fraction: '2',
    })
  })

  it('"-2.16" -> число строкой разбирается так же', () => {
    expect(FormattingUtility.toPercentageObject('-2.16')).toEqual({
      negative: true,
      integer: '2',
      fraction: '2',
    })
  })

  it('2 -> хвостовой ноль сохраняется', () => {
    expect(FormattingUtility.toPercentageObject(2)).toEqual({
      negative: false,
      integer: '2',
      fraction: '0',
    })
  })

  it('100 -> целая часть из трёх цифр', () => {
    expect(FormattingUtility.toPercentageObject(100)).toEqual({
      negative: false,
      integer: '100',
      fraction: '0',
    })
  })

  it('9.96 -> перенос через разряд при округлении', () => {
    expect(FormattingUtility.toPercentageObject(9.96)).toEqual({
      negative: false,
      integer: '10',
      fraction: '0',
    })
  })

  it('-0.03 -> округляется в ноль, признак отрицательности сброшен', () => {
    expect(FormattingUtility.toPercentageObject(-0.03)).toEqual({
      negative: false,
      integer: '0',
      fraction: '0',
    })
  })

  it('-0 -> признак отрицательности сброшен', () => {
    expect(FormattingUtility.toPercentageObject(-0).negative).toBe(false)
  })
})

describe('Задаём правило округления', () => {
  it('2.15 -> 2.2 по умолчанию (halfExpand)', () => {
    expect(FormattingUtility.toPercentageObject(2.15).fraction).toBe('2')
  })

  it('2.25 -> 2.2 по halfEven', () => {
    expect(
      FormattingUtility.toPercentageObject(2.25, { roundingMode: 'halfEven' })
        .fraction
    ).toBe('2')
  })

  it('-0.04 -> -0.1 по floor. Знак берётся у округлённого значения', () => {
    expect(
      FormattingUtility.toPercentageObject(-0.04, { roundingMode: 'floor' })
    ).toEqual({ negative: true, integer: '0', fraction: '1' })
  })

  it('Когда правило неизвестно, бросить RangeError', () => {
    expect(() =>
      FormattingUtility.toPercentageObject(2.15, { roundingMode: 'halfeven' })
    ).toThrow(RangeError)
  })
})
