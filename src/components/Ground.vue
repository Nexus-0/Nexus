<template>
    <mesh :geometry="geometry" :material="material" :position="position" />
  </template>
  
  <script setup>
  import * as THREE from 'three';
  
  const geometry = new THREE.PlaneGeometry(100, 100);
  const material = new THREE.MeshStandardMaterial({ color: 0x777777, side: THREE.DoubleSide });
  const position = { x: 0, y: -0.5, z: 0 };
  </script>
  