<script setup>
import { useId } from 'vue'
const descriptionId = useId()
import MediaAsset from './MediaAsset.vue'
import MediaDescription from './MediaDescription.vue'
defineProps({ media: Object, caption: String, bare: Boolean })
</script>
<template><figure :style="{ '--figure-gap': media?.figureGap ? media.figureGap + 'px' : undefined, '--figure-ratio': media?.width && media?.height ? `${media.width} / ${media.height}` : '8 / 5' }" class="showcase__preview" :class="{ 'showcase__preview--captioned': !!caption && !bare, 'showcase__preview--bare': bare, 'showcase__preview--motion': media?.motionPreview, 'showcase__preview--bounded': media?.maxHeight, 'showcase__preview--desktop-height': media?.desktopHeight }"><div class="showcase__media" :style="{ '--image-scale': media?.imageScale ? media.imageScale * 100 + '%' : undefined, '--bounded-height': media?.maxHeight ? media.maxHeight + 'px' : undefined, '--desktop-height': media?.desktopHeight ? media.desktopHeight + 'px' : undefined }"><MediaAsset :media="media" :description-id="media?.description?.length ? descriptionId : undefined" :image-sizes="bare ? '100vw' : undefined" contained /></div><MediaDescription :media="media" :id="descriptionId" /><figcaption v-if="caption">{{ caption }}</figcaption></figure></template>
<style scoped>
.showcase__preview { display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; min-width: 0; gap: var(--figure-gap, .5rem); background: var(--surface); padding: var(--figure-padding, 2rem); border-radius: var(--radius); }
.showcase__preview--captioned { position: relative; isolation: isolate; }
.showcase__preview--captioned::after { content: ''; position: absolute; inset: auto 0 0; height: clamp(56px, 20%, 96px); border-radius: 0 0 var(--radius) var(--radius); background: linear-gradient(to bottom, rgb(245 245 245 / 0), #f5f5f5); pointer-events: none; z-index: 1; }
.showcase__preview--captioned figcaption { position: relative; z-index: 2; }
.showcase__preview--captioned :deep(.playback) { z-index: 2; }
.showcase__media { display: flex; align-items: center; justify-content: center; width: 100%; height: var(--media-size, 320px); min-width: 0; }
.showcase__media > :deep(img), .showcase__media > :deep(picture), .showcase__media > :deep(.video-wrap) { width: var(--image-scale, 100%); height: var(--image-scale, 100%); max-width: 100%; max-height: 100%; }
.showcase__media > :deep(img.rounded-media) { width: auto; height: auto; max-width: var(--image-scale, 100%); max-height: var(--image-scale, 100%); }
figcaption { width: 100%; color: var(--secondary); line-height: normal; text-align: center; }
.showcase__preview--motion { padding: 0; gap: 0; }
.showcase__preview--motion .showcase__media { height: auto; }
.showcase__preview--motion .showcase__media > :deep(.video-wrap) { height: auto; }
.showcase__preview--motion figcaption { padding: .75rem 1rem 1rem; }
.showcase__preview--bare { padding: 0; border-radius: 0; }
.showcase__preview--bare .showcase__media { height: auto; }
.showcase__preview--bare .showcase__media > :deep(img), .showcase__preview--bare .showcase__media > :deep(picture) { height: auto; }
.showcase__preview--bare figcaption { padding: 1rem var(--gutter); }
.showcase__preview--bounded .showcase__media { max-height: var(--bounded-height); }
.showcase__preview--bounded { padding-block: 2rem; }
@media (max-width: 600px) {
 .showcase__preview { padding: 2rem 1rem; }
 .showcase__media { height: min(var(--media-size, 320px), 75vw); }
 .showcase__preview--motion, .showcase__preview--bare { padding: 0; }
 .showcase__preview--motion .showcase__media, .showcase__preview--bare .showcase__media { height: auto; }
}
@media (min-width: 1024px) {
 .showcase__preview--desktop-height .showcase__media { height: var(--desktop-height); }
 .showcase__preview--desktop-height .showcase__media > :deep(img), .showcase__preview--desktop-height .showcase__media > :deep(picture) { width: 100%; height: 100%; }
}
/* Captioned assets occupy the whole frame; captions sit on the bottom fade. */
.showcase__preview--captioned { padding: 0; gap: 0; overflow: hidden; height: calc(var(--media-size, 320px) + 5.5rem); }
.showcase__preview--captioned.showcase__preview--motion { height: auto; aspect-ratio: var(--figure-ratio); }
.showcase__preview--captioned .showcase__media { position: absolute; inset: 0; width: 100%; height: 100%; max-height: none; }
.showcase__preview--captioned .showcase__media > :deep(img),
.showcase__preview--captioned .showcase__media > :deep(picture),
.showcase__preview--captioned .showcase__media > :deep(.video-wrap) { width: 100%; height: 100%; max-width: none; max-height: none; --media-fit: cover !important; }
.showcase__preview--captioned .showcase__media :deep(img),
.showcase__preview--captioned .showcase__media :deep(video) { width: 100%; height: 100%; object-fit: cover; }
.showcase__preview--captioned figcaption { position: absolute; inset: auto 0 0; padding: .75rem 1rem 1rem; pointer-events: none; }
.showcase__preview--captioned :deep(.playback) { bottom: 4rem; }
@media (max-width: 600px) {
 .showcase__preview--captioned:not(.showcase__preview--motion) { height: calc(min(var(--media-size, 320px), 75vw) + 5.5rem); }
}
</style>
