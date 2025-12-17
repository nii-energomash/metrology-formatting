import { FormattingUtility } from '../src'

const input = document.querySelector('#number')
const formattedNumberNode = document.querySelector('#formatedNumber')
const formattedPercentageNode = document.querySelector('#formatedPercentage')

const signNode = document.querySelector('#sign')
const mantissaNode = document.querySelector('#mantissa')
const multiplicationSignNode = document.querySelector('#multiplication-sign')
const baseNode = document.querySelector('#base')
const exponentNode = document.querySelector('#exponent')

input.addEventListener('input', () => {
  const percentagesString = FormattingUtility.toPercentageString(input.value)
  const numberString = FormattingUtility.toStandardFormString(input.value)
  const numberOnject = FormattingUtility.toStandardFormObject(input.value)

  formattedNumberNode.innerHTML = numberString
  formattedPercentageNode.innerHTML = percentagesString

  signNode.innerHTML = numberOnject.sign
  mantissaNode.innerHTML = numberOnject.mantissa

  if (numberOnject.exponent !== '') {
    multiplicationSignNode.innerHTML = '×'
    baseNode.innerHTML = numberOnject.base
    exponentNode.innerHTML = numberOnject.exponent
  } else {
    multiplicationSignNode.innerHTML = ''
    baseNode.innerHTML = ''
    exponentNode.innerHTML = ''
  }
})
