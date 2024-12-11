<template>
    <div></div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  import * as dat from 'dat.gui';  // 导入 dat.GUI
  
  const controlsObj = {
    cubeColor: "#ff0000",
    cubeSize: 1,
    cubePositionX: 1,
    cubePositionY: 1,
    cubePositionZ: 1,
  
    sphereColor: "#0000ff",
    sphereSize: 1,
    spherePositionX: 0,
    spherePositionY: 0,
    spherePositionZ: 0,
  };
  
  const lightControls = {
    pointLightIntensity: 200,
    lightX: 5,
    lightY: 5,
    lightZ: 5,
  };
  
  onMounted(() => {
    const gui = new dat.GUI();
    
    gui.addColor(controlsObj, 'cubeColor').name('Cube Color');
    gui.add(controlsObj, 'cubeSize', 0.1, 3).name('Cube Size');
    gui.add(controlsObj, 'cubePositionX', -10, 10).name('Cube Position X');
    gui.add(controlsObj, 'cubePositionY', -10, 10).name('Cube Position Y');
    gui.add(controlsObj, 'cubePositionZ', -10, 10).name('Cube Position Z');
  
    gui.addColor(controlsObj, 'sphereColor').name('Sphere Color');
    gui.add(controlsObj, 'sphereSize', 0.1, 3).name('Sphere Size');
    gui.add(controlsObj, 'spherePositionX', -10, 10).name('Sphere Position X');
    gui.add(controlsObj, 'spherePositionY', -10, 10).name('Sphere Position Y');
    gui.add(controlsObj, 'spherePositionZ', -10, 10).name('Sphere Position Z');
    
    gui.add(lightControls, 'pointLightIntensity', 0, 1000).name('Light Intensity');
    gui.add(lightControls, 'lightX', -10, 10).name('Light Position X');
    gui.add(lightControls, 'lightY', -10, 10).name('Light Position Y');
    gui.add(lightControls, 'lightZ', -10, 10).name('Light Position Z');
  });
  </script>
  