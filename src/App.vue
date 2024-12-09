<template>
  <CanvasComponent :key="canvasKey" :ruleNumber="ruleNumber" :numRows="numRows" />
  <FloatingCard @updateSettings="updateSettings" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import CanvasComponent from './components/CanvasComponent.vue'
import FloatingCard from './components/FloatingCard.vue'

const ruleNumber = ref(30)
const numRows = ref(1000)
const canvasKey = ref(0)

const updateSettings = (settings: { ruleNumber: number; numRows: number }) => {
  ruleNumber.value = settings.ruleNumber
  numRows.value = settings.numRows
}

// Method to reload CanvasComponent
const reloadCanvasComponent = () => {
  canvasKey.value += 1
}

// Watch for changes in ruleNumber and numRows
watch([ruleNumber, numRows], ([newRuleNumber, newNumRows]) => {
  console.log('ruleNumber or numRows changed:', newRuleNumber, newNumRows)
  reloadCanvasComponent()
})
</script>

<style scoped lang="scss"></style>
