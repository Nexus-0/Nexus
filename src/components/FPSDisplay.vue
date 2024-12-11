<template>
    <div></div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  import Stats from 'stats.js';
  
  onMounted(() => {
    const stats = new Stats();
    stats.showPanel(0);  // 0: FPS, 1: MS, 2: memory
    document.body.appendChild(stats.dom);
  });
  </script>
  