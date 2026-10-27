<script setup>
import { lira, liraMedia as m } from '../data/lira'
import ProjectPageLayout from '../layouts/ProjectPageLayout.vue'
import ProjectHero from '../components/ProjectHero.vue'
import PageContainer from '../components/PageContainer.vue'
import ShowcaseFigure from '../components/ShowcaseFigure.vue'
import FlowDiagram from '../components/FlowDiagram.vue'
import SectionCopy from '../components/SectionCopy.vue'
import ShowcaseSplit from '../layouts/ShowcaseSplit.vue'
import ShowcaseScroll from '../layouts/ShowcaseScroll.vue'
import ShowcaseFullBleed from '../layouts/ShowcaseFullBleed.vue'
import ShowcaseTwo from '../layouts/ShowcaseTwo.vue'
import ShowcaseThree from '../layouts/ShowcaseThree.vue'
import ShowcaseResults from '../layouts/ShowcaseResults.vue'
import StepCards from '../components/StepCards.vue'
import StepCard from '../components/StepCard.vue'
const overview = [
 { media: m.learn, caption: 'Lectures guidées par niveau' },
 { media: m.revision[0], caption: 'Révision du vocabulaire' },
 { media: m.revision[1], caption: 'Mots croisés générés à partir du vocabulaire enregistré' }
]
const metrics = [
 { label: 'Clics Google', value: '400' },
 { label: 'Inscriptions', value: '128' },
 { label: 'Premium', value: '2' },
 { label: 'Périodes d’essai', value: '3' }
]
</script>
<template>
 <ProjectPageLayout :theme="lira.theme">
  <template #hero><ProjectHero :project="lira" :show-site-link="false" /></template>
  <PageContainer>
   <ShowcaseThree>
    <template #text><SectionCopy text="J’ai conçu l’expérience produit de Lira, de la recherche aux interfaces finales. Le travail a porté sur la sélection de contenus, la lecture, la sauvegarde de vocabulaire en contexte et les révisions personnalisées. L’objectif est de garder le mot lié à sa phrase d’origine, jusque dans les cartes de révision et les mots croisés." /></template>
    <ShowcaseFigure v-for="item in overview" :key="item.media.src" :media="item.media" :caption="item.caption" />
   </ShowcaseThree>
  </PageContainer>
  <PageContainer variant="inset">
   <ShowcaseSplit>
    <template #text><SectionCopy title="Montrer la valeur avant l’inscription" text="Choisir une langue, découvrir un extrait, puis interagir avec un mot : la découverte du produit précède la création du compte. L’objectif est de faire vivre la boucle de lecture avant de demander une inscription." /></template>
    <ShowcaseFigure :media="m.onboarding" caption="Les premières interactions avec Lira" />
   </ShowcaseSplit>
  </PageContainer>
  <PageContainer variant="inset">
   <ShowcaseSplit inverse>
    <template #text><SectionCopy title="Vérifier la compréhension après lecture" text="Les lectures guidées se prolongent par des questions de compréhension et de mise en situation. Après validation, chaque réponse s’accompagne d’une explication pour relier le choix aux informations du texte." /></template>
    <ShowcaseFigure :media="m.quiz" caption="Quiz de compréhension et explications après lecture" />
   </ShowcaseSplit>
  </PageContainer>
  <PageContainer>
   <ShowcaseSplit>
    <template #text><SectionCopy title="Préserver le fil de lecture" text="Un mot inconnu peut interrompre le rythme de lecture. Le panneau de compréhension permet de consulter sa définition, puis de le sauvegarder avec sa phrase source. Sur mobile, le panneau inférieur laisse le texte accessible." /></template>
    <ShowcaseFigure :media="m.reader" caption="Traduire un mot ou une expression dans son contexte" />
   </ShowcaseSplit>
  </PageContainer>
  <PageContainer>
   <ShowcaseScroll>
    <template #text><SectionCopy title="Ce qui a orienté le produit" text="Avant le lancement, la recherche exploratoire s’est appuyée sur Reddit (languagelearning, Anki, duolingo, busuu), les forums LingQ, les avis App Store et les retours vidéo. Deux signaux ont orienté le produit : le plateau intermédiaire et la friction de création des cartes de vocabulaire. La lecture, la sauvegarde et la révision ont été réunies dans un même parcours." /></template>
    <ShowcaseFigure v-for="(persona, i) in m.personas" :key="persona.src" :media="persona" :caption="`Profil exploratoire ${i + 1}`" />
   </ShowcaseScroll>
  </PageContainer>
  <PageContainer>
   <section class="flow-section">
    <SectionCopy title="Relier lecture, vocabulaire et révision" text="Les parcours relient la découverte d’un texte, la sauvegarde des mots et leur révision. Ce schéma rassemble les étapes et les points de passage de l’expérience." />
    <FlowDiagram :media="m.flow" />
   </section>
  </PageContainer>
  <ShowcaseFullBleed label="Lire, comprendre, retenir."><ShowcaseFigure :media="m.banner" bare /></ShowcaseFullBleed>
  <PageContainer variant="inset">
   <ShowcaseSplit inverse>
    <template #text><SectionCopy title="Garder le contexte pour réviser" text="Les mots sauvegardés restent associés à la phrase dans laquelle ils ont été rencontrés. Ce contexte accompagne les révisions avec FSRS (Free Spaced Repetition Scheduler), les quiz après lecture et les mots croisés construits à partir du vocabulaire personnel." /></template>
    <ShowcaseFigure :media="m.context" caption="Vocabulaire sauvegardé avec les phrases source" />
   </ShowcaseSplit>
  </PageContainer>
  <PageContainer>
   <ShowcaseTwo>
    <template #text><SectionCopy title="Lire à sa façon" text="La sélection de contenus guide les premières lectures. L’import d’URL, EPUB, PDF, HTML ou texte permet ensuite de travailler sur ses propres documents. La bibliothèque regroupe ces lectures et permet de retrouver sa progression. Le contenu importé peut être ajusté avant sa validation." /></template>
    <ShowcaseFigure :media="m.library" caption="Explorer la bibliothèque et reprendre ses lectures" />
    <ShowcaseFigure :media="m.import" caption="Importer et préparer ses propres textes" />
   </ShowcaseTwo>
  </PageContainer>
  <PageContainer variant="inset">
   <ShowcaseSplit>
    <template #text><SectionCopy title="Rendre la progression visible" text="Les statistiques réunissent le vocabulaire sauvegardé, les révisions et les niveaux de maîtrise. La courbe de progression et la répartition des mots donnent aux apprenants des repères pour suivre leur apprentissage." /></template>
    <ShowcaseFigure :media="m.statistics" caption="Suivi de la progression dans Lira" />
   </ShowcaseSplit>
  </PageContainer>
  <PageContainer>
   <ShowcaseResults rolling :metrics="metrics" period="Résultats obtenus au mois de septembre 2026">
    <SectionCopy title="Résultats" text="Créé en mars 2026, Lira a démarré son acquisition et l’analyse des usages en août 2026. L’acquisition repose sur le SEO organique et le GEO : la visibilité dans les réponses des moteurs d’IA apporte également du trafic. Ces premiers résultats permettent de suivre la découverte du produit, l’inscription et les premiers usages payants." />
   </ShowcaseResults>
  </PageContainer>
  <PageContainer variant="inset">
   <section class="next-steps">
    <SectionCopy title="Prochaines étapes" text="Les données recueillies via GA4, PostHog et les questionnaires utilisateurs donnent des axes pour poursuivre l’évolution de Lira. Elles permettent aussi d’explorer d’autres pistes, en fonction des besoins et des opportunités qui se dessinent." />
    <StepCards>
     <StepCard number="01" title="Repenser le produit dans son ensemble" text="Revoir la promesse, les fonctionnalités et les parcours à partir des usages observés et des retours utilisateurs." />
     <StepCard number="02" title="Refondre les homepage & landings" text="La homepage sert aujourd’hui surtout aux tests front, tandis que le trafic arrive principalement sur les landing pages. L’enjeu est de clarifier le rôle de la homepage et de revoir l’architecture des landings pour mieux guider les visiteurs vers le produit." />
     <StepCard number="03" title="Explorer une application ?" text="Évaluer l’intérêt d’une application dédiée, selon les habitudes de lecture et les besoins exprimés." />
     <StepCard number="04" title="Explorer un autre produit" variant="outline" text="Les données semblent faire émerger des besoins plus ciblés, ouvrant la piste d’un produit davantage guidé, avec un accompagnement plus structuré. Cette opportunité reste à valider." />
    </StepCards>
   </section>
  </PageContainer>
 </ProjectPageLayout>
</template>
<style scoped>
.flow-section { display: grid; gap: 4rem; }
.flow-section > .copy { margin-inline: auto; }
.next-steps { display: grid; gap: 4rem; }
.next-steps > .copy { margin-inline: auto; --copy-width: 550px; }
</style>
