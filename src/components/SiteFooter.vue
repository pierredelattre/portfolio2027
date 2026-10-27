<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BaseButton from './BaseButton.vue'
import AnimatedLink from './AnimatedLink.vue'
import { projects } from '../data/projects'
import { assistScroll, cancelAssistedScroll, restoreScroll } from '../scroll'
import { motionPreference, userReducedMotion, toggleReducedMotion } from '../motionPreference'
const footer = ref(null), stage = ref(null), panel = ref(null)
const animated = ref(false), inverted = ref(false), leaving = ref(false), focused = ref(false)
const route = useRoute(), router = useRouter()
const projectTheme = computed(() => projects.find(project => route.matched.some(record => (record.aliasOf?.path || record.path) === project.route))?.theme)
const themeStyle = computed(() => ({ '--project-hero-bg': projectTheme.value?.hero, '--project-footer-bg': projectTheme.value?.footer, '--project-footer-muted': projectTheme.value ? '#ffffffb3' : undefined }))
const state = { progress: 0 }
let context, pageRoot, frame, visualTween, mode = 'closed', hasOpened = false
let revealGroups = [], revealTweens = []
const revealedGroups = new Set()
const clamp = value => Math.min(1, Math.max(0, value))
function renderState() {
 if (!animated.value) return
 const expansion = clamp(state.progress)
 const smooth = expansion
 stage.value.style.clipPath = `inset(calc(8svh * ${1 - smooth}) calc(var(--gutter) * ${1 - smooth}) round ${4 * (1 - smooth)}px)`
 panel.value.style.transform = ''
 revealVisibleGroups()
}
function revealVisibleGroups() {
 if (!hasOpened) return
 for (const group of revealGroups) {
  if (revealedGroups.has(group)) continue
  const rect = group.getBoundingClientRect()
  if (rect.top >= innerHeight * .94 || rect.bottom <= 0) continue
  revealedGroups.add(group)
  revealTweens.push(gsap.to(group, { opacity: 1, transform: 'translateY(0px)', duration: .55, ease: 'power2.out' }))
 }
}
function openFooter() {
 if (!animated.value || mode !== 'closed' || leaving.value) return
 mode = 'opening'
 visualTween?.kill()
 inverted.value = true
 hasOpened = true
 visualTween = gsap.to(state, { progress: 1, duration: .85, ease: 'power2.inOut', onUpdate: renderState, onComplete: () => { mode = 'open' } })
}
function revealForFocus(event) {
 if (!event.target.matches(':focus-visible')) return
 focused.value = true
 cancelAssistedScroll(); visualTween?.kill()
 state.progress = 1; mode = 'open'; hasOpened = true; inverted.value = true; renderState()
 for (const tween of revealTweens) tween.progress(1)
 gsap.set(revealGroups, { opacity: 1, transform: 'translateY(0px)' })
 for (const group of revealGroups) revealedGroups.add(group)
}
function releaseFocus(event) { if (!footer.value.contains(event.relatedTarget)) focused.value = false }
function updateScroll() {
 frame = undefined
 if (!animated.value || leaving.value || focused.value) return
 const rect = footer.value.getBoundingClientRect()
 if (mode === 'closed' && rect.top <= innerHeight * .7 && rect.bottom >= innerHeight * .7) openFooter()
 revealVisibleGroups()
}
function navigateToContact(event) {
 const anchor = event.target.closest('a[href="#contact"]')
 if (!anchor || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
 event.preventDefault()
 const top = footer.value.getBoundingClientRect().top + window.scrollY
 if (motionPreference.matches || event.detail === 0) {
  restoreScroll({ top })
  openFooter()
  footer.value.querySelector('.footer__email')?.focus({ preventScroll: true })
 } else {
  assistScroll(top, .85)
  // The scroll listener opens the footer as it enters the viewport.
  updateScroll()
 }
}
function scheduleScroll() { if (!frame) frame = requestAnimationFrame(updateScroll) }
async function navigateFromFooter(event) {
 const anchor = event.target.closest('a')
 if (!anchor || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || anchor.target === '_blank') return
 const href = anchor.getAttribute('href')
 if (!href?.startsWith('/') || href === '/llms.txt' || leaving.value) return
 if (href === '/' && route.matched.some(record => record.path === '/')) {
  event.preventDefault()
  if (motionPreference.matches || event.detail === 0) restoreScroll({ top: 0 })
  else assistScroll(0, .45)
  return
 }
 if (href === route.path || motionPreference.matches || event.detail === 0) return
 event.preventDefault()
 leaving.value = true
 cancelAssistedScroll(); visualTween?.kill()
 // The page transition fades the visible footer progressively.
 await router.push(href)
 leaving.value = false
}

function configureReveal() {
 if (context || motionPreference.matches || !footer.value) return
 context = gsap.matchMedia()
 context.add('(min-width: 1024px) and (min-height: 700px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
  animated.value = true; inverted.value = hasOpened; state.progress = hasOpened ? 1 : 0; mode = hasOpened ? 'open' : 'closed'
  revealGroups = [...footer.value.querySelectorAll('[data-footer-reveal]')]
  revealedGroups.clear()
  gsap.set(revealGroups, { opacity: 0, transform: 'translateY(24px)' })
  renderState(); scheduleScroll()
  return () => {
   animated.value = false
   visualTween?.kill(); cancelAssistedScroll()
   for (const tween of revealTweens) tween.kill()
   gsap.set(revealGroups, { clearProps: 'opacity,transform' })
   revealGroups = []; revealTweens = []; revealedGroups.clear()
   stage.value.style.clipPath = ''; panel.value.style.transform = ''
  }
 })
 ScrollTrigger.refresh()
}
function prepareReveal() {
 context?.revert(); context = undefined; focused.value = false; leaving.value = false
 panel.value?.style.removeProperty('opacity')
 pageRoot?.removeEventListener('page-intro-ready', configureReveal)
 pageRoot = document.querySelector('main')
 if (pageRoot?.dataset.entering === 'true') pageRoot.addEventListener('page-intro-ready', configureReveal, { once: true })
 else configureReveal()
}
watch(() => route.path, () => {
 hasOpened = false
 nextTick(prepareReveal)
})
onMounted(() => {
 prepareReveal()
 motionPreference.addEventListener('change', prepareReveal)
 document.addEventListener('click', navigateToContact)
 window.addEventListener('scroll', scheduleScroll, { passive: true })
 window.addEventListener('resize', scheduleScroll)
})
onUnmounted(() => {
 context?.revert(); visualTween?.kill(); cancelAnimationFrame(frame)
 pageRoot?.removeEventListener('page-intro-ready', configureReveal)
 motionPreference.removeEventListener('change', prepareReveal)
 document.removeEventListener('click', navigateToContact)
 window.removeEventListener('scroll', scheduleScroll)
 window.removeEventListener('resize', scheduleScroll)
})
</script>
<template>
 <footer id="contact" ref="footer" class="footer" :style="themeStyle" :class="{ 'footer--animated': animated, 'footer--leaving': leaving, 'footer--focused': focused }" @click.capture="navigateFromFooter" @focusin="revealForFocus" @focusout="releaseFocus">
  <div ref="stage" class="footer__stage"><div ref="panel" class="footer__panel" :class="{ 'footer__panel--inverted': inverted || !animated }">
  <div class="footer__row">
   <div class="footer__contact" data-footer-reveal>
    <div class="footer__intro">
     <h2 class="footer__label">Un projet en tête ? Du design à sa réalisation</h2>
     <p>Conception et intégration d’interfaces, avec une attention aux détails et aux usages.</p>
    </div>
    <BaseButton class="footer__email" href="mailto:hello@pierredelattre.fr" variant="primary">
     hello@pierredelattre.fr
     <svg class="footer__email-icon" width="16" height="16" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4H6C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3H11.5C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5V9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z" fill="currentColor" stroke="currentColor" stroke-width=".35" /></svg>
    </BaseButton>
   </div>
   <div class="footer__services" data-footer-reveal>
    <nav aria-label="Découvrir le portfolio"><BaseButton to="/" variant="footer">Réalisations</BaseButton><BaseButton to="/services" variant="footer">Services</BaseButton><BaseButton to="/a-propos" variant="footer">À propos</BaseButton></nav>
   </div>
  </div>
  <div class="footer__bottom" data-footer-reveal>
   <p>Portfolio 2027</p>
   <nav aria-label="Informations de pied de page"><RouterLink to="/plan-du-site">Plan du site</RouterLink><RouterLink to="/accessibilite">Accessibilité</RouterLink><button type="button" :aria-pressed="userReducedMotion" @click="toggleReducedMotion">{{ userReducedMotion ? 'Activer les animations' : 'Réduire les animations' }}</button><a href="/llms.txt">LLMs</a><AnimatedLink subtle href="https://github.com/pierredelattre" target="_blank" rel="noopener noreferrer">GitHub</AnimatedLink></nav>
  </div>
  </div></div>
 </footer>
