import { ref } from 'vue'
const system = window.matchMedia('(prefers-reduced-motion: reduce)')
let saved = false
try { saved = localStorage.getItem('portfolio-reduced-motion') === 'true' } catch {}
export const userReducedMotion = ref(saved)
export const reducedMotion = ref(system.matches || saved)
const listeners = new Set()
function update() {
 reducedMotion.value = system.matches || userReducedMotion.value
 document.documentElement.classList.toggle('motion-reduced', reducedMotion.value)
 for (const listener of listeners) listener({ matches: reducedMotion.value })
}
export const motionPreference = {
 get matches() { return reducedMotion.value },
 addEventListener(type, listener) { if (type === 'change') listeners.add(listener) },
 removeEventListener(type, listener) { if (type === 'change') listeners.delete(listener) }
}
export function toggleReducedMotion() {
 userReducedMotion.value = !userReducedMotion.value
 try { localStorage.setItem('portfolio-reduced-motion', String(userReducedMotion.value)) } catch {}
 update()
}
system.addEventListener('change', update)
update()
