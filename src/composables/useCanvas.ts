import { ref, onMounted, onUnmounted } from 'vue'

export function useCanvas(renderFunction: (ctx: CanvasRenderingContext2D) => void) {
  const canvasRef = ref<HTMLCanvasElement | null>(null)
  const scale = ref(1)
  const position = ref({ x: 0, y: 0 })
  let isDragging = false
  let lastMousePosition = { x: 0, y: 0 }

  const onMouseDown = (event: MouseEvent) => {
    isDragging = true
    lastMousePosition = { x: event.clientX, y: event.clientY }
  }

  const onMouseMove = (event: MouseEvent) => {
    if (isDragging) {
      const dx = event.clientX - lastMousePosition.x
      const dy = event.clientY - lastMousePosition.y
      position.value.x += dx
      position.value.y += dy
      lastMousePosition = { x: event.clientX, y: event.clientY }
      draw()
    }
  }

  const onMouseUp = () => {
    isDragging = false
  }

  const onWheel = (event: WheelEvent) => {
    const delta = event.deltaY > 0 ? 0.9 : 1.1
    const mouseX = event.clientX - position.value.x
    const mouseY = event.clientY - position.value.y
    const oldScale = scale.value
    scale.value *= delta

    // Adjust position to keep the point under mouse fixed
    position.value.x -= (mouseX * (scale.value - oldScale)) / oldScale
    position.value.y -= (mouseY * (scale.value - oldScale)) / oldScale

    draw()
  }

  const draw = () => {
    const canvas = canvasRef.value
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.save()
        ctx.translate(position.value.x, position.value.y)
        ctx.scale(scale.value, scale.value)
        renderFunction(ctx)
        ctx.restore()
      }
    }
  }

  onMounted(() => {
    const canvas = canvasRef.value
    if (canvas) {
      canvas.addEventListener('mousedown', onMouseDown)
      canvas.addEventListener('mousemove', onMouseMove)
      canvas.addEventListener('mouseup', onMouseUp)
      canvas.addEventListener('wheel', onWheel)
      draw()
    }
  })

  onUnmounted(() => {
    const canvas = canvasRef.value
    if (canvas) {
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseup', onMouseUp)
      canvas.removeEventListener('wheel', onWheel)
    }
  })

  return { canvasRef }
}
