<script setup>
defineProps({ media: Object, id: String })
</script>
<template><div v-if="media?.description?.length" :id="id" class="sr-only"><p v-for="paragraph in media.description" :key="paragraph">{{ paragraph }}</p></div></template>
