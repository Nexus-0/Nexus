<template>
  <div id="controls-panel"></div>
</template>

<script setup>
import { onMounted } from 'vue';
import * as dat from 'dat.gui';

onMounted(() => {
  const gui = new dat.GUI();
  gui.add({ gravity: -1.68 }, 'gravity', -20, 0).onChange((value) => {
    physicsWorld.setGravity(new Ammo.btVector3(0, value, 0));
  });
});
</script>

<style scoped>
#controls-panel {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>