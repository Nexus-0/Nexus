<template>
  <div id="app">
    <Scene />
    <ControlsPanel />
    <FPSDisplay />
  </div>
</template>

<script setup>
import Scene from './components/Scene.vue';
import ControlsPanel from './components/ControlsPanel.vue';
import FPSDisplay from './components/FPSDisplay.vue';
</script>
