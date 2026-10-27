<script setup>
import BaseButton from './BaseButton.vue'
import ProjectPreview from './ProjectPreview.vue'
import { captureProjectPreview } from '../animations/sharedProjectTransition'
defineProps({ project: Object })
</script>
<template><article class="project" @click.capture="captureProjectPreview($event, project.route)"><div class="project__header"><div class="project__information"><div class="name"><span>Projet</span><h2>{{ project.name }}</h2></div><div class="services"><span>Prestations</span><p>{{ project.services.join(', ') }}</p></div><div class="domain"><span>Domaine</span><p>{{ project.domain }}</p></div><div class="year"><span>Année</span><p>{{ project.year || 'À confirmer' }}</p></div></div><BaseButton :to="project.route" variant="secondary">Voir le projet<span class="sr"> {{ project.name }}</span></BaseButton></div><div class="project__content" :class="`project__content--${project.layout}`"><ProjectPreview v-for="(preview, index) in project.previews" :fill="index === 0" :key="preview.key" :preview="preview" :to="project.route" :name="project.name" /></div></article></template>
<style scoped>
.project { width: 100%; min-width: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
.project__header { grid-column: 1 / -1; display: grid; grid-template-columns: subgrid; align-items: start;
 & > .button { grid-column: 3; grid-row: 1; justify-self: end; }
}
.project__information { grid-column: 1 / 3; grid-row: 1; display: flex; gap: 2rem;
 & > div { min-width: 0; display: flex; flex-direction: column; gap: .25rem; }
 & span { color: var(--secondary); font-size: .75rem; }
 & h2, & p { overflow-wrap: anywhere; }
 & .name, & .domain { width: 280px; flex-shrink: 1; }
 & .services { width: 100%; flex-shrink: 1; }
 & .year { flex: 0 0 auto; }
}
.project__content { grid-column: 1 / -1; display: grid; grid-template-columns: subgrid; gap: 1rem;
 &.project__content--wide-left > :first-child { grid-column: span 2; }
 &.project__content--wide-right > :last-child { grid-column: span 2; }
}
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
@media (max-width: 1023px) {
 .project { grid-template-columns: repeat(2, minmax(0,1fr)); }
 .project__information { grid-column: 1; & .services, & .domain { display: none; } & .name { width: auto; } }
 .project__header > .button { grid-column: 2; }
 .project__content.project__content--wide-left > :first-child, .project__content.project__content--wide-right > :last-child { grid-column: auto; }
}
@media (max-width: 600px) {
 .project { grid-template-columns: minmax(0,1fr); }
 .project__header { grid-template-columns: minmax(0,1fr) auto; gap: 1rem; }
 .project__information { flex-direction: row; gap: 1rem; align-items: start; & .name { width: auto; max-width: 100%; flex: 1 1 auto; } & .year { width: 3rem; max-width: 3rem; flex: 0 0 3rem; } }
}
</style>
