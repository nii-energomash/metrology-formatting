# @nii-energomash/metrology-formatting

[![License](https://img.shields.io/static/v1?label=license&message=proprietary&color=blue)](https://github.com/nii-energomash/metrology-formatting/blob/master/LICENSE)
[![CI](https://github.com/nii-energomash/metrology-formatting/actions/workflows/ci.yml/badge.svg)](https://github.com/nii-energomash/metrology-formatting/actions/workflows/ci.yml)
[![Publish](https://github.com/nii-energomash/metrology-formatting/actions/workflows/publish.yml/badge.svg)](https://github.com/nii-energomash/metrology-formatting/actions/workflows/publish.yml)

Библиотека для строгого форматирования числовых значений по правилам метрологии: стандартная форма и проценты, строкой или объектом. Гарантирует три значащих цифры в выводе и корректное представление процентов.

Основной функционал доступен через неймспейс `FormattingUtility` либо через те же функции, экспортированные по отдельности.

## Установка

```shell
npm install @nii-energomash/metrology-formatting@latest
```

## Быстрый старт

```js
import { FormattingUtility } from '@nii-energomash/metrology-formatting'

// Строка по правилам метрологии
FormattingUtility.toStandardFormString(4520) // '4.52×10^3'
FormattingUtility.toStandardFormString(0.0282) // '2.82×10^-2'
FormattingUtility.toPercentageString(65.432) // '65.4'

// Те же значения данными — для собственной типографики
FormattingUtility.toStandardFormObject(-0.0282)
// { negative: true, integer: '2', fraction: '82', base: '10', exponentNegative: true, exponent: '2' }
FormattingUtility.toPercentageObject(-2.15)
// { negative: true, integer: '2', fraction: '2' }
```

Те же функции доступны по отдельности — так их забирает tree-shaking:

```js
import {
  toStandardFormString,
  toStandardFormObject,
  toPercentageString,
  toPercentageObject,
} from '@nii-energomash/metrology-formatting'
```

## Что библиотека возвращает, а что нет

Библиотека отдаёт **разобранное значение, а не готовую вёрстку**, и не знает локали.

- **Строка** машиночитаема: десятичный разделитель всегда точка, минус — дефис, порядок записывается как `×10^3`, знака `%` в выводе процентов нет.
- **Объект** — данные без единого глифа: знаки переданы признаками (`negative`, `exponentNegative`), цифры — строками без разделителя (`integer`, `fraction`, `exponent`). Какой символ ставить — точку или запятую, дефис или минус, `^` или надстрочный индекс, — решает тот, кто строит вывод.

Красивый вид собирает потребитель из полей объекта, оборачивая каждую часть своей разметкой:

```js
const MINUS = '\u2212'
const { negative, integer, fraction, base, exponentNegative, exponent } =
  toStandardFormObject(-0.0282)

const mantissa = `${negative ? MINUS : ''}${integer}${fraction ? ',' + fraction : ''}`
const html = exponent
  ? `${mantissa}·${base}<sup>${exponentNegative ? MINUS : ''}${exponent}</sup>`
  : mantissa
// '−2,82·10<sup>−2</sup>'
```

Массив частей по образцу `Intl.NumberFormat.prototype.formatToParts()` библиотека сознательно не отдаёт: `formatToParts` разбирает текст, уже отформатированный под локаль, и его части — это глифы этой локали.

## Подключение в браузере без сборщика

В пакете есть отдельная браузерная сборка `dist/index.iife.js`. Её достаточно скопировать в статику проекта и подключить тегом — библиотека объявляет глобаль `metrologyFormatting`:

```html
<script src="/vendor/metrology-formatting.js"></script>
<script>
  console.log(metrologyFormatting.FormattingUtility.toStandardFormString(4520))
</script>
```

Проектам со сборщиком этот файл не нужен: `import` и `require` берут ESM- и CJS-сборки сами.

## API

| Функция                                                      | Возвращает           | Назначение                                  |
| ------------------------------------------------------------ | -------------------- | ------------------------------------------- |
| [`toStandardFormString`](#tostandardformstringvalue-options) | `string`             | Число по правилам метрологии, строкой       |
| [`toStandardFormObject`](#tostandardformobjectvalue-options) | `StandardFormObject` | То же число данными, без глифов             |
| [`toPercentageString`](#topercentagestringvalue-options)     | `string`             | Процент с одним знаком после точки, строкой |
| [`toPercentageObject`](#topercentageobjectvalue-options)     | `PercentageObject`   | Тот же процент данными, без глифов          |

Все функции:

- принимают значение числом или строкой с точкой в роли разделителя (`-2.16`, `'-2.16'`);
- считают непригодным всё остальное, включая `NaN`, `Infinity`, `null`, `''` и `'-2,16'`: строковые функции возвращают `''`, объектные — объект с пустыми строками и сброшенными признаками;
- принимают вторым необязательным аргументом объект [настроек](#настройки).

### `toStandardFormString(value, options?)`

```ts
toStandardFormString(value: unknown, options?: { roundingMode?: string }): string
```

Число по правилам метрологии. В выводе всегда три значащих цифры, а форма записи зависит от величины числа:

| Величина    | Запись                                  | Пример                    |
| ----------- | --------------------------------------- | ------------------------- |
| ≥ 1000      | стандартная форма, мантисса с 2 знаками | `4520` → `'4.52×10^3'`    |
| [100, 1000) | целое                                   | `123.45` → `'123'`        |
| [10, 100)   | 1 знак после точки                      | `24.567` → `'24.6'`       |
| [1, 10)     | 2 знака после точки                     | `3.7812` → `'3.78'`       |
| [0.1, 1)    | 3 знака после точки                     | `0.6543` → `'0.654'`      |
| < 0.1       | стандартная форма, мантисса с 2 знаками | `0.0282` → `'2.82×10^-2'` |
| 0           | особый случай                           | `0` → `'0.00'`            |

Границы сравниваются с уже округлённым значением: `9.999` даёт `'10.0'`, а `999.99` — `'1.00×10^3'`.

**Исключения:** `RangeError`, если правило округления неизвестно.

### `toStandardFormObject(value, options?)`

```ts
toStandardFormObject(value: unknown, options?: { roundingMode?: string }): StandardFormObject
```

То же число, что у [`toStandardFormString`](#tostandardformstringvalue-options), но данными:

| Поле               | Тип       | Смысл                                                                                |
| ------------------ | --------- | ------------------------------------------------------------------------------------ |
| `negative`         | `boolean` | Число отрицательно                                                                   |
| `integer`          | `string`  | Цифры целой части мантиссы                                                           |
| `fraction`         | `string`  | Цифры дробной части мантиссы с хвостовыми нулями; пусто, если знаков после точки нет |
| `base`             | `string`  | Основание порядка `'10'`; пусто в записи без порядка                                 |
| `exponentNegative` | `boolean` | Порядок отрицателен                                                                  |
| `exponent`         | `string`  | Цифры порядка без знака; пусто в записи без порядка                                  |

```js
toStandardFormObject(-0.0282)
// { negative: true, integer: '2', fraction: '82', base: '10', exponentNegative: true, exponent: '2' }
toStandardFormObject(123.45)
// { negative: false, integer: '123', fraction: '', base: '', exponentNegative: false, exponent: '' }
```

**Исключения:** `RangeError`, если правило округления неизвестно.

### `toPercentageString(value, options?)`

```ts
toPercentageString(value: unknown, options?: { roundingMode?: string }): string
```

Процент с одним знаком после точки. Знак `%` в вывод не добавляется.

| Значение | Результат                                         |
| -------- | ------------------------------------------------- |
| `100`    | `'100.0'`                                         |
| `65.432` | `'65.4'`                                          |
| `0.03`   | `'0.0'`                                           |
| `-0.03`  | `'0.0'` — ноль после округления знака не получает |

**Исключения:** `RangeError`, если правило округления неизвестно.

### `toPercentageObject(value, options?)`

```ts
toPercentageObject(value: unknown, options?: { roundingMode?: string }): PercentageObject
```

Тот же процент, что у [`toPercentageString`](#topercentagestringvalue-options), но данными:

| Поле       | Тип       | Смысл                                |
| ---------- | --------- | ------------------------------------ |
| `negative` | `boolean` | Процент отрицателен после округления |
| `integer`  | `string`  | Цифры целой части                    |
| `fraction` | `string`  | Цифра десятых, всегда одна           |

```js
toPercentageObject(-2.15) // { negative: true, integer: '2', fraction: '2' }
```

**Исключения:** `RangeError`, если правило округления неизвестно.

## Настройки

Объект настроек — второй аргумент любой функции. Все поля необязательны.

| Поле           | Умолчание      | Смысл                                     |
| -------------- | -------------- | ----------------------------------------- |
| `roundingMode` | `'halfExpand'` | [Правило округления](#правило-округления) |

### Правило округления

Единственного «правильного» правила округления у библиотеки нет: соответствия какому-либо стандарту она не заявляет. Поэтому правило задаётся вызывающим — полем `roundingMode`:

```js
toPercentageString(2.25) // '2.3' — правило по умолчанию
toPercentageString(2.25, { roundingMode: 'halfEven' }) // '2.2' — банковское
toPercentageString(2.29, { roundingMode: 'trunc' }) // '2.2' — усечение
```

Допустимые значения — те же, что у [`Intl.NumberFormat`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#roundingmode): `ceil`, `floor`, `expand`, `trunc`, `halfCeil`, `halfFloor`, `halfExpand`, `halfTrunc`, `halfEven`. Свой список библиотека не заводит и округление выполняет тем же `Intl.NumberFormat`, поэтому неизвестное значение приводит к `RangeError` от самой платформы.

По умолчанию действует `halfExpand` — округление от нуля, в том числе ровно на середине интервала: `2.25 → '2.3'`, `-2.25 → '-2.3'`.

Правила `ceil`, `floor`, `halfCeil` и `halfFloor` отсчитывают направление от знака, а не от нуля, и на отрицательных значениях расходятся с `expand` и `trunc`: `-2.113` даёт `'-2.12'` при `floor` и `'-2.11'` при `trunc`.

В стандартной форме правило влияет не только на цифры, но и на выбор формы записи — порог сравнивается с уже округлённым значением:

```js
toStandardFormString(0.0999) // '0.100'
toStandardFormString(0.0999, { roundingMode: 'trunc' }) // '9.99×10^-2'
```

## Разработка

Сборка, проверки, тесты, демонстрационная страница и выпуск версий — в [CONTRIBUTING.md](./CONTRIBUTING.md).

## Лицензия

Распространяется под проприетарной лицензией. Подробности в файле [LICENSE](./LICENSE).
