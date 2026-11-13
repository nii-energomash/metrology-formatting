import { FormattingUtility } from '../src'

const PRESETS = ['4520', '0.0282', '-0.0282', '0.0999', '-0.03', '0', 'abc']

const FUNCTIONS = [
  'toStandardFormString',
  'toStandardFormObject',
  'toPercentageString',
  'toPercentageObject',
]

const ROUNDING_MODES = [
  'ceil',
  'floor',
  'expand',
  'trunc',
  'halfCeil',
  'halfFloor',
  'halfExpand',
  'halfTrunc',
  'halfEven',
]

const MINUS = '\u2212'

// Варианты символов строкового вывода; первый вариант каждого — умолчание
// библиотеки, и в настройки он не попадает.
const SYMBOLS = {
  decimal: [
    ['.', 'точка'],
    [',', 'запятая'],
  ],
  minusSign: [
    ['-', 'дефис'],
    ['\u2212', 'минус U+2212'],
  ],
  exponentSeparator: [
    ['·', 'точка U+00B7'],
    ['×', 'крест U+00D7'],
  ],
  exponentStyle: [
    ['superscript', 'superscript: 10\u207b\u00b2'],
    ['caret', 'caret: 10^-2'],
    ['e', 'e: 2.82e-2'],
  ],
  exponentMinusSign: [
    ['', 'по способу записи'],
    ['-', 'дефис'],
    ['\u2212', 'минус U+2212'],
    ['\u207b', 'надстрочный U+207B'],
  ],
  percentSign: [
    ['', 'нет'],
    ['%', '%'],
    ['\u00a0%', 'неразрывный пробел и %'],
  ],
}

// Невидимые и похожие на другие символы показываются в строке вызова кодом.
const ESCAPED = new Set(['\u00a0', '\u2212', '\u207b'])

/**
 * \u0417\u0430\u043f\u0438\u0441\u044b\u0432\u0430\u0435\u0442 \u0441\u0438\u043c\u0432\u043e\u043b escape-\u043f\u043e\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u0442\u0435\u043b\u044c\u043d\u043e\u0441\u0442\u044c\u044e
 * @param {String} char \u0421\u0438\u043c\u0432\u043e\u043b \u0438\u0437 \u043e\u0441\u043d\u043e\u0432\u043d\u043e\u0439 \u043f\u043b\u043e\u0441\u043a\u043e\u0441\u0442\u0438 Unicode
 * @returns {String} \u041f\u043e\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u0442\u0435\u043b\u044c\u043d\u043e\u0441\u0442\u044c \u0432\u0438\u0434\u0430 \uXXXX
 */
function escapeChar(char) {
  const code = char.charCodeAt(0).toString(16).padStart(4, '0')
  return `\\u${code}`
}

const valueInput = document.querySelector('#value')
const presetsNode = document.querySelector('#presets')
const functionsNode = document.querySelector('#functions')
const roundingModeSelect = document.querySelector('#roundingMode')
const symbolsBlock = document.querySelector('#symbolsBlock')
const symbolsNode = document.querySelector('#symbols')
const callNode = document.querySelector('#call')
const outputNode = document.querySelector('#output')
const typesetBlock = document.querySelector('#typesetBlock')
const typesetNode = document.querySelector('#typeset')

for (const preset of PRESETS) {
  const button = document.createElement('button')
  button.type = 'button'
  button.textContent = preset
  button.addEventListener('click', () => {
    valueInput.value = preset
    render()
  })
  presetsNode.append(button)
}

for (const [index, name] of FUNCTIONS.entries()) {
  const label = document.createElement('label')
  const radio = document.createElement('input')
  radio.type = 'radio'
  radio.name = 'function'
  radio.value = name
  radio.checked = index === 0
  label.append(radio, ` ${name}`)
  functionsNode.append(label)
}

roundingModeSelect.append(new Option('по умолчанию (halfExpand)', ''))
for (const mode of ROUNDING_MODES) roundingModeSelect.append(new Option(mode))

const symbolControls = {}

for (const [key, variants] of Object.entries(SYMBOLS)) {
  const label = document.createElement('label')
  const select = document.createElement('select')
  for (const [value, text] of variants) select.append(new Option(text, value))
  label.append(key, select)
  symbolsNode.append(label)
  symbolControls[key] = select
}

