<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { inject } from '@vercel/analytics'
import { SpeedInsights } from '@vercel/speed-insights/vue'
import { startScroll } from './scroll'
import { prepareEntry, cleanupTransitions } from './animations/pageTransitions'
import OverlayScrollbar from './components/OverlayScrollbar.vue'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
const route = useRoute()
let cleanup
onMounted(() => {
 inject()
 cleanup = startScroll()
})
onUnmounted(() => { cleanup?.(); cleanupTransitions() })

</script>
<template>
 <a class="skip" href="#contenu">Aller au contenu</a>
 <SiteHeader v-if="!route.meta.project" />
 <RouterView v-slot="{ Component, route }"><Transition :css="false" appear @before-enter="prepareEntry" @enter="(_, done) => done()" @leave="(_, done) => done()"><component :is="Component" :key="route.path" /></Transition></RouterView>
 <SiteFooter />
 <OverlayScrollbar />
 <SpeedInsights />
</template>
<style scoped>
.skip { position: fixed; top: .5rem; left: .5rem; z-index: 20; padding: 1rem; background: white; transform: translateY(-150%); }
.skip:focus { transform: none; }

</style>
