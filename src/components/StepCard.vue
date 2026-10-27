<script setup>
defineProps({
 number: String,
 title: { type: String, required: true },
 text: String,
 variant: { type: String, default: 'filled', validator: value => ['filled', 'outline'].includes(value) }
})
</script>

<template>
 <li class="step-card" :class="{ 'step-card--outline': variant === 'outline' }">
  <span v-if="number" class="step-card__number" aria-hidden="true">{{ number }}</span>
  <h3>{{ title }}</h3>
  <p v-if="text">{{ text }}</p>
  <slot />
 </li>
</template>

<style scoped>
.step-card { display: flex; flex-direction: column; align-items: flex-start; gap: 1rem; padding: 2rem; border: 1px solid transparent; border-radius: var(--radius); background: var(--surface); }
.step-card__number { color: var(--secondary); font-variant-numeric: tabular-nums; }
.step-card h3 { font-weight: 600; }
.step-card p { color: var(--secondary); }
.step-card--outline { border: 1px dashed var(--secondary); background: transparent; }
@media (max-width: 600px) { .step-card { padding: 1.5rem; } }
</style>
