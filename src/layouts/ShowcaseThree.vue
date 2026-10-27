<template><div class="showcase__three"><div v-if="$slots.text" class="intro"><slot name="text" /></div><div class="figures"><slot /></div></div></template>
<style scoped>
.showcase__three { display: flex; flex-direction: column; gap: 4rem; width: 100%; --media-size: 320px; --figure-padding: 2rem; }
.intro { --copy-width: 550px; display: flex; justify-content: center; }
.figures { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 2rem; }
@media (min-width: 1024px) and (max-width: 1280px) { .showcase__three { --media-size: 220px; } .figures { gap: 1rem; } }
@media (max-width: 1023px) { .figures { grid-template-columns: minmax(0,1fr); } }
</style>
