<template>
  <div v-if="isVisible" class="floating-card">
    <div>
      <label for="ruleNumber">Rule Number:</label>
      <input
        id="ruleNumber"
        type="number"
        v-model="localRuleNumber"
        min="0"
        max="255"
        @keyup.enter="applyChanges"
      />
    </div>
    <div>
      <label for="numRows">Number of Rows:</label>
      <input
        id="numRows"
        type="number"
        v-model="localNumRows"
        @keyup.enter="applyChanges"
        step="500"
      />
    </div>
    <button @click="applyChanges">Render</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineEmits } from 'vue'

const isVisible = ref(false)
const localRuleNumber = ref(30)
const localNumRows = ref(1000)

const emit = defineEmits(['updateSettings'])

const toggleVisibility = (event: KeyboardEvent) => {
  if (event.metaKey && event.key === 'Enter') {
    isVisible.value = !isVisible.value
  }
}

const applyChanges = () => {
  if (localRuleNumber.value < 0 || localRuleNumber.value > 255) {
    localRuleNumber.value = 30
    alert('Rule number must be between 0 and 255')
    return
  }
  if (localNumRows.value < 0) {
    localNumRows.value = 1000
    alert('Number of rows must be greater than 0')
    return
  }
  emit('updateSettings', { ruleNumber: localRuleNumber.value, numRows: localNumRows.value })
}

onMounted(() => {
  window.addEventListener('keydown', toggleVisibility)
})

onUnmounted(() => {
  window.removeEventListener('keydown', toggleVisibility)
})
</script>

<style scoped>
.floating-card {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 250px;
  padding: 20px;
  background-color: #f9f9f9;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  border: 1px solid #ddd;
}

.floating-card label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.floating-card input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.floating-card button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.floating-card button:hover {
  background-color: #0056b3;
}
</style>