const invalidLabel = document.createElement('label')
const invalidInput = document.createElement('input')
invalidInput.type = 'text'
invalidInput.placeholder = 'пустая строка'
invalidLabel.append('invalid', invalidInput)
symbolsNode.append(invalidLabel)

/**
 * Проверяет, относится ли настройка символов к функции
 * @param {String} key Имя настройки
 * @param {String} name Имя функции
 * @returns {Boolean} Настройка влияет на вывод функции
 */
function appliesTo(key, name) {
  if (key === 'percentSign') return name === 'toPercentageString'
  if (key === 'exponentSeparator' && symbolControls.exponentStyle.value === 'e')
    return false
  if (key.startsWith('exponent')) return name === 'toStandardFormString'
  return true
}

/**
 * Собирает настройки из органов управления, пропуская незаданные и неприменимые
 * @param {String} name Имя функции
 * @returns {Object} Настройки форматирования
 */
function readOptions(name) {
  const options = {}
  if (roundingModeSelect.value) options.roundingMode = roundingModeSelect.value
  if (symbolsBlock.hidden) return options

  for (const [key, select] of Object.entries(symbolControls)) {
    select.disabled = !appliesTo(key, name)
    if (!select.disabled && select.selectedIndex > 0)
      options[key] = select.value
  }

  if (invalidInput.value) options.invalid = invalidInput.value

  return options
}

/**
 * Записывает строку литералом, показывая невидимые символы кодом
 * @param {String} text Строка
 * @returns {String} Литерал в одинарных кавычках
 */
function quote(text) {
  const body = Array.from(text, char =>
    ESCAPED.has(char) ? escapeChar(char) : char
  ).join('')
  return `'${body}'`
}

/**
 * Записывает вызов функции так, как его написал бы потребитель
 * @param {String} name Имя функции
 * @param {String} value Значение из поля ввода
 * @param {Object} options Настройки форматирования
 * @returns {String} Текст вызова
 */
function formatCall(name, value, options) {
  const args = [quote(value)]
  const entries = Object.entries(options)

  if (entries.length) {
    const fields = entries.map(([key, option]) => `${key}: ${quote(option)}`)
    args.push(`{ ${fields.join(', ')} }`)
  }

  return `${name}(${args.join(', ')})`
}

/**
 * Собирает типографский вид из полей объекта — так, как это делает потребитель
 * @param {String} name Имя функции, вернувшей объект
 * @param {Object} parts Объект, возвращённый функцией
 * @returns {Node[]} Узлы для вставки на страницу
 */
function typeset(name, parts) {
  if (!parts.integer) {
    const empty = document.createElement('span')
    empty.className = 'invalid'
    empty.textContent = 'непригодное значение'
    return [empty]
  }

  const sign = parts.negative ? MINUS : ''
  const fraction = parts.fraction ? `,${parts.fraction}` : ''
  const nodes = [`${sign}${parts.integer}${fraction}`]

  if (name === 'toPercentageObject') {
    nodes.push('\u00a0%')
  } else if (parts.exponent) {
    const sup = document.createElement('sup')
    sup.textContent = `${parts.exponentNegative ? MINUS : ''}${parts.exponent}`
    nodes.push(`·${parts.base}`, sup)
  }

  return nodes
}

function render() {
  const name = document.querySelector('input[name="function"]:checked').value
  const value = valueInput.value
  symbolsBlock.hidden = name.endsWith('Object')
  const options = readOptions(name)

  callNode.textContent = formatCall(name, value, options)

  let result
  try {
    result = FormattingUtility[name](value, options)
  } catch (error) {
    outputNode.textContent = `${error.name}: ${error.message}`
    typesetBlock.hidden = true
    return
  }

  const isObject = typeof result === 'object'

  outputNode.textContent = isObject
    ? JSON.stringify(result, null, 2)
    : `'${result}'`

  typesetBlock.hidden = !isObject
  if (isObject) typesetNode.replaceChildren(...typeset(name, result))
}

valueInput.addEventListener('input', render)
functionsNode.addEventListener('change', render)
roundingModeSelect.addEventListener('change', render)
symbolsNode.addEventListener('change', render)
symbolsNode.addEventListener('input', render)

render()
