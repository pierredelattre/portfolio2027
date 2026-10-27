<template><ol class="step-cards"><slot /></ol></template>

<style scoped>
.step-cards { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 2rem; list-style: none; padding: 0; margin: 0; }
@media (max-width: 1280px) { .step-cards { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.5rem; } }
@media (max-width: 600px) { .step-cards { grid-template-columns: minmax(0, 1fr); } }
</style>
