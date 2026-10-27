<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { cancelAssistedScroll } from '../scroll'
const thumb = ref(null)
let observer, frame = 0, drag
function update() {
 frame = 0
 const viewport = window.innerHeight
 const range = Math.max(0, document.documentElement.scrollHeight - viewport)
 const height = Math.min(viewport - 8, Math.max(40, viewport * viewport / (range + viewport)))
 const travel = viewport - height - 8
 const el = thumb.value
 if (!el) return
 el.hidden = range <= 0
 el.style.height = `${height}px`
 el.style.transform = `translateY(${4 + (range ? Math.min(1, Math.max(0, window.scrollY / range)) : 0) * travel}px)`
}
function schedule() { if (!frame) frame = requestAnimationFrame(update) }
function start(event) {
 if (event.button !== 0) return
 cancelAssistedScroll()
 const viewport = window.innerHeight
 drag = { y: event.clientY, scroll: window.scrollY, ratio: (document.documentElement.scrollHeight - viewport) / (viewport - thumb.value.offsetHeight - 8) }
 thumb.value.setPointerCapture(event.pointerId)
 event.preventDefault()
}
function move(event) {
 if (drag) window.scrollTo({ top: drag.scroll + (event.clientY - drag.y) * drag.ratio, behavior: 'instant' })
}
function end() { drag = undefined }
onMounted(() => {
 window.addEventListener('scroll', schedule, { passive: true })
 window.addEventListener('resize', schedule)
 observer = new ResizeObserver(schedule)
 observer.observe(document.body)
 update()
})
onUnmounted(() => {
 window.removeEventListener('scroll', schedule)
 window.removeEventListener('resize', schedule)
 observer?.disconnect()
 cancelAnimationFrame(frame)
})
</script>
<template><div ref="thumb" class="scroll-thumb" aria-hidden="true" @pointerdown="start" @pointermove="move" @pointerup="end" @pointercancel="end" @lostpointercapture="end" /></template>
<style scoped>
.scroll-thumb { position: fixed; top: 0; right: 2px; width: 10px; z-index: 10000; touch-action: none; user-select: none; cursor: grab; }
.scroll-thumb::before { content: ''; position: absolute; inset: 0 2px; border-radius: 999px; background: #0005; }
.scroll-thumb:hover::before { background: #0008; }
.scroll-thumb:active { cursor: grabbing; }
@media (forced-colors: active) { .scroll-thumb::before { background: CanvasText; } }
</style>
