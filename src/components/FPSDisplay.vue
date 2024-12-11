<template>
  <div></div>
</template>

<script setup>
import { onMounted } from 'vue';
import Stats from 'stats.js';

onMounted(() => {
  const stats = new Stats();
  stats.showPanel(0);
  document.body.appendChild(stats.dom);

  function animate() {
    stats.begin();
    stats.end();
    requestAnimationFrame(animate);
  }
  animate();
});
</script>