<script setup>
import { ref, useId, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { reducedMotion } from '../motionPreference'
import MediaDescription from './MediaDescription.vue'
const props = defineProps({ media: { type: Object, required: true } })
const id = useId(), active = ref(0), keyboardSwitch = ref(false)
const panelElements = ref([]), panelHeight = ref(null)
let resizeObserver
function measurePanel() {
 const panel = panelElements.value[active.value]
 if (panel) panelHeight.value = panel.getBoundingClientRect().height
}
onMounted(() => {
 measurePanel()
 resizeObserver = new ResizeObserver(measurePanel)
 panelElements.value.forEach(panel => resizeObserver.observe(panel))
})
onBeforeUnmount(() => resizeObserver?.disconnect())
watch(active, async () => { await nextTick(); measurePanel() })
const panels = [
 { label: 'Lecture', x: 295, y: 300, width: 790, height: 725, caption: 'Lire, comprendre un mot et le sauvegarder en contexte.' },
 { label: 'Découverte', x: 1095, y: 300, width: 290, height: 645, caption: 'Découvrir la lecture, traduire et enregistrer ses premiers mots.' },
 { label: 'Tableau de bord', x: 1400, y: 300, width: 885, height: 640, caption: 'Retrouver les lectures, les révisions et les repères de progression.' },
 { label: 'Bibliothèque', x: 2300, y: 300, width: 635, height: 425, caption: 'Importer un contenu ou reprendre une lecture.' }
]
function cropStyle(item) { return { aspectRatio: `${item.width} / ${item.height}`, '--crop-width': props.media.width / item.width * 100 + '%', '--crop-left': -item.x / item.width * 100 + '%', '--crop-top': -item.y / item.height * 100 + '%' } }
function tabKey(event) {
 let index = active.value
 if (event.key === 'ArrowRight') index = (index + 1) % panels.length
 else if (event.key === 'ArrowLeft') index = (index + panels.length - 1) % panels.length
 else if (event.key === 'Home') index = 0
 else if (event.key === 'End') index = panels.length - 1
 else return
 event.preventDefault(); keyboardSwitch.value = true; active.value = index
 document.getElementById(`${id}-tab-${index}`)?.focus()
}
function selectPanel(index, event) { keyboardSwitch.value = event.detail === 0; active.value = index }
</script>
<template>
 <section class="flow-diagram" :class="{ 'flow-diagram--keyboard': keyboardSwitch || reducedMotion }" aria-label="Parcours détaillés de Lira">
  <div class="flow-diagram__tabs" role="tablist" aria-label="Choisir un parcours" @keydown="tabKey"><button v-for="(item, i) in panels" :key="item.label" :id="`${id}-tab-${i}`" type="button" role="tab" :aria-selected="active === i" :aria-controls="`${id}-panel-${i}`" :tabindex="active === i ? 0 : -1" @click="selectPanel(i, $event)">{{ item.label }}</button></div>
  <div class="flow-diagram__panels" :style="{ height: panelHeight === null ? undefined : `${panelHeight}px` }">
  <Transition v-for="(item, i) in panels" :key="item.label" :name="keyboardSwitch || reducedMotion ? '' : 'flow'">
  <div :ref="element => { if (element) panelElements[i] = element }" v-show="active === i" :inert="active !== i" :aria-hidden="active !== i" role="tabpanel" :id="`${id}-panel-${i}`" :aria-labelledby="`${id}-tab-${i}`" tabindex="0" class="flow-diagram__panel">
   <div class="flow-diagram__crop" :style="cropStyle(item)"><img :src="media.src" :width="media.width" :height="media.height" :alt="`Parcours Lira : ${item.label.toLowerCase()}`" :aria-describedby="media.description?.length ? `${id}-description` : undefined" loading="lazy" decoding="async"></div>
   <p>{{ item.caption }}</p>
  </div>
  </Transition>
  </div>
  <MediaDescription :media="media" :id="`${id}-description`" />
 </section>
</template>
<style scoped>
.flow-diagram { display: grid; justify-items: center; gap: 1.5rem; padding: 2rem; background: var(--surface); border-radius: 4px; }
.flow-diagram__tabs { display: flex; flex-wrap: wrap; justify-content: center; gap: .5rem; }
.flow-diagram__tabs button { min-height: 44px; padding: .65rem 1rem; border: 1px solid #d8d8d8; border-radius: 999px; background: #fff; color: #111; transition: color 180ms ease-out, background-color 180ms ease-out, border-color 180ms ease-out; }
.flow-diagram--keyboard .flow-diagram__tabs button { transition: none; }
.flow-diagram__tabs button[aria-selected="true"] { background: #111; color: #fff; border-color: #111; }
.flow-diagram__panels { display: grid; width: 100%; overflow: clip; transition: height 220ms cubic-bezier(.23, 1, .32, 1); }
.flow-diagram--keyboard .flow-diagram__panels { transition: none; }
@media (prefers-reduced-motion: reduce) { .flow-diagram__panels { transition: none; } }
.flow-diagram__panel { grid-area: 1 / 1; align-self: start; display: grid; justify-items: center; gap: 1.5rem; width: 100%; }
.flow-diagram__panel p { text-align: center; color: var(--secondary); }
.flow-diagram__crop { position: relative; width: 100%; max-width: min(90%, 710px); max-height: none; overflow: hidden; }
.flow-diagram__crop img { position: absolute; width: var(--crop-width); max-width: none; height: auto; left: var(--crop-left); top: var(--crop-top); }
.flow-diagram__panel:nth-child(2) .flow-diagram__crop { max-width: min(90%, 288px); }
.flow-enter-active, .flow-leave-active { transition: opacity 160ms ease-out, transform 160ms ease-out; }
.flow-enter-from { opacity: 0; transform: translateY(4px); }
.flow-leave-to { opacity: 0; transform: translateY(-4px); }
@media (hover: hover) and (pointer: fine) {
 .flow-diagram__tabs button:not([aria-selected="true"]):hover { background: #ddd; border-color: #666; }
}
@media (max-width: 600px) { .flow-diagram { padding: 1rem; } }
</style>
