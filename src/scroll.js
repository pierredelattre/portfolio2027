import { motionPreference } from './motionPreference'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
// Let Vue Router own restoration, including after ScrollTrigger refreshes.
ScrollTrigger.clearScrollMemory('manual')
let lenis, assistedTween
const motion = motionPreference
const tick = time => lenis?.raf(time * 1000)
export function startScroll() {
  const configure = () => {
    lenis?.destroy()
    lenis = motion.matches ? undefined : new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false, autoRaf: false })
    lenis?.on('scroll', ScrollTrigger.update)
    ScrollTrigger.refresh()
  }
  configure()
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  motion.addEventListener('change', configure)
  return () => { motion.removeEventListener('change', configure); gsap.ticker.remove(tick); lenis?.destroy(); lenis = undefined }
}
export function stopInertia() { assistedTween?.kill(); assistedTween = undefined; lenis?.scrollTo(window.scrollY, { immediate: true, force: true }); lenis?.stop() }
export function restoreScroll(position) {
 assistedTween?.kill(); assistedTween = undefined
 // Refresh geometry before restoring: refresh can preserve the old scroll.
 lenis?.resize()
 ScrollTrigger.refresh()
 const top = position.top || 0
 window.scrollTo({ top, left: position.left || 0, behavior: 'instant' })
 lenis?.scrollTo(top, { immediate: true, force: true })
 lenis?.start()
}

export function cancelAssistedScroll() { assistedTween?.kill(); assistedTween = undefined; lenis?.start() }
export function assistScroll(top, duration = 1) {
 stopInertia()
 const position = { y: window.scrollY }
 assistedTween = gsap.to(position, { y: top, duration, ease: 'power2.inOut', onUpdate: () => {
  if (lenis) lenis.scrollTo(position.y, { immediate: true, force: true })
  else window.scrollTo({ top: position.y, behavior: 'instant' })
 }, onComplete: () => { assistedTween = undefined; lenis?.start() }, onInterrupt: () => lenis?.start() })
}
