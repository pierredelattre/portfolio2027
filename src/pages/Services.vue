<script setup>
import PageContainer from '../components/PageContainer.vue'
import OpquastCertificateLink from '../components/OpquastCertificateLink.vue'

const services = [
  {
    title: 'Design',
    tools: 'Figma, Adobe et outils AI-driven',
    description: 'Je conçois des interfaces à partir de vos objectifs et des besoins de vos utilisateurs. Du premier parcours au prototype, je vous aide à structurer le contenu et à rendre chaque interaction claire.',
    points: ['Recherche utilisateur et analyse des parcours', 'Arborescence, wireframes et prototypes', 'Design d’interfaces web et mobile', 'Composants et design system']
  },
  {
    title: 'Intégration',
    description: 'Je transforme les maquettes en interfaces web, avec une attention particulière aux détails, aux interactions et au comportement sur chaque écran. Mon parcours en intégration me permet de suivre le design jusque dans sa réalisation.',
    points: ['Intégration fidèle aux maquettes', 'Adaptation mobile, tablette et desktop', 'Animations et micro-interactions', 'HTML sémantique et performance web', 'Versionnement avec Git et collaboration sur GitHub', 'Bonnes pratiques SEO et GEO : contenus accessibles, métadonnées et données structurées']
  },
  {
    title: 'CMS',
    tools: 'Wordpress, Shopify & autres CMS',
    description: 'Je crée des sites que vous pouvez faire vivre au quotidien. Les pages et les contenus sont organisés pour que vous puissiez les mettre à jour facilement, tout en gardant une présentation cohérente.',
    points: ['Sites vitrines et e-commerce', 'Structure des pages et des contenus', 'Composants et modèles réutilisables', 'Prise en main et accompagnement']
  },
  {
    title: 'Outils IA',
    tools: 'Claude Code, Codex',
    description: 'Je m’appuie sur l’IA pour passer plus rapidement d’une idée à un prototype testable. Je peux aussi vous aider à concevoir divers outils sur mesure, à partir d’un besoin précis.',
    points: ['Prototypes pour tester une idée', 'Interfaces de formation', 'Back-offices de gestion de sites', 'Outils sur mesure pour vos usages']
  },
  {
    title: 'Accessibilité et qualité web',
    certificate: true,
    description: ', j’intègre les bonnes pratiques de qualité web dès la conception et l’intégration. Je m’appuie sur les critères du RGAA pour repérer les obstacles et améliorer les parcours.',
    points: ['Navigation au clavier et focus visibles', 'Contrastes, lisibilité et structure des contenus', 'Formulaires, libellés et alternatives aux médias', 'Vérification et correction des points d’accessibilité']
  }
]
</script>

<template>
  <PageContainer as="main" id="contenu" tabindex="-1" class="services">
    <article class="services__content" aria-labelledby="services-title">
      <div class="services__heading">
        <h1 id="services-title">Design &amp; intégration</h1>
      </div>
      <p class="services__intro">Je vous accompagne dans la conception et la réalisation de sites et de produits numériques. Selon votre projet, j’interviens sur une étape précise ou de la première idée à la mise en ligne, en associant design, intégration et outils adaptés à vos besoins.</p>
      <div class="services__list">
        <section v-for="(service, index) in services" :key="service.title" class="service" :aria-labelledby="`service-${index}`">
          <h2 :id="`service-${index}`">{{ service.title }}</h2>
          <p v-if="service.tools" class="service__tools">{{ service.tools }}</p>
          <p><OpquastCertificateLink v-if="service.certificate" />{{ service.description }}</p>
          <ul>
            <li v-for="point in service.points" :key="point">{{ point }}</li>
          </ul>
        </section>
      </div>
    </article>
  </PageContainer>
</template>

<style scoped>
.services { padding-block: var(--rhythm); }
.services__content { width: 100%; max-width: 65ch; margin-inline: auto; font-size: 1rem; }
.services__heading { text-align: center; margin-bottom: 2.5rem; }
.services__heading > h1 { color: var(--secondary); font-size: .875rem; }
.services__intro, .service > p { line-height: 1.7; overflow-wrap: break-word; }
.services__list { display: grid; gap: 2.5rem; margin-top: 2.5rem; }
.service { padding-top: 2rem; border-top: 1px solid #e8e8e8; }
.service > h2 { margin-bottom: 1rem; font-weight: 600; }
.service > .service__tools { color: var(--secondary); font-size: .875rem; margin-top: -.5rem; margin-bottom: 1rem; }
.service > ul { display: grid; gap: .5rem; margin-top: 1rem; padding-left: 1.25rem; }
.service li { padding-left: .25rem; line-height: 1.7; overflow-wrap: break-word; }
@media (max-width: 1023px) {
  .services__content { margin-inline: 0; }
  .services__heading { text-align: left; }
}


@media (max-width: 600px) { .services { padding-block: 8rem; } }
</style>
