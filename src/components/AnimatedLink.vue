<script setup>
import { reducedMotion } from '../motionPreference'
defineProps({ href: { type: String, required: true }, subtle: Boolean, arrowVisible: Boolean, static: Boolean })
</script>

<template>
  <a :href="href" class="animated-link" :class="{ 'animated-link--subtle': subtle, 'animated-link--arrow-visible': arrowVisible || reducedMotion || $props.static, 'animated-link--static': $props.static }"><span class="animated-link__content"><slot /><span class="animated-link__arrow" aria-hidden="true"><svg width="15" height="15" aria-hidden="true" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4H6C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3H11.5C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5V9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z" fill="currentColor" stroke="currentColor" stroke-width=".35"/>
</svg></span></span></a>
</template>

<style scoped>
.animated-link { --link-arrow-size: 1em; --link-arrow-gap: .2em; position: relative; display: inline-flex; align-items: center; width: fit-content; max-width: 100%; font-size: inherit; color: inherit; transition: color 250ms cubic-bezier(.77,0,.175,1); }
.animated-link__content { position: relative; display: inline-flex; align-items: center; }
.animated-link__content::before, .animated-link__content::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 1px; background: var(--link-secondary-color, var(--secondary)); }
.animated-link__content::before { opacity: 1; }
.animated-link--subtle .animated-link__content::before, .animated-link--subtle .animated-link__content::after { display: none; }
.animated-link__content::after { background: var(--link-hover-color, var(--primary)); transform: scaleX(0); transform-origin: left; transition: transform 300ms cubic-bezier(.77,0,.175,1); }
.animated-link__arrow { color: var(--link-secondary-color, var(--secondary)); display: inline-flex; width: 0; overflow: hidden; margin-left: 0; opacity: 0; transform: translateX(-6px); transition: color 250ms cubic-bezier(.77,0,.175,1), width 250ms cubic-bezier(.65,0,.35,1), margin-left 250ms cubic-bezier(.65,0,.35,1), opacity 250ms cubic-bezier(.65,0,.35,1), transform 250ms cubic-bezier(.65,0,.35,1); flex-shrink: 0; }
.animated-link--arrow-visible .animated-link__arrow { width: var(--link-arrow-size); margin-left: var(--link-arrow-gap); opacity: 1; transform: none; }
.animated-link__arrow svg { width: var(--link-arrow-size); height: var(--link-arrow-size); flex: 0 0 var(--link-arrow-size); }
.animated-link:focus-visible { color: var(--link-hover-color, var(--primary)); }
.animated-link:focus-visible .animated-link__content::after { background: var(--link-hover-color, var(--primary)); transform: scaleX(1); }
.animated-link:focus-visible .animated-link__arrow { color: var(--link-hover-color, var(--primary)); width: var(--link-arrow-size); margin-left: var(--link-arrow-gap); opacity: 1; transform: translateX(0); }
@media (hover: hover) and (pointer: fine) {
  .animated-link:hover { color: var(--link-hover-color, var(--primary)); }
  .animated-link:hover .animated-link__content::after { background: var(--link-hover-color, var(--primary)); transform: scaleX(1); }
  .animated-link:hover .animated-link__arrow { color: var(--link-hover-color, var(--primary)); width: var(--link-arrow-size); margin-left: var(--link-arrow-gap); opacity: 1; transform: translateX(0); }
}
.animated-link--static { --link-secondary-color: #767676; color: var(--link-secondary-color); }
.animated-link--static .animated-link__arrow { transition: color 250ms cubic-bezier(.77,0,.175,1); }
@media (prefers-reduced-motion: reduce) {
  .animated-link, .animated-link .animated-link__content::before, .animated-link .animated-link__content::after, .animated-link__arrow { transition: none; }
  .animated-link__arrow { width: var(--link-arrow-size); margin-left: var(--link-arrow-gap); opacity: 1; transform: none; }
}
</style>
