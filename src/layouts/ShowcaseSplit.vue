<script setup>defineProps({ inverse: Boolean })</script>
<template><section class="showcase__one_two" :class="{ inverse }"><div class="col text"><slot name="text" /></div><div class="col media"><slot /></div></section></template>
<style scoped>
.showcase__one_two { width: 100%; display: flex; gap: 2rem; --media-size: 320px; --figure-padding: 2rem;
 & .col { display: flex; flex-direction: column; justify-content: center; align-items: center; width: 50%; min-width: 0; }
 &.inverse { flex-direction: row-reverse; }
}
@media (max-width: 1023px) { .showcase__one_two, .showcase__one_two.inverse { flex-direction: column; & .col { width: 100%; } } }
</style>
