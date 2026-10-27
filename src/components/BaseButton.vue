<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
const props = defineProps({ to: [String, Object], href: String, variant: { type: String, default: 'primary' }, type: { type: String, default: 'button' } })
const attributes = computed(() => props.to ? { to: props.to } : props.href ? { href: props.href } : { type: props.type })
const tag = computed(() => props.to ? RouterLink : props.href ? 'a' : 'button')
</script>
<template><component :is="tag" v-bind="attributes" class="button" :class="`button--${variant}`"><slot /></component></template>
<style scoped>
.button { display: inline-flex; cursor: pointer; align-items: center; justify-content: center; padding: .75rem 1rem; border: 0; border-radius: 999px; background: #000; color: white; line-height: 1.5; transition: background-color 180ms ease-out, color 180ms ease-out, border-color 180ms ease-out; &.button--secondary { color: #000; background: var(--surface); } }
@media (hover: hover) and (pointer: fine) { .button:hover { background: #1f1f1f; &.button--secondary { background: #e8e8e8; } } }
.button--footer { background: var(--footer-button-bg, #ffffff14); color: var(--footer-button-color, #fff); border-radius: 999px; min-height: 44px; text-decoration: none; }
@media (hover: hover) and (pointer: fine) { .button.button--footer:hover { background: var(--footer-button-hover, #ffffff26); } }
</style>
