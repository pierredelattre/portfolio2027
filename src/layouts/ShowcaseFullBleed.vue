<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { reducedMotion } from '../motionPreference'
defineProps({ label: String })
const root = ref(null), stage = ref(null), overlay = ref(null)
const desktopQuery = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)')
const desktop = ref(desktopQuery.matches)
const animated = computed(() => desktop.value && !reducedMotion.value)
let frame
function updateZoom() {
 frame = undefined
 const media = stage.value?.querySelector('.showcase__media')
 if (!media || !root.value) return
 if (!animated.value) { media.style.transform = ''; stage.value.style.clipPath = ''; if (overlay.value) overlay.value.style.opacity = '0'; return }
 const rect = root.value.getBoundingClientRect()
 const distance = root.value.offsetHeight - stage.value.offsetHeight
 const progress = distance > 0 ? Math.min(1, Math.max(0, -rect.top / distance)) : 0
 // The card reaches the viewport center before the sticky expansion starts.
 const expansion = smoothStep(progress / .65)
 const zoom = smoothStep((progress - .45) / .55)
 stage.value.style.clipPath = `inset(calc(8svh * ${1 - expansion}) calc(var(--gutter) * ${1 - expansion}) round ${4 * (1 - expansion)}px)`
 media.style.transform = `scale(${1 + zoom * .12})`
 if (overlay.value) { overlay.value.style.opacity = String(smoothStep((progress - .5) / .35)); overlay.value.style.transform = `translateY(${12 * (1 - zoom)}px)` }
}
function smoothStep(value) {
 const t = Math.min(1, Math.max(0, value))
 return t * t * (3 - 2 * t)
}
function scheduleZoom() {
 if (!frame) frame = requestAnimationFrame(updateZoom)
}
function desktopChanged() { desktop.value = desktopQuery.matches }
watch(animated, scheduleZoom, { flush: 'post' })
onMounted(() => {
 desktopQuery.addEventListener('change', desktopChanged)
 window.addEventListener('scroll', scheduleZoom, { passive: true })
 window.addEventListener('resize', scheduleZoom)
 scheduleZoom()
})
onUnmounted(() => {
 desktopQuery.removeEventListener('change', desktopChanged)
 window.removeEventListener('scroll', scheduleZoom)
 window.removeEventListener('resize', scheduleZoom)
 cancelAnimationFrame(frame)
})
</script>
<template><div ref="root" class="full-bleed" :class="{ 'full-bleed--animated': animated }"><div ref="stage" class="full-bleed__stage"><slot /><div v-if="label" ref="overlay" class="full-bleed__overlay"><p class="full-bleed__label">{{ label.replace(/[.。]+$/, '') }}</p></div></div></div></template>
<style scoped>
.full-bleed { width: 100%; background: var(--surface); }
.full-bleed__stage { position: relative; overflow: hidden; }
.full-bleed--animated { height: 185svh; background: transparent; }
.full-bleed--animated .full-bleed__stage { position: sticky; top: 0; height: 100svh; clip-path: inset(8svh var(--gutter) round 4px); }
.full-bleed--animated :deep(.showcase__preview) { height: 100%; }
.full-bleed--animated :deep(.showcase__media) { height: 100%; max-height: none; }
.full-bleed--animated :deep(.showcase__media > img), .full-bleed--animated :deep(.showcase__media > picture) { width: 100%; height: 100%; }
.full-bleed__overlay { position: absolute; inset: 0; z-index: 1; display: grid; place-items: center; padding: var(--gutter); background: #0008; opacity: 0; pointer-events: none; }
.full-bleed__label { color: #fff; text-align: center; max-width: 24ch; font-size: clamp(1.25rem, 2.4vw, 2.25rem); font-weight: 400; line-height: 1.2; letter-spacing: -.035em; text-wrap: balance; }
</style>