</template>
<style scoped>
.footer { position: relative; z-index: 2; background: #fff; }
.footer__stage { position: relative; overflow: hidden; }
.footer__panel { --footer-bg: var(--project-hero-bg, #fff); --footer-color: #111; --footer-muted: #626262; --footer-divider: #00000026; --footer-button-bg: #f0f0f0; --footer-button-color: #111; --footer-button-hover: #e5e5e5; display: flex; flex-direction: column; justify-content: space-between; gap: 4rem; padding: 6rem var(--gutter) 2rem; background: var(--footer-bg); color: var(--footer-color); transition: background-color 850ms cubic-bezier(.65,0,.35,1), color 850ms cubic-bezier(.65,0,.35,1); }
.footer__panel--inverted { --footer-bg: var(--project-footer-bg, #111); --footer-color: #fff; --footer-muted: var(--project-footer-muted, #b4b4b4); --footer-divider: #ffffff26; --footer-button-bg: #ffffff14; --footer-button-color: #fff; --footer-button-hover: #ffffff26; }
.footer--animated { height: 170svh; }
.footer--animated .footer__stage { position: sticky; top: 0; height: 100svh; clip-path: inset(8svh var(--gutter) round 4px); }
.footer--animated .footer__panel { height: 100%; }
.footer__bottom { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; color: var(--footer-muted); font-size: .8125rem; }
.footer__row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr) minmax(0, 1fr); align-items: center; gap: clamp(2rem, 3vw, 4rem); margin-block: auto; }
.footer__contact { display: grid; gap: 1rem; text-align: left; }
h2 { font-size: .875rem; font-weight: 400; letter-spacing: -.035em; line-height: 1.2; }
.footer__email.button--primary { width: fit-content; max-width: 100%; gap: .25rem; background: #fff; color: #111; font-size: .875rem; text-decoration: none; }
.footer__email-icon { flex-shrink: 0; }
@media (hover: hover) and (pointer: fine) { .footer__email.button--primary:hover { background: #e8e8e8; } }
.footer__intro { max-width: 44ch; display: grid; gap: .5rem; }
.footer__intro > p:last-child { color: var(--footer-color); font-size: .875rem; line-height: 1.7; }
.footer__label { color: var(--footer-muted); }
.footer__services { grid-column: 3 / 4; display: grid; align-content: start; justify-self: end; text-align: right; gap: .5rem; }
.footer__services nav { display: flex; justify-content: flex-end; flex-wrap: nowrap; gap: .5rem; }
.footer__bottom { padding-top: 1.5rem; border-top: 1px solid var(--footer-divider); }
.footer__bottom nav { display: flex; flex-wrap: wrap; gap: .5rem 1.5rem; }
.footer__panel { --link-hover-color: var(--footer-color); --link-secondary-color: var(--footer-muted); }
.footer a, .footer button { min-height: 44px; align-items: center; }
.footer__bottom a, .footer__bottom button { display: inline-flex; color: var(--footer-muted); transition: color 250ms cubic-bezier(.77,0,.175,1); }
.footer__bottom button { background: none; border: 0; padding: 0; }
.footer :focus-visible { outline-color: var(--footer-color); box-shadow: 0 0 0 5px var(--footer-bg); }
@media (hover: hover) and (pointer: fine) { .footer__bottom a:hover, .footer__bottom button:hover { color: var(--footer-color); } }
@media (min-width: 1024px) { .footer__panel { min-height: 100svh; padding: max(12svh, 6rem) calc(var(--gutter) + 2rem) max(10svh, 3rem); } }
@media (max-width: 1199px) {
 .footer__panel { gap: 3rem; padding: 3rem var(--gutter) 1.5rem; min-height: auto; }
 .footer__row { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2.5rem 3rem; margin-block: auto; }
 .footer__services { grid-column: 2 / 3; justify-self: end; text-align: right; }
 .footer__services nav { justify-content: flex-end; flex-wrap: wrap; }
 .footer__bottom { align-items: start; flex-direction: column; gap: .5rem; }
 .footer__bottom nav { gap: .25rem 1.25rem; }
}
@media (max-width: 639px) {
 .footer__row { grid-template-columns: 1fr; gap: 3.5rem; margin-block: 0; }
 .footer__contact { text-align: left; }
 .footer__services { grid-column: 1 / -1; justify-self: start; text-align: left; }
 .footer__services nav { justify-content: flex-start; }
}
.footer--leaving :deep(.button--footer) { background: var(--footer-button-bg) !important; }
.footer--leaving :deep(.animated-link__arrow) { opacity: 0 !important; }
.footer--focused .footer__panel { transition: none; }
</style>
