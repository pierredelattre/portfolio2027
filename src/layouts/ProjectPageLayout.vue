<script setup>
import { motionPreference } from '../motionPreference'
import { ref, computed, provide, onMounted, onUnmounted } from 'vue'
import SiteHeader from '../components/SiteHeader.vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
defineProps({ theme: Object })
const page = ref(null), surface = ref(null), hero = ref(null), heroShade = ref(null)
const heroActive = ref(true), introReady = ref(false)
provide('heroActive', computed(() => heroActive.value && introReady.value))
let context, observer, refreshFrame
function setupScroll() {
 introReady.value = true
 if (context || motionPreference.matches) return
 context = gsap.matchMedia()
 context.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
  heroActive.value = true
  gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: surface.value, start: 'top 67.5%', end: 'top top', scrub: true, invalidateOnRefresh: true, onUpdate: trigger => { heroActive.value = trigger.progress < 1 } } })
   .to(hero.value, { scale: .9, ease: 'power1.out' }, 0)
   .to(heroShade.value, { opacity: .65, ease: 'power1.out' }, 0)
  return () => { heroActive.value = true }
 })
 ScrollTrigger.refresh()
}
function preferenceChanged() { context?.revert(); context = undefined; heroActive.value = true; if (introReady.value) setupScroll() }
onMounted(() => {
 motionPreference.addEventListener('change', preferenceChanged)
 if (page.value.dataset.entering === 'true') page.value.addEventListener('page-intro-ready', setupScroll, { once: true })
 else setupScroll()
 observer = new ResizeObserver(() => {
  if (!context) return
  cancelAnimationFrame(refreshFrame)
  refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh())
 })
 observer.observe(hero.value)
})
onUnmounted(() => { motionPreference.removeEventListener('change', preferenceChanged); context?.revert(); observer?.disconnect(); cancelAnimationFrame(refreshFrame); page.value?.removeEventListener('page-intro-ready', setupScroll) })
</script>
<template>
 <main ref="page" id="contenu" tabindex="-1" class="project-page" :style="{ '--hero-bg': theme?.hero }">
  <div class="hero-position">
   <div ref="hero" class="hero-motion">
    <SiteHeader />
    <div class="hero-body" :inert="!heroActive || !introReady"><slot name="hero" /></div>
    <div ref="heroShade" class="hero-shade" aria-hidden="true"></div>
   </div>
  </div>
  <div ref="surface" class="case-surface" :inert="!introReady"><slot /></div>
 </main>
</template>
<style scoped>
.project-page { position: relative; background: #fff;
 &[data-preparing="true"] { & .hero-position { height: 0; overflow: hidden; } & .case-surface { opacity: 0; } }
}
.hero-position { --secondary: #444; position: sticky; top: 0; z-index: 0; height: 800px; background: #111; }
.hero-motion { position: relative; display: flex; flex-direction: column; height: 100%; background: var(--hero-bg, var(--surface)); transform-origin: center center; }
.hero-shade { position: absolute; inset: 0; z-index: 1; background: #808080; opacity: 0; pointer-events: none; }
.hero-motion :deep(.header--project) { position: relative; inset: auto; flex: 0 0 auto; }
.hero-body { flex: 1; display: flex; align-items: center; padding: 4rem var(--gutter); }
.case-surface { position: relative; z-index: 2; background: #fff; padding-block: 8rem; display: grid; gap: var(--rhythm); }
@media (max-width: 1023px) { .hero-position { position: relative; height: auto; } .hero-body { padding-block: 4rem; } }
@media (prefers-reduced-motion: reduce) { .hero-position { position: relative; } }
</style>
