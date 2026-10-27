<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { motionPreference } from '../motionPreference'

const props = defineProps({ value: { type: String, required: true } })
const root = ref(null)
const digits = computed(() => [...props.value].map(Number))
let observer, animations = [], started = false
const steps = digit => 20 + digit
const rows = digit => Array.from({ length: steps(digit) + 1 }, (_, index) => (digit - index + 30) % 10)

function finish() {
 animations.forEach(animation => animation.cancel())
 animations = []
}
function animate() {
 if (started || motionPreference.matches) return
 started = true
 animations = [...root.value.querySelectorAll('.wheel__strip')].map((strip, index) => strip.animate([
  { transform: `translateY(-${steps(digits.value[index])}em)` },
  { transform: 'translateY(0)' }
 ], { duration: 560 + index * 55, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }))
}
function observe() {
 observer?.disconnect()
 if (motionPreference.matches) return
 observer = new IntersectionObserver(entries => {
  if (entries.some(entry => entry.isIntersecting)) { animate(); observer.disconnect() }
 }, { threshold: .6 })
 observer.observe(root.value)
}
function preferenceChanged() { if (motionPreference.matches) { started = true; finish(); observer?.disconnect() } }
watch(() => props.value, () => { finish(); started = false; observe() }, { flush: 'post' })
onMounted(() => { observe(); motionPreference.addEventListener('change', preferenceChanged) })
onUnmounted(() => { observer?.disconnect(); finish(); motionPreference.removeEventListener('change', preferenceChanged) })
</script>

<template>
 <span ref="root" class="rolling-number" aria-hidden="true">
  <span v-for="(digit, index) in digits" :key="index" class="wheel">
   <span class="wheel__strip"><span v-for="(row, rowIndex) in rows(digit)" :key="rowIndex" class="wheel__digit">{{ row }}</span></span>
  </span>
 </span>
</template>

<style scoped>
.rolling-number { display: inline-flex; vertical-align: top; }
.wheel { display: inline-block; width: 1ch; height: 1em; overflow: hidden; }
.wheel__strip { display: flex; flex-direction: column; }
.wheel__digit { display: block; flex: 0 0 1em; height: 1em; line-height: 1; text-align: center; }
</style>
