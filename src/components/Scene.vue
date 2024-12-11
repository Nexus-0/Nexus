<template>
  <div ref="canvasContainer" class="canvas-container"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { initPhysicsWorld } from '../physics/physicsWorld';
import { createPhysicsObject } from '../physics/physicsObject';
import Ammo from 'ammo.js';

const canvasContainer = ref(null);
let physicsWorld;
const objects = [];

onMounted(() => {
  // 初始化 Three.js 场景
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(5, 5, 10);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  canvasContainer.value.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // 添加光源
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 10, 10);
  scene.add(light);

  // 初始化物理世界
  physicsWorld = initPhysicsWorld();

  // 创建地面
  const ground = createPhysicsObject('box', {
    mass: 0,
    size: [20, 1, 20],
    position: [0, -0.5, 0],
    color: 0x888888
  }, physicsWorld);
  scene.add(ground.mesh);

  // 创建动态物体（如球体）
  const sphere = createPhysicsObject('sphere', {
    mass: 1,
    size: [1],
    position: [0, 5, 0],
    color: 0xff0000
  }, physicsWorld);
  scene.add(sphere.mesh);
  objects.push(sphere);
    // 动态窗口大小调整
    window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // 更新物理世界
  const clock = new THREE.Clock();
  function updatePhysics(deltaTime) {
    physicsWorld.stepSimulation(deltaTime, 10);

    // 更新物体位置
    objects.forEach(({ mesh, body }) => {
      const transform = new Ammo.btTransform();
      body.getMotionState().getWorldTransform(transform);
      const origin = transform.getOrigin();
      mesh.position.set(origin.x(), origin.y(), origin.z());
    });
  }

  // 动画循环
  function animate() {
    requestAnimationFrame(animate);
    const deltaTime = clock.getDelta();
    updatePhysics(deltaTime);
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