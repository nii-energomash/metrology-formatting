# Журнал изменений

Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.1.0/).
Этот проект придерживается [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.0.0] - 2026-11-13

### Добавлено

- Функция `toPercentageObject` возвращает процент данными без глифов: `{ negative, integer, fraction }`. Знак берётся у округлённого значения: `-0.03` даёт ноль без признака отрицательности (#74).
- Настройки типографики строкового вывода рядом с `roundingMode`: `decimal`, `minusSign`, `invalid`, `percentSign`, `exponentSeparator`, `exponentStyle`, `exponentMinusSign` (#83).
- Способы записи порядка `exponentStyle`: `'superscript'` (`·10⁻²`), `'caret'` (`·10^-2`) и `'e'` (`e-2`, разбирается `Number()`). Неизвестное значение даёт `RangeError` (#83).

### Изменено

- **Ломающее:** `toStandardFormObject` возвращает данные без глифов `{ negative, integer, fraction, base, exponentNegative, exponent }` вместо `{ sign, mantissa, base, exponent }`: знаки — признаками, цифры — строками без разделителя (#74).
- **Ломающее:** вывод `toStandardFormString` без настроек типографский: `'4.52·10³'` (точка умножения U+00B7, надстрочный порядок) вместо `'4.52×10^3'`. Прежний вывод дают настройки `{ exponentStyle: 'caret', exponentSeparator: '×' }` (#83).
- Вывод `toPercentageString` без настроек не изменился.

## [2.2.0] - 2026-08-17

### Добавлено

- Правило округления задаётся настройкой `roundingMode` с теми же значениями, что у `Intl.NumberFormat`; по умолчанию — округление от нуля, как прежде. В стандартной форме правило влияет и на выбор формы записи (#56).
- Именованные экспорты `toStandardFormString`, `toStandardFormObject` и `toPercentageString` — для tree-shaking.

### Изменено

- `FormattingUtility` стал замороженным объектом вместо класса со статическими методами; вызов через сам объект не изменился, `new FormattingUtility()` теперь даёт `TypeError`.
- Разбор значения возвращает `null` вместо броска и перехвата исключений: на непригодном входе по-прежнему пустая строка, а дефект реализации доходит до вызывающего исключением (#53).

### Исправлено

- Мантисса приведена к диапазону [1, 10): перенос при округлении поднимает порядок, `0.00009995` даёт `1.00×10^-4` вместо `10.00×10^-5` (#51).
- Округление выполняется над десятичным значением, а не над двоичным приближением: `toPercentageString(2.15)` даёт `2.2` вместо `2.1` (#52).

## [2.1.0] - 2026-08-15

### Добавлено

- Браузерная сборка `dist/index.iife.js` с глобалью `metrologyFormatting`, доступна и по подпути `@nii-energomash/metrology-formatting/browser`.

### Изменено

- Состав `dist`: `index.js` (ESM), `index.cjs` (CJS), `index.iife.js` (браузер). Прежние `index.es.js` и `index.umd.js` не собираются; обращение по имени пакета не задето.
- Публикация запускается созданием релиза GitHub, а не пушем тега.

### Исправлено

- `require('@nii-energomash/metrology-formatting')` возвращал пустой объект: условие `exports.require` вело на `.js`, который Node при `"type": "module"` читает как ESM (#45).

## [2.0.9] - 2026-01-20

### Изменено

- Добавлены воркфлоу ручной публикации для GitHub и Gitea, переименован токен публикации (#34, #39). Код пакета не менялся.

## [2.0.8] - 2025-12-19

### Исправлено

- Исправлен формат комментариев в `.gitattributes` (#29). Код пакета не менялся.

## [2.0.7] - 2025-12-19

### Изменено

- Версия пакета проставляется CI из git-тега (#24). Код пакета не менялся.

## [2.0.6] - 2025-12-19

### Изменено

- В CI Gitea добавлен линтинг (#23). Код пакета не менялся.

## [2.0.5] - 2025-12-19

### Изменено

- Воркфлоу GitHub переведён на двухэтапную схему (#11). Код пакета не менялся.

## [2.0.4] - 2025-12-19

### Изменено

- Добавлены конфигурации ESLint, Prettier и IDE, код приведён к ним (#10).

### Исправлено

- Команда `npm run preview` заменена сообщением-заглушкой (#2).

## [2.0.3] - 2025-12-18

### Исправлено

- Исправлен адрес реестра в воркфлоу Gitea. Код пакета не менялся.

## [2.0.2] - 2025-12-18

Первая версия с тегом под именем `@nii-energomash/metrology-formatting`. Версии 2.0.0 и 2.0.1 тегов не имеют, их изменения учтены здесь.

### Добавлено

- Файл лицензии (#9).
- Публикация в реестр Gitea (#8).

### Изменено

- **Ломающее:** пакет переименован: `@andrey-aka-skif/custom-formatting` → `@nii-energomash/metrology-formatting` (#7, #14).
- **Ломающее:** опечатка в именах функций исправлена: `toStandartFormString` → `toStandardFormString`, `toStandartFormObject` → `toStandardFormObject` (#6).

## [1.0.4] - 2025-09-20

### Изменено

- Пакет публикуется в GitHub Packages под именем `@andrey-aka-skif/custom-formatting`. Версии 1.0.1 и 1.0.3 — промежуточные шаги настройки этой публикации, код пакета в них не менялся.

## [1.0.3] - 2025-09-20

## [1.0.1] - 2025-09-20

## [1.0.0] - 2025-05-29

### Добавлено

- Первая версия под именем `custom-formatting`: форматирование числа в стандартной форме строкой и объектом, форматирование процента строкой.

[Unreleased]: https://github.com/nii-energomash/metrology-formatting/compare/v3.0.0...HEAD
[3.0.0]: https://github.com/nii-energomash/metrology-formatting/compare/v2.2.0...v3.0.0
[2.2.0]: https://github.com/nii-energomash/metrology-formatting/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/nii-energomash/metrology-formatting/compare/v2.0.9...v2.1.0
[2.0.9]: https://github.com/nii-energomash/metrology-formatting/compare/v2.0.8...v2.0.9
[2.0.8]: https://github.com/nii-energomash/metrology-formatting/compare/v2.0.7...v2.0.8
[2.0.7]: https://github.com/nii-energomash/metrology-formatting/compare/v2.0.6...v2.0.7
[2.0.6]: https://github.com/nii-energomash/metrology-formatting/compare/v2.0.5...v2.0.6
[2.0.5]: https://github.com/nii-energomash/metrology-formatting/compare/v2.0.4...v2.0.5
[2.0.4]: https://github.com/nii-energomash/metrology-formatting/compare/v2.0.3...v2.0.4
[2.0.3]: https://github.com/nii-energomash/metrology-formatting/compare/v2.0.2...v2.0.3
[2.0.2]: https://github.com/nii-energomash/metrology-formatting/compare/v1.0.4...v2.0.2
[1.0.4]: https://github.com/nii-energomash/metrology-formatting/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/nii-energomash/metrology-formatting/compare/v1.0.1...v1.0.3
[1.0.1]: https://github.com/nii-energomash/metrology-formatting/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/nii-energomash/metrology-formatting/releases/tag/v1.0.0
