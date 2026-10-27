<script setup>import EmphasizedText from './EmphasizedText.vue'
defineProps({ title: String, text: String, status: String })</script>
<template><div class="copy"><h2 v-if="title">{{ title }}</h2><p v-if="status" class="status">{{ status }}</p><p><EmphasizedText :text="text" /></p><slot /></div></template>
<style scoped>.copy { display: grid; gap: .5rem; max-width: var(--copy-width, 440px); & h2 { font-weight: 600; } & .status { color: var(--secondary); } }</style>
