<template>
  <div ref="canvasContainer" class="canvas-container">
    <Cube ref="cube" :position="{ x: 3, y: 2, z: 0 }" />
    <Sphere ref="sphere" :position="{ x: 3, y: 4, z: 0 }" />
    <Ground />
    <LightSource />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as THREE from 'three';
import Ammo from 'ammo.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Cube from './Cube.vue
import Sphere from './Sphere.vue';
import Ground from './Ground.vue';
import LightSource from './LightSource.vue';

const canvasContainer = ref(null);

onMounted(() => {
  // 创建 Three.js 场景
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true; 
  canvasContainer.value.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.screenSpacePanning = false;

  // 获取 Cube 和 Sphere 实例
  const cubeMesh = ref(null);
  const sphereMesh = ref(null);

  // 创建物理体和几何体
  const createPhysicsObject = (geometryType, materialType, options = {}) => {
    const { mass = 1, position = { x: 0, y: 0, z: 0 }, shapeType = 'box', size = [1, 1, 1] } = options;

    let geometry, material, shape;
    
    if (geometryType === 'sphere') {
      geometry = new THREE.SphereGeometry(...size);
    } else if (geometryType === 'box') {
      geometry = new THREE.BoxGeometry(...size);
    }

    if (materialType === 'standard') {
      material = new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.5, metalness: 0.5 });
    } else if (materialType === 'basic') {
      material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.set(position.x, position.y, position.z);
    scene.add(mesh);

    if (shapeType === 'sphere') {
      shape = new Ammo.btSphereShape(size[0]);
    } else if (shapeType === 'box') {
      shape = new Ammo.btBoxShape(new Ammo.btVector3(size[0] / 2, size[1] / 2, size[2] / 2));
    }

    const transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));

    const motionState = new Ammo.btDefaultMotionState(transform);
    const localInertia = new Ammo.btVector3(0, 0, 0);
    shape.calculateLocalInertia(mass, localInertia);

    const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
    const body = new Ammo.btRigidBody(rbInfo);

    return { mesh, body };
  };

  // 实例化 Cube 和 Sphere，并将它们的物理体添加到世界中
  const cube = createPhysicsObject('box', 'standard', { mass: 1, position: { x: 3, y: 2, z: 0 }, shapeType: 'box', size: [1, 1, 1] });
  const sphere = createPhysicsObject('sphere', 'standard', { mass: 1, position: { x: 3, y: 4, z: 0 }, shapeType: 'sphere', size: [1, 32, 32] });

  // 创建地面物理体
  const ground = createPhysicsObject('box', 'standard', { mass: 0, position: { x: 0, y: -0.5, z: 0 }, shapeType: 'box', size: [50, 0.1, 50] });

  scene.add(cube.mesh);
  scene.add(sphere.mesh);
  scene.add(ground.mesh);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();
});
</script>

<style scoped>
.canvas-container {
  width: 100vw;
  height: 100vh;
  margin: 0;
}
</style>
