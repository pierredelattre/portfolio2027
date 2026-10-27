<script setup>
import PageContainer from '../components/PageContainer.vue'
import ProjectRow from '../components/ProjectRow.vue'
import { projects } from '../data/projects'
</script>
<template><PageContainer as="main" id="contenu" tabindex="-1" class="home"><h1>Product Designer, je m’appuie sur mon expérience pour comprendre les enjeux produit et business et les traduire en solutions concrètes. De la création d’un produit à la refonte d’un site, je travaille les parcours et le design d’interface pour répondre aux besoins des utilisateurs comme aux objectifs du projet.</h1><div class="projects"><ProjectRow v-for="project in projects" :key="project.route" :project="project" /></div></PageContainer></template>
<style scoped>.home { display: grid; gap: var(--rhythm); padding-block: 8rem; & h1 { line-height: 1.5; max-width: 500px; } } .projects { display: grid; gap: var(--rhythm); }@media (max-width: 600px) { .home { gap: 8rem; padding-top: 8rem; } }
</style>
