<script setup>
import { computed } from 'vue'
const props = defineProps({ text: { type: String, default: '' } })
const terms = ['résultats enrichis Google', 'données structurées', 'rapport automatisé', 'plan de taggage', 'SEO organique', 'recherche exploratoire', 'design system', 'PostHog', 'Keystatic', 'Analytics', 'Zeroheight', 'Figma', 'FSRS', 'CRM', 'SEO', 'GEO', 'API', 'tests utilisateurs', 'entretiens']
const pattern = new RegExp('(?<![\\p{L}\\p{N}])(' + terms.join('|') + ')(?![\\p{L}\\p{N}])', 'giu')
const parts = computed(() => props.text.split(pattern).filter(Boolean).map((text, i) => ({ text, emphasized: terms.some(term => term.toLowerCase() === text.toLowerCase()) })))
</script>
<template><template v-for="(part, index) in parts" :key="index"><strong v-if="part.emphasized">{{ part.text }}</strong><template v-else>{{ part.text }}</template></template></template>
