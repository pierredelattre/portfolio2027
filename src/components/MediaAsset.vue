<script setup>
import { motionPreference } from '../motionPreference'
import MotionAsset from './MotionAsset.vue'
import { computed, ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
const props = defineProps({ media: { type: Object, required: true }, eager: Boolean, imageSizes: { type: String, default: '(max-width: 600px) calc(100vw - 64px), (max-width: 1023px) calc(100vw - 64px), 45vw' }, descriptionId: String, contained: Boolean, fill: Boolean, decorative: Boolean, active: { type: Boolean, default: true } })
const video = ref(null)
const mediaZoom = ref(props.media.zoom || 1)
let zoomObserver
function updateMediaZoom() {
 const el = video.value
 const desired = props.media.zoom || 1
 if (!el || !props.media.safeFrameWidth) { mediaZoom.value = desired; return }
 const { width, height } = responsiveSize.value
 const fit = getComputedStyle(el).objectFit
 const scale = (fit === 'cover' ? Math.max : Math.min)(el.clientWidth / width, el.clientHeight / height)
 const frameWidth = width * scale * props.media.safeFrameWidth
 mediaZoom.value = frameWidth > 0 ? Math.min(desired, Math.max(1, (el.clientWidth - 16) / frameWidth)) : 1
}
const failedAutoplay = ref(false)
const playing = ref(false)
const completed = ref(false)
const started = ref(false)
let userPaused = false, userRequestedPlayback = false
let observer, pageObserver, pageRoot, startTimer, playbackFrame
let pendingPlay = false, disposed = false, interruptedStarts = 0
const smallScreen = window.matchMedia('(max-width: 600px)')
const isSmallScreen = ref(smallScreen.matches)
const responsiveSource = computed(() => isSmallScreen.value && props.media.mobileSrc ? props.media.mobileSrc : props.media.src)
const responsiveSize = computed(() => isSmallScreen.value && (props.media.mobileSrc || props.media.mobile) ? { width: props.media.mobileWidth, height: props.media.mobileHeight } : { width: props.media.width, height: props.media.height })
function screenChanged() { isSmallScreen.value = smallScreen.matches }
watch(responsiveSource, () => { completed.value = false; started.value = false; userPaused = false; failedAutoplay.value = false; nextTick(syncPlayback) })
const motion = motionPreference
const reducedMotion = ref(motion.matches)
const motionPreview = computed(() => props.media.motionPreview === true)
const poster = computed(() => {
 const mobile = isSmallScreen.value && props.media.mobileSrc
 if (reducedMotion.value) return mobile && props.media.mobileReducedMotionPoster ? props.media.mobileReducedMotionPoster : props.media.reducedMotionPoster || props.media.poster
 return mobile && props.media.mobilePoster ? props.media.mobilePoster : props.media.poster
})
const playbackLabel = computed(() => playing.value ? 'Mettre la démonstration en pause' : completed.value ? 'Rejouer la démonstration' : 'Lire la démonstration')
function motionChanged() { userRequestedPlayback = false; reducedMotion.value = motion.matches; syncPlayback() }
function cancelStart() { clearTimeout(startTimer); startTimer = undefined }
function pageReady() {
 return !pageRoot || (pageRoot.dataset.entering !== 'true' && pageRoot.dataset.preparing !== 'true' && !video.value?.closest('[inert]'))
}
function actuallyVisible() {
 const el = video.value
 if (!el) return false
 const rect = el.getBoundingClientRect()
 const width = Math.max(0, Math.min(rect.right, innerWidth) - Math.max(rect.left, 0))
 const height = Math.max(0, Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0))
 return rect.width > 0 && rect.height > 0 && width * height / (rect.width * rect.height) >= .15
}
function canAutoplay() {
 return actuallyVisible() && pageReady() && props.active && !document.hidden && (!motion.matches || userRequestedPlayback) && !failedAutoplay.value && !userPaused
}
async function playMedia() {
 const el = video.value
 if (!el || disposed || pendingPlay || !el.paused) return
 pendingPlay = true
 // Set the property before play(), including browsers that inspect it rather
 // than the muted attribute when deciding whether autoplay is allowed.
 el.muted = true
 try {
  await el.play()
  interruptedStarts = 0
  if (!disposed && el.dataset.sharedTransition !== 'true' && !canAutoplay()) el.pause()
 } catch (error) {
  if (disposed) return
  if (error.name === 'AbortError') {
   // A pause during navigation/loading can abort play without another
   // intersection event. Retry briefly once the page is ready.
   if (canAutoplay() && interruptedStarts++ < 2) {
    cancelStart()
    startTimer = setTimeout(() => { startTimer = undefined; syncPlayback() }, 150)
   }
  } else failedAutoplay.value = true
 } finally { pendingPlay = false }
}
function schedulePlayback() {
 cancelAnimationFrame(playbackFrame)
 playbackFrame = requestAnimationFrame(syncPlayback)
}
function resumePlayback() {
 interruptedStarts = 0
 if (!document.hidden) failedAutoplay.value = false
 schedulePlayback()
}
function syncPlayback() {
 if (video.value?.dataset.sharedTransition === 'true') return
 const el = video.value
 if (!el) return
 if (!canAutoplay()) { cancelStart(); el.pause(); return }
 if (motionPreview.value && !started.value) {
  if (startTimer) return
  startTimer = setTimeout(() => {
   startTimer = undefined
   if (canAutoplay()) playMedia()
  }, 100)
 } else playMedia()
}
function introReady() { interruptedStarts = 0; nextTick(syncPlayback) }
watch(() => props.active, syncPlayback)
function togglePlayback() {
 const el = video.value
 if (!el) return
 cancelStart()
 if (el.paused) {
  userPaused = false
  userRequestedPlayback = true
  failedAutoplay.value = false
  el.muted = true
  if (completed.value || el.ended) { completed.value = false; el.currentTime = 0 }
  el.play().catch(error => { if (error.name !== 'AbortError') failedAutoplay.value = true })
 } else { userPaused = true; userRequestedPlayback = false; el.pause() }
}
function ended() { completed.value = true; playing.value = false }
onMounted(() => {
 smallScreen.addEventListener('change', screenChanged)
 if (!video.value) return
 if (props.media.safeFrameWidth) {
  zoomObserver = new ResizeObserver(updateMediaZoom)
  zoomObserver.observe(video.value.parentElement)
  updateMediaZoom()
 }
 pageRoot = video.value.closest('main')
 pageRoot?.addEventListener('page-intro-ready', introReady)
 if (pageRoot) {
  pageObserver = new MutationObserver(() => nextTick(syncPlayback))
  pageObserver.observe(pageRoot, { attributes: true, subtree: true, attributeFilter: ['data-entering', 'data-preparing', 'inert'] })
 }
 observer = new IntersectionObserver(syncPlayback, { threshold: [0, .15] })
 observer.observe(video.value)
 document.addEventListener('visibilitychange', resumePlayback)
 window.addEventListener('pageshow', resumePlayback)
 window.addEventListener('scroll', schedulePlayback, { passive: true })
 window.addEventListener('resize', schedulePlayback)
 motion.addEventListener('change', motionChanged)
})
onUnmounted(() => {
 disposed = true
 zoomObserver?.disconnect()
 cancelStart()
 cancelAnimationFrame(playbackFrame)
 pageObserver?.disconnect()
 pageRoot?.removeEventListener('page-intro-ready', introReady)
 observer?.disconnect()
 if (video.value?.dataset.sharedTransition !== 'true') video.value?.pause()
 document.removeEventListener('visibilitychange', resumePlayback)
 window.removeEventListener('pageshow', resumePlayback)
 window.removeEventListener('scroll', schedulePlayback)
 window.removeEventListener('resize', schedulePlayback)
 motion.removeEventListener('change', motionChanged)
 smallScreen.removeEventListener('change', screenChanged)
})
</script>
<template>
 <MotionAsset :description-id="descriptionId" v-if="media.type === 'motion'" :media="media" :fill="fill" :decorative="decorative" :active="active" :eager="eager" />
 <div v-else-if="media.type === 'placeholder'" class="media-placeholder" role="img" :aria-label="`${media.alt} : visuel à ajouter`"></div>
 <div v-else-if="media.type === 'video'" class="video-wrap" :class="{ contained, 'fill-frame': fill, 'motion-preview': media.motionPreview, 'intro-motion': media.introMotion, 'square-frame': media.squareFrame, 'full-stage': media.fullStage }" :style="{ aspectRatio: media.frameRatio || `${responsiveSize.width} / ${responsiveSize.height}`, '--media-fit': media.fit || 'contain', '--media-position': media.position || 'center', '--media-zoom': mediaZoom, '--image-radius': media.radius ? media.radius + 'px' : undefined }" :data-completed="completed">
  <video ref="video" :src="responsiveSource" :poster="poster" :width="responsiveSize.width" :height="responsiveSize.height" :aria-label="decorative ? undefined : media.alt" :aria-hidden="decorative ? true : undefined" :aria-describedby="descriptionId" muted playsinline loop :preload="reducedMotion ? 'none' : eager ? 'metadata' : 'none'" @canplay="syncPlayback" @play="playing = true; started = true; failedAutoplay = false" @pause="playing = false" @ended="ended"></video>
  <button v-if="!decorative" class="playback" type="button" @click="togglePlayback" :aria-label="playbackLabel">{{ playing ? 'Pause' : completed ? 'Rejouer' : 'Lire' }}</button>
 </div>
 <picture v-else-if="media.mobile" :class="{ contained, 'fill-frame': fill, 'rounded-media': !!media.radius }" :style="{ '--media-fit': media.fit || 'contain', '--media-position': media.position || 'center', '--image-radius': media.radius ? media.radius + 'px' : undefined }"><source media="(max-width: 600px)" :srcset="media.mobileSrcset || media.mobile" :sizes="imageSizes" :width="media.mobileWidth" :height="media.mobileHeight"><img :src="media.src" :srcset="media.srcset" :sizes="imageSizes" :fetchpriority="eager ? 'high' : 'auto'" :alt="decorative ? '' : media.alt" :aria-describedby="decorative ? undefined : descriptionId" :width="responsiveSize.width" :height="responsiveSize.height" :loading="eager ? 'eager' : 'lazy'" decoding="async"></picture>
 <img v-else :class="{ contained, 'fill-frame': fill, 'rounded-media': !!media.radius }" :style="{ '--media-fit': media.fit || 'contain', '--media-position': media.position || 'center', '--image-radius': media.radius ? media.radius + 'px' : undefined }" :src="media.src" :srcset="media.srcset" :sizes="imageSizes" :fetchpriority="eager ? 'high' : 'auto'" :alt="decorative ? '' : media.alt" :aria-describedby="decorative ? undefined : descriptionId" :width="responsiveSize.width" :height="responsiveSize.height" :loading="eager ? 'eager' : 'lazy'" decoding="async">
