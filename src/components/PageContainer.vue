<script setup>
defineProps({ as: { type: String, default: 'div' }, variant: { type: String, default: 'standard' } })
</script>
<template><component :is="as" class="container" :class="`container--${variant}`"><slot /></component></template>
<style scoped>
.container { width: 100%; padding-inline: var(--gutter); min-width: 0; &.container--inset { padding-inline: calc(var(--gutter) * 2); } &.container--full { padding-inline: 0; } }
@media (max-width: 1280px) { .container.container--inset { padding-inline: var(--gutter); } }
</style>
