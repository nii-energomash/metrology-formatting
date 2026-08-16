# @nii-energomash/metrology-formatting

[![License](https://img.shields.io/static/v1?label=license&message=proprietary&color=blue)](https://github.com/nii-energomash/metrology-formatting/blob/master/LICENSE)
[![CI](https://github.com/nii-energomash/metrology-formatting/actions/workflows/ci.yml/badge.svg)](https://github.com/nii-energomash/metrology-formatting/actions/workflows/ci.yml)
[![Publish](https://github.com/nii-energomash/metrology-formatting/actions/workflows/publish.yml/badge.svg)](https://github.com/nii-energomash/metrology-formatting/actions/workflows/publish.yml)

Библиотека для строгого форматирования числовых значений по правилам метрологии: стандартная форма, объектное представление и проценты. Гарантирует три значащих цифры в выводе и корректное представление процентов.

Основной функционал доступен через неймспейс `FormattingUtility` либо через те же
функции, экспортированные по отдельности.

## Установка

```shell
npm install @nii-energomash/metrology-formatting@latest
```

## Быстрый старт

```js
import { FormattingUtility } from '@nii-energomash/metrology-formatting'

// Форматирование в строку по правилам метрологии
console.log(FormattingUtility.toStandardFormString(4520)) // "4.52×10^3"
console.log(FormattingUtility.toStandardFormString(0.0282)) // "2.82×10^-2"

// Форматирование процентов
console.log(FormattingUtility.toPercentageString(65.432)) // "65.4"
console.log(FormattingUtility.toPercentageString(0.03)) // "0.0" (правило < 0.05)
```

Те же функции доступны по отдельности — так их забирает tree-shaking:

```js
import {
  toStandardFormString,
  toStandardFormObject,
  toPercentageString,
} from '@nii-energomash/metrology-formatting'
```

## Что библиотека возвращает, а что нет

Библиотека отдаёт **разобранное значение, а не готовую вёрстку**. Десятичный разделитель
всегда точка, порядок записывается как `×10^3`, знака `%` в выводе процентов нет.

Красивый вид — `4,52·10³`, надстрочные цифры, запятая, знак процента — собирает
потребитель, и сырьём для этого служит `toStandardFormObject()`: он возвращает части
значения по отдельности, так что каждую можно обернуть своей разметкой. Тот же приём
использует платформа: `Intl.NumberFormat.prototype.formatToParts()` тоже отдаёт части
и сознательно не отдаёт разметку.

## Подключение в браузере без сборщика

В пакете есть отдельная браузерная сборка `dist/index.iife.js`. Её достаточно
скопировать в статику проекта и подключить тегом — библиотека объявляет глобаль
`metrologyFormatting`:

```html
<script src="/vendor/metrology-formatting.js"></script>
<script>
  console.log(metrologyFormatting.FormattingUtility.toStandardFormString(4520))
</script>
```

Проектам со сборщиком этот файл не нужен: `import` и `require` берут ESM- и
CJS-сборки сами.

## API

### toStandardFormString(value: number): string

Функция принимает числовое значение и возвращает его строковое представление по правилам метрологии:

#### Общий принцип

Функция всегда сохраняет три значащих цифры в выходной строке. Формат представления зависит от абсолютного значения входного числа.

#### Алгоритм работы

Для чисел ≥1000:

Возвращает значение в экспоненциальной форме

Пример: 4520 → "4.52×10^3"

Для чисел [100, 1000):

Возвращает целое число (без дробной части)

Пример: 123.45 → "123"

Для чисел [10, 100):

Возвращает значение с 1 десятичным знаком

Пример: 24.567 → "24.6"

Для чисел [1, 10):

Возвращает значение с 2 десятичными знаками

Пример: 3.7812 → "3.78"

Для чисел [0.1, 1):

Возвращает значение с 3 десятичными знаками

Пример: 0.6543 → "0.654"

Для чисел <0.1:

Возвращает значение в экспоненциальной форме

Пример: 0.0282 → "2.82×10^-2"

### toStandardFormObject(value: number): StandardFormObject

Функция принимает числовое значение и обрабатывает его по тем же правилам, что и toStandardFormString(). Но возвращает объект вида:

```
{
    sign: '-',
    mantissa: '1.23',
    base: '10',
    exponent: '3',
}
```

Все четыре поля — строки. Когда представление обходится без порядка, `base` и `exponent`
пусты; для неположительного знака `sign` пуст. На непригодном входе пусты все четыре поля.

### toPercentageString(value: number): string

Функция принимает числовое значение и обрабатывает его по правилам метрологии для процентов:

Всегда возвращает 1 десятичный знак

Знак процента в вывод не добавляется

Для значений <0.05 возвращает "0.0"

Примеры:

100 → "100.0"

65.432 → "65.4"

0.03 → "0.0"

## Примеры работы

| Входное значение | Результат    |
| ---------------- | ------------ |
| 4520             | "4.52×10^3"  |
| 123.45           | "123"        |
| 24.567           | "24.6"       |
| 3.7812           | "3.78"       |
| 0.6543           | "0.654"      |
| 0.0282           | "2.82×10^-2" |
| 100 (процент)    | "100.0"      |
| 0.03 (процент)   | "0.0"        |

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

Для указания версии **не следует** изменять файл манифеста: в git там всегда `0.0.0`.
Версия пакета извлекается из тега git (вида `v*.*.*`) и проставляется в процессе CI/CD workflow.

Публикация запускается созданием GitHub Release на теге, а не пушем тега:
релиз — преднамеренный акт с release notes. Повторный прогон делается кнопкой
Re-run на этом релизе.

## Лицензия

Распространяется под проприетарной лицензией. Подробности в файле [LICENSE](./LICENSE).
