<script setup>
import ProjectPageLayout from '../layouts/ProjectPageLayout.vue'
import ProjectHero from '../components/ProjectHero.vue'
import PageContainer from '../components/PageContainer.vue'
import ShowcaseFigure from '../components/ShowcaseFigure.vue'
import SectionCopy from '../components/SectionCopy.vue'
import ShowcaseThree from '../layouts/ShowcaseThree.vue'
import ShowcaseSplit from '../layouts/ShowcaseSplit.vue'
import ShowcaseTwo from '../layouts/ShowcaseTwo.vue'
import ShowcaseScroll from '../layouts/ShowcaseScroll.vue'
import ShowcaseFullBleed from '../layouts/ShowcaseFullBleed.vue'
import ShowcaseResults from '../layouts/ShowcaseResults.vue'
const layouts = { three: ShowcaseThree, two: ShowcaseTwo, split: ShowcaseSplit, scroll: ShowcaseScroll }
defineProps({ project: { type: Object, required: true } })
</script>
<template>
 <ProjectPageLayout :theme="project.theme">
  <template #hero><ProjectHero :project="project" /></template>
  <PageContainer>
   <ShowcaseThree>
    <template #text><SectionCopy :title="project.intro.title" :text="project.intro.text" /></template>
    <ShowcaseFigure v-for="item in project.intro.figures" :key="item.media.src" :media="item.media" :caption="item.caption" />
   </ShowcaseThree>
  </PageContainer>
  <PageContainer v-for="(section, index) in project.sections" :key="section.title" variant="inset">
   <ShowcaseSplit :inverse="index === 1">
    <template #text><SectionCopy :title="section.title" :text="section.text" /></template>
    <ShowcaseFigure :media="section.media" :caption="section.caption" />
   </ShowcaseSplit>
  </PageContainer>
  <template v-for="section in project.remaining" :key="section.title">
   <template v-if="section.layout === 'full'">
    <PageContainer><section class="case-copy"><SectionCopy :title="section.title" :text="section.text" /></section></PageContainer>
    <ShowcaseFullBleed :label="section.label"><ShowcaseFigure :media="section.figures[0].media" :caption="section.figures[0].caption" bare /></ShowcaseFullBleed>
   </template>
   <PageContainer v-else :variant="section.layout === 'split' ? 'inset' : undefined">
    <section v-if="section.layout === 'text'" class="case-copy"><SectionCopy :title="section.title" :text="section.text" /></section>
    <ShowcaseResults v-else-if="section.layout === 'results'" :metrics="section.metrics"><SectionCopy :title="section.title" :text="section.text" /></ShowcaseResults>
    <component v-else :is="layouts[section.layout]" :inverse="section.inverse">
     <template #text><SectionCopy :title="section.title" :text="section.text" /></template>
     <ShowcaseFigure v-for="item in section.figures" :key="item.caption" :media="item.media" :caption="item.caption" />
    </component>
   </PageContainer>
  </template>
 </ProjectPageLayout>
</template>

<style scoped>
.case-copy { display: flex; justify-content: center; --copy-width: 550px; }
</style>
