<template>
    <mesh :geometry="geometry" :material="material" :position="position" />
  </template>
  
  <script setup>
  import * as THREE from 'three';
  
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const position = { x: 3, y: 2, z: 0 };
  </script>
  