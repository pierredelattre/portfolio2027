<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { assistScroll, restoreScroll } from '../scroll'
import { motionPreference } from '../motionPreference'
const route = useRoute()
function returnToHomeTop(event) {
 const anchor = event.target.closest('a[href="/"]')
 if (!anchor || !route.matched.some(record => record.path === '/') || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
 event.preventDefault()
 if (motionPreference.matches || event.detail === 0) restoreScroll({ top: 0 })
 else assistScroll(0, .45)
}
const header = ref(null)
let observer, frame, previousHeight
onMounted(() => {
 const measure = () => {
  const height = header.value.getBoundingClientRect().height
  if (height === previousHeight) return
  previousHeight = height
  document.documentElement.style.setProperty('--site-header-height', `${height}px`)
 }
 measure()
 observer = new ResizeObserver(() => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure) })
 observer.observe(header.value)
})
onUnmounted(() => { observer?.disconnect(); cancelAnimationFrame(frame); document.documentElement.style.removeProperty('--site-header-height') })
</script>
<template><header @click.capture="returnToHomeTop" ref="header" class="header" :class="{ 'header--project': route.meta.project }"><div class="identity"><RouterLink to="/">Pierre Delattre</RouterLink><p lang="en">Product Design &amp; Design Engineering</p></div><nav aria-label="Navigation principale"><RouterLink to="/" :class="{ active: route.path === '/' }">Réalisations</RouterLink><RouterLink to="/services">Services</RouterLink><RouterLink to="/a-propos">À propos</RouterLink><a href="#contact">Contact</a></nav></header></template>
<style scoped>
.header { position: relative; z-index: 5; display: flex; justify-content: space-between; gap: 2rem; padding: 4rem var(--gutter) 0; background: white; &.header--project { position: absolute; inset: 0 0 auto; width: 100%; background: transparent; } }
.identity, nav { display: flex; gap: 2rem; }
nav { flex-wrap: wrap; row-gap: .75rem; }
nav a { color: var(--secondary); transition: color 150ms ease; &.active, &.router-link-exact-active { color: #000; } }
@media (hover: hover) { nav a:hover { color: #000; } }
@media (max-width: 1023px) { .header { flex-direction: column; padding-top: 2rem; gap: 3rem; } .identity { flex-wrap: wrap; gap: .5rem 2rem; } }
@media (max-width: 600px) {
 .header { gap: 8rem; }
 .identity { flex-direction: column; flex-wrap: nowrap; align-items: start; gap: .5rem; }
 .identity > a { max-width: 100%; }
 .identity > p { min-width: 0; color: var(--secondary); }
}
</style>
