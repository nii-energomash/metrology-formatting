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

const valueInput = document.querySelector('#value')
const presetsNode = document.querySelector('#presets')
const functionsNode = document.querySelector('#functions')
const roundingModeSelect = document.querySelector('#roundingMode')
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

/**
 * Собирает настройки из органов управления, пропуская незаданные
 * @returns {Object} Настройки форматирования
 */
function readOptions() {
  const options = {}
  if (roundingModeSelect.value) options.roundingMode = roundingModeSelect.value
  return options
}

/**
 * Записывает вызов функции так, как его написал бы потребитель
 * @param {String} name Имя функции
 * @param {String} value Значение из поля ввода
 * @param {Object} options Настройки форматирования
 * @returns {String} Текст вызова
 */
function formatCall(name, value, options) {
  const args = [`'${value}'`]
  const entries = Object.entries(options)

  if (entries.length) {
    const fields = entries.map(([key, option]) => `${key}: '${option}'`)
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
  const options = readOptions()

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

render()
