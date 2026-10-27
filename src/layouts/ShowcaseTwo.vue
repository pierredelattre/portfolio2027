<template><section class="showcase__two"><div v-if="$slots.text" class="intro"><slot name="text" /></div><div class="figures"><slot /></div></section></template>
<style scoped>
.showcase__two { width: 100%; display: flex; flex-direction: column; gap: 4rem; --media-size: 320px; --figure-padding: 4rem 2rem; }
.intro { --copy-width: 550px; display: flex; justify-content: center; }
.figures { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 2rem; }
@media (max-width: 1023px) { .figures { grid-template-columns: minmax(0,1fr); } }
@media (min-width: 1024px) {
 :deep(.showcase__media img) { transform: scale(.75); transform-origin: center; }
}
</style>