</template>
<style scoped>
.media-placeholder { width: 100%; height: 100%; min-height: 160px; }
img, picture, video { display: block; width: 100%; max-width: 100%; min-width: 0; height: auto; object-fit: var(--media-fit, contain); object-position: var(--media-position, center); }
picture img { width: 100%; height: 100%; }
img, picture { border-radius: var(--image-radius, 0); }
img.contained, picture.contained { width: 100%; height: 100%; max-height: 100%; }
img.rounded-media { width: auto; height: auto; max-width: 100%; max-height: 100%; }
.video-wrap { position: relative; width: 100%; min-width: 0; border-radius: var(--radius); overflow: hidden; background: transparent; }
.video-wrap video { width: 100%; height: 100%; border-radius: inherit; object-fit: var(--media-fit, contain); transform: scale(var(--media-zoom, 1)); }
.video-wrap.contained { width: 100%; height: 100%; max-height: 100%; }
.fill-frame { width: 100%; height: 100%; max-height: 100%; }
.video-wrap.fill-frame, .video-wrap.full-stage.contained { aspect-ratio: auto !important; }
.video-wrap.square-frame { border-radius: 0; }
.playback { min-width: 44px; min-height: 32px; position: absolute; bottom: .5rem; right: .5rem; padding: .4rem .7rem; background: #ffffffed; color: #000; border: 0; border-radius: 999px; font-size: .75rem; }
</style>
