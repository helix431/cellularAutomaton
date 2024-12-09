<template>
  <canvas ref="canvasRef" :width="canvasWidth" :height="canvasHeight"></canvas>
</template>

<script setup lang="ts">
import { useCanvas } from '@/composables/useCanvas'
import { useCellularAutomaton } from '@/composables/useCellularAutomaton'
import { ref, defineProps } from 'vue'

// Define props
const props = defineProps<{
  ruleNumber: number
  numRows: number
}>()

// Canvas dimensions
const canvasWidth = ref(window.innerWidth)
const canvasHeight = ref(window.innerHeight)

// Cellular automaton configuration
const cellSize = 1
const automatonWidth = props.numRows * 2

// Initialize the first row of the automaton
const initialRow = Array.from({ length: automatonWidth / cellSize }, (_, index) =>
  index === Math.floor(automatonWidth / cellSize / 2) ? 1 : 0,
)

// Create the automaton
const startTime = performance.now()
const { automaton } = useCellularAutomaton(
  props.ruleNumber,
  automatonWidth,
  props.numRows,
  initialRow,
)
console.log(`Automaton generation time: ${performance.now() - startTime}ms`)

// Function to render the automaton on the canvas
const render = (ctx: CanvasRenderingContext2D) => {
  // Start performance measurement
  const startTime = performance.now()

  const batchSize = 100

  // ctx.fillStyle = 'black'
  const offsetX = (canvasWidth.value - automatonWidth * cellSize) / 2

  // Draw in batches of 100 rows
  for (let batchStart = 0; batchStart < automaton.value.length; batchStart += batchSize) {
    ctx.beginPath()

    for (let y = batchStart; y < Math.min(batchStart + batchSize, automaton.value.length); y++) {
      const row = automaton.value[y]
      row.forEach((cell, x) => {
        if (cell) {
          ctx.rect(offsetX + x * cellSize, y * cellSize, cellSize, cellSize)
        }
      })
    }

    // Fill all rectangles in the current batch
    ctx.fill()
  }

  // Log performance metrics
  console.log(`Total render time: ${performance.now() - startTime}ms`)
}

// Set up the canvas with the render function
const { canvasRef } = useCanvas(render)
</script>

<style scoped>
canvas {
  cursor: grab;
}
canvas:active {
  cursor: grabbing;
}
</style>
