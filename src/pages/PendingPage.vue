<script setup>
import PageContainer from '../components/PageContainer.vue'
import BaseButton from '../components/BaseButton.vue'
defineProps({ title: String, text: String })
</script>
<template><PageContainer as="main" id="contenu" tabindex="-1" class="pending"><h1>{{ title }}</h1><p>{{ text }}</p><BaseButton to="/" variant="secondary">Retour aux réalisations</BaseButton></PageContainer></template>
<style scoped>.pending { min-height: 60vh; padding-block: 8rem; display: flex; flex-direction: column; align-items: start; gap: 2rem; & h1 { font-size: 1.5rem; } }</style>
