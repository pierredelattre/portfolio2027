import { motionPreference } from '../motionPreference'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { stopInertia, restoreScroll } from '../scroll'
import { revealSharedProject, cancelSharedProject } from './sharedProjectTransition'
let entryMedia, exitTween
let releaseScroll
const reduced = () => motionPreference.matches
function signalReady(main) {
 main.dataset.entering = 'false'
 main.dispatchEvent(new Event('page-intro-ready'))
 ScrollTrigger.refresh()
}
function unlockScroll() { releaseScroll?.(); releaseScroll = undefined }
function lockScroll() {
 stopInertia()
 const root = document.documentElement
 const previous = root.style.overflow
 const previousAnchor = root.style.overflowAnchor
 root.style.overflow = 'hidden'
 root.style.overflowAnchor = 'none'
 releaseScroll = () => { root.style.overflow = previous; root.style.overflowAnchor = previousAnchor; restoreScroll({ top: window.scrollY }) }
}
export function prepareEntry(main) {
 main.dataset.entering = reduced() ? 'false' : 'true'
 if (reduced()) return
 gsap.set(main, { opacity: 0 })
 if (main.classList.contains('project-page')) {
  main.dataset.preparing = 'true'
 }
}
export function resolvePageGeometry({ restored = false } = {}) {
 const main = document.querySelector('main')
 if (!main) return
 delete main.dataset.preparing
 if (restored || reduced()) gsap.set(main, { clearProps: 'opacity' })
}
export function cancelEntry({ preserveExit = false } = {}) {
 const header = document.querySelector('#app > .header')
 if (header && !preserveExit) gsap.set(header, { clearProps: 'opacity' })
 const footer = document.querySelector('.footer')
 if (footer) { footer.inert = false; if (!preserveExit) gsap.set(footer, { clearProps: 'opacity,transform' }) }
 entryMedia?.revert()
 entryMedia = undefined
 unlockScroll()
 const main = document.querySelector('main')
 if (main) { delete main.dataset.preparing; gsap.set(main, { clearProps: 'opacity' }) }
}
export function leavePage() {
 stopInertia()
 exitTween?.kill()
 const main = document.querySelector('main')
 if (!main || reduced()) { cancelEntry(); return Promise.resolve() }
 return new Promise(resolve => {
  exitTween = gsap.to([main, ...document.querySelectorAll('body > #app > .header, .footer')], { opacity: 0, duration: .36, ease: 'power2.inOut', onComplete: () => { cancelEntry({ preserveExit: true }); gsap.set(main, { opacity: 0 }); stopInertia(); resolve() }, onInterrupt: resolve })
 })
}
export function revealPage({ restored = false } = {}) {
 // The previous context has already been cleaned in the route guard.
 const main = document.querySelector('main')
 if (!main) return
 // Reveal persistent chrome only after the router has restored the new scroll.
 gsap.set(document.querySelectorAll('#app > .header, .footer'), { clearProps: 'opacity' })
 const fadeHistoryReturn = restored && !reduced() && window.matchMedia('(min-width: 1024px)').matches
 if (restored || reduced()) {
  cancelEntry()
  resolvePageGeometry({ restored: true })
  if (fadeHistoryReturn) {
   main.dataset.entering = 'true'
   entryMedia = gsap.context(() => {
    gsap.fromTo(main, { opacity: 0 }, { opacity: 1, duration: .25, ease: 'power2.out', clearProps: 'opacity', onComplete: () => signalReady(main) })
   })
  } else signalReady(main)
  return
 }
 main.dataset.entering = 'true'
 let hasPlayed = false
 entryMedia = gsap.matchMedia()
 entryMedia.add('(prefers-reduced-motion: no-preference)', () => {
  if (hasPlayed) { signalReady(main); return }
  const cleanups = []
  const finish = () => { hasPlayed = true; unlockScroll(); signalReady(main) }
  function scrollReveal(target, trigger = target) {
   gsap.set(target, { opacity: 0, y: target.classList.contains('full-bleed') ? 0 : 40 })
   const tween = gsap.to(target, { opacity: 1, y: 0, duration: .8, ease: 'power3.out', paused: true, clearProps: 'opacity,transform' })
   const play = () => tween.play()
   const st = ScrollTrigger.create({ trigger, start: 'top 85%', once: true, onEnter: play, onEnterBack: play })
   const focus = () => { tween.progress(1); st.kill() }
   target.addEventListener('focusin', focus)
   cleanups.push(() => { target.removeEventListener('focusin', focus); st.kill(); tween.kill(); gsap.set(target, { clearProps: 'opacity,transform' }) })
  }
  function projectReveal(project) {
   const targets = [project.querySelector('.project__header'), ...[...project.querySelectorAll('.preview')].filter(e => getComputedStyle(e).display !== 'none')]
   gsap.set(targets, { opacity: 0, y: 24 })
   gsap.set(project, { clearProps: 'opacity,transform' })
   const reveal = gsap.timeline({ paused: true })
   reveal.to(targets[0], { opacity: 1, y: 0, duration: .5, ease: 'power2.out', clearProps: 'opacity,transform' }, 0)
   reveal.to(targets.slice(1), { opacity: 1, y: 0, duration: .65, stagger: .065, ease: 'power2.out', clearProps: 'opacity,transform' }, .08)
   const st = ScrollTrigger.create({ trigger: project, start: 'top 92%', once: true, onEnter: () => reveal.play(), onEnterBack: () => reveal.play() })
   const focus = () => { reveal.progress(1); st.kill() }
   project.addEventListener('focusin', focus)
   cleanups.push(() => { project.removeEventListener('focusin', focus); st.kill(); reveal.kill(); gsap.set([project, ...targets], { clearProps: 'opacity,transform' }) })
  }
  const timeline = gsap.timeline({ onComplete: () => {
   finish()
  } })
  if (main.classList.contains('project-page')) {
   const wrapper = main.querySelector('.hero-position')
   // Measure the final layout before collapsing its outer shell. Keep the
   // inner stage at that height so the shared media has a stable destination.
   delete main.dataset.preparing
   gsap.set(wrapper, { clearProps: 'height,overflow' })
   const height = wrapper.getBoundingClientRect().height
   const stage = wrapper.querySelector('.hero-motion')
   const shared = revealSharedProject(main)
   lockScroll()
   const items = main.querySelectorAll(shared ? '.hero__content > *' : '.hero__showcase, .hero__content > *')
   const sections = [...main.querySelector('.case-surface').children]
   gsap.set(stage, { height })
   gsap.set(wrapper, { height: 0, overflow: 'hidden' })
   timeline.to(wrapper, { height, duration: .72, ease: 'power3.inOut', onComplete: () => gsap.set([wrapper, stage], { clearProps: 'height,overflow' }) }, 0)
   gsap.set(items, { opacity: 0, y: 16 })
   gsap.set(sections[0], { opacity: 0, y: 16 })
   timeline.to([...items, sections[0]], { opacity: 1, y: 0, duration: .5, stagger: .055, ease: 'power3.out', clearProps: 'opacity,transform' }, .18)
   if (shared) timeline.to({}, { duration: .72 }, 0)
   for (const section of sections.slice(1)) {
    const sticky = section.querySelector('.showcase__scroll')
    if (sticky) {
     scrollReveal(sticky.querySelector('.content'), section)
     for (const figure of sticky.querySelectorAll('.showcase__preview')) scrollReveal(figure)
    } else scrollReveal(section)
   }
  } else if (main.classList.contains('home')) {
   const intro = main.querySelector('h1')
   const projects = [...main.querySelectorAll('.project')]
   gsap.set(intro, { opacity: 0, y: 12 })
   const first = projects[0]
   const metadata = first?.querySelector('.project__header')
   const previews = first ? [...first.querySelectorAll('.preview')].filter(e => getComputedStyle(e).display !== 'none') : []
   if (metadata) gsap.set(metadata, { opacity: 0, y: 24 })
   if (previews?.length) gsap.set(previews, { opacity: 0, y: 24 })
   timeline.to(intro, { opacity: 1, y: 0, duration: .5, ease: 'power2.inOut', clearProps: 'opacity,transform' }, 0)
   if (metadata) timeline.to(metadata, { opacity: 1, y: 0, duration: .5, ease: 'power2.inOut', clearProps: 'opacity,transform' }, 0)
   if (previews?.length) timeline.to(previews, { opacity: 1, y: 0, duration: .5, ease: 'power2.inOut', clearProps: 'opacity,transform' }, 0)
   for (const project of projects.slice(1)) projectReveal(project)
   // Keep the current frame when scrolling interrupts the entrance, then
   // finish quickly so the content follows the user's movement smoothly.
   let scrollFinish
   const onScroll = () => {
    if (window.scrollY > 8 && timeline.progress() < 1 && !scrollFinish) {
     scrollFinish = timeline.tweenTo(timeline.duration(), { duration: .3, ease: 'power2.out' })
    }
   }
   window.addEventListener('scroll', onScroll, { passive: true })
   cleanups.push(() => { window.removeEventListener('scroll', onScroll); scrollFinish?.kill() })
   const focus = () => timeline.progress(1)
   first?.addEventListener('focusin', focus)
   cleanups.push(() => first?.removeEventListener('focusin', focus))
  } else {
   timeline.from(main.children, { opacity: 0, y: 12, duration: .4, ease: 'power2.inOut', clearProps: 'opacity,transform' }, 0)
  }
  gsap.set(main, { clearProps: 'opacity' })
  return () => {
   hasPlayed = true
   for (const cleanup of cleanups) cleanup()
   unlockScroll()
   delete main.dataset.preparing
   main.dataset.entering = 'false'
   if (reduced()) signalReady(main)
    }
 })
}
export function cleanupTransitions() {
 cancelSharedProject()
 cancelEntry()
 exitTween?.kill()
 exitTween = undefined
}

motionPreference.addEventListener('change', () => { if (motionPreference.matches) { cleanupTransitions(); revealPage({ restored: true }) } })
