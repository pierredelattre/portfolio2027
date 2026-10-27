<template><section class="showcase__scroll"><div class="images"><slot /></div><div class="content"><slot name="text" /></div></section></template>
<style scoped>
.showcase__scroll { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 2rem; align-items: start; width: 100%; --media-size: 320px; --figure-padding: 2rem; --figure-gap: .25rem; }
.images { display: grid; gap: 2rem; }
.content { position: sticky; top: 0; display: flex; justify-content: center; padding: 6rem var(--gutter) 6rem 0; }
@media (min-width: 1024px) and (max-width: 1280px) { .content { padding: 4rem 0; } }
@media (max-width: 1023px) { .showcase__scroll { display: flex; flex-direction: column-reverse; } .content { position: static; padding: 0; } .images,.content { width: 100%; } }
@media (min-width: 1024px) {
 :deep(.showcase__media img) { transform: scale(.75); transform-origin: center; }
}
</style>
