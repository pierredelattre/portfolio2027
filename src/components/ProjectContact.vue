<script setup>
import PageContainer from './PageContainer.vue'
import BaseButton from './BaseButton.vue'
</script>
<template><PageContainer class="project-contact"><p>Un projet en tête ?</p><BaseButton href="mailto:hello@pierredelattre.fr">hello@pierredelattre.fr</BaseButton></PageContainer></template>
<style scoped>.project-contact { position: relative; z-index: 2; background: white; display: grid; justify-items: center; gap: 1.25rem; padding-block: 5rem; text-align: center; }</style>
