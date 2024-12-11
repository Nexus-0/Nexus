<template>
    <mesh :geometry="geometry" :material="material" :position="position" />
  </template>
  
  <script setup>
  import * as THREE from 'three';
  
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
  const position = { x: 3, y: 4, z: 0 };
  </script>
  