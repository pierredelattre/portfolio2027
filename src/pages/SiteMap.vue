<script setup>
import { RouterLink } from 'vue-router'
import PageContainer from '../components/PageContainer.vue'

const groups = [
  { title: 'Navigation', pages: [
    { to: '/', label: 'Réalisations' },
    { to: '/services', label: 'Services' },
    { to: '/a-propos', label: 'À propos' },
    { href: '#contact', label: 'Contact' }
  ] },
  { title: 'Projets', pages: [
    { to: '/projet/lira', label: 'Lira' },
    { to: '/projet/mba-formations', label: 'MBA Formations' },
    { to: '/projet/septiemeseance', label: 'Septième Séance' },
    { to: '/projet/talkie', label: 'Talkie' }
  ] },
  { title: 'Informations', pages: [
    { to: '/accessibilite', label: 'Accessibilité' },
    { to: '/plan-du-site', label: 'Plan du site' },
    { href: '/llms.txt', label: 'LLMs' }
  ] }
]
</script>

<template>
  <PageContainer as="main" id="contenu" tabindex="-1" class="site-map">
    <article aria-labelledby="site-map-title">
      <h1 id="site-map-title">Plan du site</h1>
      <nav aria-label="Toutes les pages du portfolio">
        <section v-for="(group, index) in groups" :key="group.title" class="site-map__group" :aria-labelledby="`site-map-group-${index}`">
          <h2 :id="`site-map-group-${index}`">{{ group.title }}</h2>
          <ul>
            <li v-for="page in group.pages" :key="page.to || page.href">
              <component :is="page.href ? 'a' : RouterLink" v-bind="page.href ? { href: page.href } : { to: page.to }" class="site-map__link">
                <span>{{ page.label }}</span>
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </component>
            </li>
          </ul>
        </section>
      </nav>
    </article>
  </PageContainer>
</template>

<style scoped>
.site-map { padding-block: var(--rhythm); }
article { width: 100%; max-width: 65ch; margin-inline: auto; font-size: 1rem; }
h1 { text-align: center; color: var(--secondary); font-size: .875rem; margin-bottom: 2.5rem; }
nav { display: grid; gap: 2.5rem; }
.site-map__group { display: grid; grid-template-columns: 9rem minmax(0, 1fr); gap: 2rem; border-top: 1px solid #e8e8e8; }
h2 { padding-top: 1.25rem; color: var(--secondary); font-size: .875rem; line-height: 1.5; }
ul { list-style: none; }
li + li { border-top: 1px solid #e8e8e8; }
.site-map__link { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; min-height: 56px; padding-block: 1rem; color: var(--secondary); line-height: 1.5; transition: color 250ms cubic-bezier(.77,0,.175,1); }
.site-map__link > span { overflow-wrap: anywhere; }
.site-map__link > svg { flex-shrink: 0; }
.site-map__link[aria-current="page"] { color: var(--primary); }
.site-map__link:focus-visible { color: var(--primary); }
@media (hover: hover) and (pointer: fine) { .site-map__link:hover { color: var(--primary); } }
@media (max-width: 1023px) { article { margin-inline: 0; } h1 { text-align: left; } }
@media (min-width: 601px) {
  .site-map__group { align-items: first baseline; }
  h2 { padding-top: 1rem; }
}
@media (max-width: 600px) {
  .site-map { padding-block: 8rem; }
  .site-map__group { grid-template-columns: minmax(0, 1fr); gap: .5rem; }
}
@media (prefers-reduced-motion: reduce) { .site-map__link { transition: none; } }
</style>
