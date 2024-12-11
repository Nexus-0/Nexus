<template>
  <point-light :position="position" :intensity="intensity" />
</template>

<script setup>
import * as THREE from 'three';

const position = { x: 5, y: 5, z: 5 };
const intensity = 200;
</script>
