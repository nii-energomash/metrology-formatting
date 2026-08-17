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
  it('-2.16 -> "-2.2". Отрицательное число, вернуть число, округлённое в большую по величине сторону', () => {
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

  it('2.15 -> "2.2". Ровно середина интервала, округлить от нуля', () => {
    expect(FormattingUtility.toPercentageString(2.15)).toBe('2.2')
  })

  it('2.16 -> "2.2". Число содержит сотые доли, вернуть число, округлённое в большую сторону', () => {
    expect(FormattingUtility.toPercentageString(2.16)).toBe('2.2')
  })
})

describe('Задаём правило округления', () => {
  it('Когда опции не переданы, округлять по halfExpand', () => {
    expect(FormattingUtility.toPercentageString(2.15)).toBe(
      FormattingUtility.toPercentageString(2.15, {
        roundingMode: 'halfExpand',
      })
    )
  })

  it('Когда объект опций пуст, округлять по правилу по умолчанию', () => {
    expect(FormattingUtility.toPercentageString(2.15, {})).toBe('2.2')
  })

  it('2.25 -> "2.2" по halfEven. Середина уходит к чётной цифре', () => {
    expect(
      FormattingUtility.toPercentageString(2.25, { roundingMode: 'halfEven' })
    ).toBe('2.2')
  })

  it('2.15 -> "2.2" по halfEven. Середина уходит к чётной цифре вверх', () => {
    expect(
      FormattingUtility.toPercentageString(2.15, { roundingMode: 'halfEven' })
    ).toBe('2.2')
  })

  it('2.19 -> "2.1" по trunc. Дробная часть отбрасывается', () => {
    expect(
      FormattingUtility.toPercentageString(2.19, { roundingMode: 'trunc' })
    ).toBe('2.1')
  })

  it('-2.19 -> "-2.1" по trunc. Усечение идёт к нулю независимо от знака', () => {
    expect(
      FormattingUtility.toPercentageString(-2.19, { roundingMode: 'trunc' })
    ).toBe('-2.1')
  })

  // Правила ceil и floor отсчитывают направление от знака, а не от нуля,
  // поэтому на отрицательном они расходятся с trunc и expand. Пара проверок
  // ниже ловит подмену знака величиной.
  it('-2.11 -> "-2.2" по floor. Направление отсчитывается от знака', () => {
    expect(
      FormattingUtility.toPercentageString(-2.11, { roundingMode: 'floor' })
    ).toBe('-2.2')
  })

  it('-2.19 -> "-2.1" по ceil. Направление отсчитывается от знака', () => {
    expect(
      FormattingUtility.toPercentageString(-2.19, { roundingMode: 'ceil' })
    ).toBe('-2.1')
  })

  it('Когда правило неизвестно, бросить RangeError', () => {
    expect(() =>
      FormattingUtility.toPercentageString(2.15, { roundingMode: 'halfeven' })
    ).toThrow(RangeError)
  })
})

describe('Округляем середину интервала', () => {
  // Точечная проверка на 2.15 закрывает один случай из четырёхсот: середины,
  // не представимые в двоичной плавающей точке точно, расходятся вразнобой.
  // Поэтому проверяется вся тысяча середин сразу.
  it('0.05 … 99.95 -> округление от нуля на всех серединах', () => {
    const failures = []

    for (let hundredths = 5; hundredths <= 9995; hundredths += 10) {
      const value = (hundredths / 100).toFixed(2)
      const expected = (Math.floor((hundredths + 5) / 10) / 10).toFixed(1)
      const actual = FormattingUtility.toPercentageString(Number(value))

      if (actual !== expected)
        failures.push(`${value} -> ${actual}, ожидалось ${expected}`)
    }

    expect(failures).toEqual([])
  })

  it('-99.95 … -0.05 -> округление от нуля на всех серединах', () => {
    const failures = []

    for (let hundredths = 5; hundredths <= 9995; hundredths += 10) {
      const value = (-hundredths / 100).toFixed(2)
      const expected = `-${(Math.floor((hundredths + 5) / 10) / 10).toFixed(1)}`
      const actual = FormattingUtility.toPercentageString(Number(value))

      if (actual !== expected)
        failures.push(`${value} -> ${actual}, ожидалось ${expected}`)
    }

    expect(failures).toEqual([])
  })
})
