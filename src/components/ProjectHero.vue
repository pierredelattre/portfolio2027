<script setup>
import { inject, useId } from 'vue'
const descriptionId = useId()
const heroActive = inject('heroActive', true)
import MediaAsset from './MediaAsset.vue'
import MediaDescription from './MediaDescription.vue'
import BaseButton from './BaseButton.vue'
defineProps({ project: Object, showSiteLink: { type: Boolean, default: true } })
</script>
<template><div class="hero"><div class="hero__showcase"><MediaAsset :media="project.hero" :description-id="project.hero.description?.length ? descriptionId : undefined" :active="heroActive" image-sizes="(max-width: 1023px) calc(100vw - 64px), 45vw" eager /><MediaDescription :media="project.hero" :id="descriptionId" /></div><div class="hero__content"><div class="headings"><h1>{{ project.title }}</h1><p>{{ project.objective }}</p></div><div><span>Périmètre</span><p>{{ project.services.join(', ') }}</p></div><div v-if="project.collaborators?.length"><span>En collaboration avec</span><p>{{ project.collaborators.join(', ') }}</p></div><div v-if="project.tools?.length"><span>Outils utilisés</span><p><template v-for="(tool, index) in project.tools" :key="tool"><template v-if="index">, </template>{{ tool }}</template></p></div><p v-if="project.status && !project.url" class="status">{{ project.status }}</p><BaseButton v-if="project.url && showSiteLink" :href="project.url" target="_blank" rel="noopener noreferrer">Voir le site</BaseButton></div></div></template>
<style scoped>
.hero { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); align-items: center; gap: clamp(3rem, 6vw, 7rem); width: 100%; max-width: 1252px; margin-inline: auto; min-height: 550px; }
.hero__showcase { width: min(640px,100%); justify-self: end; border-radius: 4px; overflow: hidden; }
.hero__showcase :deep(img), .hero__showcase :deep(video) { max-height: 550px; object-fit: var(--media-fit, contain); }
.hero__showcase :deep(.video-wrap) { max-height: 550px; }
.hero__showcase :deep(.motion-wrap) { border-radius: 4px; }
.hero__content { display: grid; justify-items: start; gap: 2rem; width: 100%; max-width: 500px; & span,.status { color: var(--secondary); } }
.headings { display: grid; gap: .25rem; & h1 { font-size: 1.5rem; } & p { font-size: 1.25rem; color: var(--secondary); } }
@media (min-width: 1024px) { .hero { min-height: 0; } }
@media (max-width: 1023px) { .hero { grid-template-columns: 1fr; gap: 2rem; padding-block: 0; min-height: auto; } .hero__showcase { padding: 0; justify-self: center; } .hero__content { max-width: 100%; } }
</style>
