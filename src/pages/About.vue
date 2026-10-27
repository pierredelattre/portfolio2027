<script setup>
import PageContainer from '../components/PageContainer.vue'
import OpquastCertificateLink from '../components/OpquastCertificateLink.vue'
</script>

<template>
  <PageContainer as="main" id="contenu" tabindex="-1" class="about">
    <article class="about__content" aria-labelledby="about-title">
      <div class="about__heading">
        <h1 id="about-title">À propos</h1>
      </div>
      <div class="about__text">
        <p>Je suis product designer, avec un parcours en intégration web. Je conçois des interfaces en tenant compte de leur réalisation technique, ce qui me permet de faire le lien entre design et développement.</p>
        <p>Chez Tikamoon, j’ai travaillé sur les parcours e-commerce : fiches produit, compte client, sélection des variantes. J’ai également contribué aux premiers composants du design system et à l’amélioration de l’accessibilité. En freelance, j’ai accompagné des projets de sites vitrines et e-commerce, de l’analyse des besoins au prototypage et à l’intégration.</p>
        <p>Mon approche associe recherche utilisateur, conception d’interfaces et attention aux détails. J’aime comprendre ce qui bloque dans un parcours, tester des solutions et affiner les interactions. <OpquastCertificateLink />, je veille à la qualité web et à l’accessibilité dès la conception.</p>
        <p>J’intègre l’IA à mon travail pour explorer des pistes, structurer mes réflexions et passer plus rapidement d’une idée à un prototype testable. Je m’en sers aussi pour le code et la documentation, en gardant la main sur les choix de design et la vérification du résultat.</p>
      </div>
    </article>
  </PageContainer>
</template>

<style scoped>
.about { padding-block: var(--rhythm); }
.about__content { width: 100%; max-width: 65ch; margin-inline: auto; font-size: 1rem; }
.about__heading { text-align: center; margin-bottom: 2.5rem; }
.about__heading > h1 { color: var(--secondary); font-size: .875rem; }
.about__text { display: grid; gap: 1.5rem; }
.about__text > p { line-height: 1.7; overflow-wrap: break-word; }
@media (max-width: 1023px) {
  .about__content { margin-inline: 0; }
  .about__heading { text-align: left; }
}


@media (max-width: 600px) { .about { padding-block: 8rem; } }
</style>
