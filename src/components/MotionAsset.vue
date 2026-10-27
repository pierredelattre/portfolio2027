<script setup>
import { motionPreference } from '../motionPreference'
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
const props = defineProps({ media: Object, descriptionId: String, fill: Boolean, decorative: Boolean, active: { type: Boolean, default: true }, eager: Boolean })
const host = ref(null), frame = ref(null), ready = ref(false), playing = ref(false), completed = ref(false), scale = ref(1), canvasHeight = ref(1000)
const small = window.matchMedia('(max-width: 600px)'), reduced = motionPreference
const mobile = ref(small.matches)
const size = computed(() => ({ width: mobile.value ? props.media.mobileWidth || props.media.width : props.media.width, height: mobile.value ? props.media.mobileHeight || props.media.height : props.media.height }))
const source = computed(() => `${props.media.src}?capture=1&render=1`)
let api, loopInput, observer, resizeObserver, pageObserver, pageRoot, monitor, disposed = false, pausedByUser = false, manual = false
function resize() {
 if (!host.value) return
 const widthRatio = host.value.clientWidth / size.value.width, heightRatio = host.value.clientHeight / size.value.height
 if (props.fill && props.media.responsiveCanvas) { scale.value = widthRatio; canvasHeight.value = widthRatio > 0 ? host.value.clientHeight / widthRatio : size.value.height }
 else { scale.value = props.fill && props.media.fit !== 'contain' ? Math.max(widthRatio, heightRatio) : Math.min(widthRatio, heightRatio); canvasHeight.value = size.value.height }
}
function visible() {
 if (!host.value) return false
 const r = host.value.getBoundingClientRect()
 const w = Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0))
 const h = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0))
 return r.width > 0 && r.height > 0 && w * h / (r.width * r.height) >= .15
}
function allowed() { return ready.value && props.active && visible() && !document.hidden && !host.value.closest('[inert]') && pageRoot?.dataset.entering !== 'true' && pageRoot?.dataset.preparing !== 'true' && !pausedByUser && (!reduced.matches || manual) }
function sync() { if (!api) return; if (allowed()) { api.play(); playing.value = true; observeTime() } else { api.pause(); playing.value = false; cancelAnimationFrame(monitor) } }
function observeTime() {
 cancelAnimationFrame(monitor)
 const poll = () => {
  if (!api || disposed) return
  const doc = frame.value.contentDocument
  const t = Number(doc.body.dataset.time)
  let isRunning = api.running ?? doc.querySelector('#play')?.textContent === 'Pause'
  if (t >= api.duration) { api.seek(0); api.play(); isRunning = true }
  playing.value = !!isRunning
  if (playing.value) monitor = requestAnimationFrame(poll)
 }
 monitor = requestAnimationFrame(poll)
}
async function loaded() {
 ready.value = false
 const win = frame.value.contentWindow
 while (!disposed && (!win.motion || win.document.body.dataset.ready !== 'true')) await new Promise(resolve => setTimeout(resolve, 40))
 if (disposed) return
 api = win.motion
 loopInput = win.document.querySelector('#loop')
 if (loopInput) { loopInput.checked = true; loopInput.dispatchEvent(new win.Event('change')) }
 api.seek(reduced.matches ? props.media.resultTime : 0)
 ready.value = true
 resize(); sync()
}
function toggle() {
 if (!api) return
 if (playing.value) { pausedByUser = true; manual = false; sync() }
 else { pausedByUser = false; manual = true; if (completed.value) { completed.value = false; api.seek(0) }; sync() }
}
function preferenceChanged() { manual = false; if (reduced.matches && api) { api.seek(props.media.resultTime); playing.value = false }; sync() }
function screenChanged() { mobile.value = small.matches; completed.value = false; ready.value = false }
watch(() => props.active, sync)
watch(size, () => { resize(); frame.value?.contentWindow.location.reload() })
onMounted(() => {
 pageRoot = host.value.closest('main')
 observer = new IntersectionObserver(sync, { threshold: [0, .15] }); observer.observe(host.value)
 resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host.value)
 pageObserver = new MutationObserver(sync)
 if (pageRoot) pageObserver.observe(pageRoot, { attributes: true, subtree: true, attributeFilter: ['data-entering', 'data-preparing', 'inert'] })
 pageRoot?.addEventListener('page-intro-ready', sync)
 document.addEventListener('visibilitychange', sync)
 window.addEventListener('scroll', sync, { passive: true })
 small.addEventListener('change', screenChanged); reduced.addEventListener('change', preferenceChanged)
 resize()
})
onUnmounted(() => {
 disposed = true; api?.pause(); cancelAnimationFrame(monitor)
 observer?.disconnect(); resizeObserver?.disconnect(); pageObserver?.disconnect()
 pageRoot?.removeEventListener('page-intro-ready', sync)
 document.removeEventListener('visibilitychange', sync); window.removeEventListener('scroll', sync)
 small.removeEventListener('change', screenChanged); reduced.removeEventListener('change', preferenceChanged)
})
</script>
<template>
 <div ref="host" class="motion-wrap" :class="{ 'fill-frame': fill }" :style="{ aspectRatio: `${size.width} / ${size.height}` }" :data-ready="ready" :data-completed="completed">
  <iframe ref="frame" :src="source" :title="media.alt" :aria-describedby="decorative ? undefined : descriptionId" :width="size.width" :height="Math.ceil(canvasHeight)" :style="{ width: size.width + 'px', height: canvasHeight + 'px', transform: `translate(-50%, -50%) scale(${scale})` }" tabindex="-1" :aria-hidden="decorative ? 'true' : undefined" :loading="eager ? 'eager' : 'lazy'" @load="loaded"></iframe>
  <button v-if="!decorative" type="button" class="playback" :disabled="!ready" @click="toggle" :aria-label="playing ? 'Mettre la démonstration en pause' : completed ? 'Rejouer la démonstration' : 'Lire la démonstration'">{{ playing ? 'Pause' : completed ? 'Rejouer' : 'Lire' }}</button>
 </div>
</template>
<style scoped>
.motion-wrap { position:relative; width:100%; max-width:100%; min-width:0; overflow:hidden; background:#f5f5f5; border-radius:4px; }
.motion-wrap.fill-frame { height:100%; aspect-ratio:auto !important; }
iframe { position:absolute; left:50%; top:50%; transform-origin:center; border:0; display:block; pointer-events:none; }
.playback { position:absolute; right:12px; bottom:12px; padding:7px 12px; border:1px solid #d1d5db; border-radius:999px; background:#fff; color:#0a2540; cursor:pointer; font:inherit; font-size:12px; }
.playback:focus-visible { outline:2px solid #000; outline-offset:3px; box-shadow:0 0 0 5px #fff; }
</style>
