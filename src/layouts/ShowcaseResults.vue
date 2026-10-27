<script setup>
import RollingNumber from '../components/RollingNumber.vue'
import { motionPreference } from '../motionPreference'
import { ref, onMounted, onUnmounted, watch } from 'vue'
const props = defineProps({ metrics: { type: Array, default: () => [] }, source: String, period: String, rolling: Boolean })
const numbers = ref(null)
const values = ref(props.metrics.map(metric => metric.value))
let observer, motion, frame, started = false
function finish() {
 cancelAnimationFrame(frame)
 values.value = props.metrics.map(metric => metric.value)
}
function animate() {
 if (started || motion?.matches || props.rolling) return
 started = true
 const start = performance.now()
 function tick(now) {
  const progress = Math.min(1, (now - start) / 1400)
  const eased = 1 - Math.pow(1 - progress, 3)
  values.value = props.metrics.map(metric => /^\d+$/.test(metric.value) ? String(Math.round(Number(metric.value) * eased)) : metric.value)
  if (progress < 1) frame = requestAnimationFrame(tick)
  else finish()
 }
 values.value = props.metrics.map(metric => /^\d+$/.test(metric.value) ? '0' : metric.value)
 frame = requestAnimationFrame(tick)
}
function preferenceChanged() { if (motion.matches) { started = true; finish() } }
function observe() {
 observer?.disconnect()
 if (!numbers.value || !props.metrics.length || motion?.matches) return
 observer = new IntersectionObserver(entries => {
  if (entries.some(entry => entry.isIntersecting)) { animate(); observer.disconnect() }
 }, { threshold: .4 })
 observer.observe(numbers.value)
}
watch(() => props.metrics, () => { finish(); started = false; observe() }, { deep: true, flush: 'post' })
onMounted(() => {
 motion = motionPreference
 motion.addEventListener('change', preferenceChanged)
 observe()
})
onUnmounted(() => { observer?.disconnect(); cancelAnimationFrame(frame); motion?.removeEventListener('change', preferenceChanged) })
</script>
<template><section class="results"><slot /><div v-if="metrics.length" ref="numbers" class="results__numbers"><dl class="metrics"><div v-for="(metric, index) in metrics" :key="metric.label"><dt>{{ metric.label }}</dt><dd :class="{ 'metric-text': !/^\d/.test(metric.value) }"><RollingNumber v-if="rolling && /^\d+$/.test(metric.value)" :value="metric.value" /><span v-else aria-hidden="true">{{ values[index] }}</span><span class="sr-only">{{ metric.value }}</span></dd></div></dl><p v-if="period" class="period">{{ period }}</p></div><p v-if="source">Source : {{ source }}</p></section></template>
<style scoped>
.results { display: grid; gap: 4rem; justify-items: center; }
.results > :deep(.copy) { --copy-width: 550px; }
.results__numbers { width: 100%; max-width: 550px; display: grid; gap: 1.5rem; }
.metrics { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 2rem; }
.metrics > div { display: grid; grid-template-rows: max-content 1fr; gap: .5rem; }
.metrics dt { grid-row: 2; }
.metrics dd { grid-row: 1; font-size: clamp(2rem, 3vw, 2.5rem); line-height: 1; font-variant-numeric: tabular-nums; }
.metrics dd.metric-text { font-size: 1.25rem; }
.period { color: var(--secondary); text-align: center; }
@media (max-width: 1023px) { .metrics { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 2rem 1.5rem; } }
</style>
