<script setup>
import MediaAsset from './MediaAsset.vue'
import { computed, ref, onMounted, onUnmounted } from 'vue'
const props = defineProps({ preview: Object, to: String, name: String, fill: Boolean })
const desktop = window.matchMedia('(min-width: 1024px)')
const isDesktop = ref(desktop.matches)
const media = computed(() => isDesktop.value ? props.preview.desktopMedia || props.preview.media : props.preview.media)
function screenChanged() { isDesktop.value = desktop.matches }
onMounted(() => desktop.addEventListener('change', screenChanged))
onUnmounted(() => desktop.removeEventListener('change', screenChanged))
</script>
<template><RouterLink class="preview" :class="{ 'preview--fill': fill, 'preview--hidden-mobile': preview.mobile === false, 'preview--square': preview.media?.squareFrame }" :style="{ background: preview.background, '--preview-fit': media?.fit, '--preview-image-scale': preview.imageScale || 1, '--preview-mobile-image-scale': preview.mobileImageScale || preview.imageScale || 1 }" :to="to" :aria-label="`Voir ${name} : ${preview.label}`"><slot><MediaAsset v-if="preview.media" :media="media" :fill="fill || preview.media.fill" decorative contained image-sizes="(max-width: 600px) calc(100vw - 64px), (max-width: 1023px) 45vw, 30vw" /></slot><span class="overlay" aria-hidden="true"><span>Voir le projet</span></span></RouterLink></template>
<style scoped>
.preview { position: relative; display: flex; align-items: center; justify-content: center; background: var(--surface); height: 400px; min-width: 0; border-radius: var(--radius); overflow: hidden; }
.preview--fill :deep(img), .preview--fill :deep(picture) { width: 100%; height: 100%; object-fit: var(--media-fit, contain); object-position: var(--media-position, center); }
.preview > :deep(picture), .preview > :deep(img), .preview > :deep(.video-wrap), .preview > :deep(.motion-wrap) { max-width: 100%; max-height: 100%; min-width: 0; }
.preview:not(.preview--fill) > :deep(img), .preview:not(.preview--fill) > :deep(picture) { width: auto; height: auto; max-height: 250px; }
.preview:not(.preview--fill) :deep(picture img) { width: auto; height: auto; max-width: 100%; max-height: 250px; }
.preview :deep(.video-wrap) { width: 100%; height: 100%; aspect-ratio: auto !important; border-radius: 0; }
.preview :deep(.video-wrap video) { width: 100%; height: 100%; object-fit: var(--preview-fit, cover); object-position: center; border-radius: 0; }
.preview > :deep(img), .preview > :deep(picture) { transform: scale(var(--preview-image-scale)); transform-origin: center; }
.preview--square { border-radius: 0; }
.overlay { position: absolute; inset: 0; display: grid; place-items: center; background: #0006; opacity: 0; transition: opacity 200ms ease; }
.overlay span { padding: .75rem 1rem; background: var(--surface); border-radius: 999px; }
.preview:focus-visible .overlay { opacity: 1; }
@media (hover: hover) and (pointer: fine) { .preview:hover .overlay { opacity: 1; } }
@media (max-width: 1023px) { .preview--hidden-mobile { display: none; } }
@media (max-width: 600px) { .preview { height: 320px; } .preview > :deep(img), .preview > :deep(picture) { transform: scale(var(--preview-mobile-image-scale)); } }
@media (prefers-reduced-motion: reduce) { .overlay { transition: none; } }
</style>
