import { ref } from 'vue'

export function useCellularAutomaton(
  ruleNumber: number,
  width: number,
  numRows: number,
  initialRow?: number[],
) {
  const automaton = ref<number[][]>([])

  const generateRuleSet = (ruleNumber: number) => {
    const ruleSet = new Array(8)
    for (let i = 0; i < 8; i++) {
      ruleSet[i] = (ruleNumber >> i) & 1
    }
    return ruleSet
  }

  const initializeStartRow = (width: number, initialRow?: number[]) => {
    const row = initialRow ? initialRow.slice() : new Array(width).fill(0)
    if (!initialRow) {
      row[Math.floor(width / 2)] = 1
    }
    return row
  }

  const generateAutomaton = () => {
    const ruleSet = generateRuleSet(ruleNumber)
    const startRow = initializeStartRow(width, initialRow)
    automaton.value = [startRow]

    let prevRow = startRow
    for (let i = 1; i < numRows; i++) {
      const newRow = new Array(width)
      for (let j = 0; j < width; j++) {
        const left = j > 0 ? prevRow[j - 1] : 0
        const center = prevRow[j]
        const right = j < width - 1 ? prevRow[j + 1] : 0
        const index = (left << 2) | (center << 1) | right
        newRow[j] = ruleSet[index]
      }
      automaton.value.push(newRow)
      prevRow = newRow
    }
  }

  generateAutomaton()

  return { automaton }
}
