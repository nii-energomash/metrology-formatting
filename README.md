# FormattingUtility

Форматирование чисел по правилам метрологии: стандартная форма, объектное представление и проценты.

[![License](https://img.shields.io/static/v1?label=license&message=proprietary&color=blue)](https://github.com/nii-energomash/metrology-formatting/blob/master/LICENSE)
[![CI](https://github.com/nii-energomash/metrology-formatting/actions/workflows/ci.yml/badge.svg)](https://github.com/nii-energomash/metrology-formatting/actions/workflows/ci.yml)
[![Package](https://github.com/nii-energomash/metrology-formatting/actions/workflows/package.yml/badge.svg)](https://github.com/nii-energomash/metrology-formatting/actions/workflows/package.yml)

Библиотека для строгого форматирования числовых значений в научной и метрологической практике. Гарантирует три значащих цифры в выводе и корректное представление процентов.

## Установка

```shell
npm install @nii-energomash/metrology-formatting@latest
```

## Быстрый старт

```js
import { FormattingUtility } from '@nii-energomash/metrology-formatting'

// Форматирование в строку по правилам метрологии
console.log(FormattingUtility.toStandardFormString(4520)) // "4,52·10³"
console.log(FormattingUtility.toStandardFormString(0.0282)) // "2,82·10⁻²"

// Форматирование процентов
console.log(FormattingUtility.toPercentageString(65.432)) // "65,4%"
console.log(FormattingUtility.toPercentageString(0.03)) // "0,0%" (правило < 0.05%)
```

## API

### toStandardFormString(value: number): string

Функция принимает числовое значение и возвращает его строковое представление по правилам метрологии:

#### Общий принцип

Функция всегда сохраняет три значащих цифры в выходной строке. Формат представления зависит от абсолютного значения входного числа.

#### Алгоритм работы

Для чисел ≥1000:

Возвращает значение в экспоненциальной форме

Пример: 4520 → "4,52·10³"

Для чисел [100, 1000):

Возвращает целое число (без дробной части)

Пример: 230.5 → "230"

Для чисел [10, 100):

Возвращает значение с 1 десятичным знаком

Пример: 24.567 → "24,6"

Для чисел [1, 10):

Возвращает значение с 2 десятичными знаками

Пример: 3.7812 → "3,78"

Для чисел [0.1, 1):

Возвращает значение с 3 десятичными знаками

Пример: 0.6543 → "0,654"

Для чисел <0.1:

Возвращает значение в экспоненциальной форме

Пример: 0.0282 → "2,82·10⁻²"

### toStandardFormObject(value: number): StandardFormObject

Функция принимает числовое значение и обрабатывает его по тем же правилам, что и toStandadtFormString(). Но возвращает объект вида:

```
{
    sign: '-',
    mantissa: '1.23',
    base: '10',
    exponent: '3',
}
```

### toPercentageString(value: number): string

Функция принимает числовое значение и обрабатывает его по правилам метрологии для процентов:

Всегда возвращает 1 десятичный знак

Для значений <0.05% возвращает "0,0%"

Примеры:

100 → "100,0%"

65.432 → "65,4%"

0.03 → "0,0%"

## Примеры работы

| Входное значение | Результат   |
| ---------------- | ----------- |
| 4520             | "4,52·10³"  |
| 230.5            | "230"       |
| 24.567           | "24,6"      |
| 3.7812           | "3,78"      |
| 0.6543           | "0,654"     |
| 0.0282           | "2,82·10⁻²" |
| 100 (процент)    | "100,0%"    |
| 0.03 (процент)   | "0,0%"      |

## Разработка и тестирование

### Клонирование репозитория

```shell
git clone https://github.com/nii-energomash/metrology-formatting.git
cd metrology-formatting
```

### Установка зависимостей

```shell
npm install
```

### Запуск демонстрационной страницы (семплов)

```shell
npm run dev
```

### Запуск тестов

```shell
npm run test
```

### Запуск тестов с UI

```shell
npm run test:ui
```

### Запуск линтера

```shell
npm run lint
```

### Запуск форматирования

```shell
npm run format
```

### Версионирование

Для указания версии **не следует** изменять файл манифеста.
Версия пакета будет извлечена из тега git (вида `v*.*.*`) и добавлена в процессе CI/CD workflow.

## Лицензия

Распространяется под проприетарной лицензией. Подробности в файле [LICENSE](./LICENSE).
