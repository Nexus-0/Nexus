<template>
  <div id="app">
    <div ref="canvasContainer" class="canvas-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as THREE from 'three';
import Ammo from 'ammo.js';  
import * as dat from 'dat.gui'; 
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'stats.js';  // 导入 stats.js

const canvasContainer = ref(null);

onMounted(() => {
  // 初始化 stats.js
  const stats = new Stats();
  stats.showPanel(0); // 0: FPS, 1: MS, 2: memory
  document.body.appendChild(stats.dom);

  // 初始化物理世界
  const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
  const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
  const broadphase = new Ammo.btDbvtBroadphase();
  const solver = new Ammo.btSequentialImpulseConstraintSolver();
  const physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);

  // 设置重力
  physicsWorld.setGravity(new Ammo.btVector3(0, -9.81, 0));

  // 创建 Three.js 场景
  const scene = new THREE.Scene();

  // 创建相机
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // 创建渲染器
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  const pixelRatio = window.devicePixelRatio || 1; 
  renderer.setPixelRatio(pixelRatio); // 适配高分辨率屏幕
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true; // 开启阴影映射
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
  canvasContainer.value.appendChild(renderer.domElement);

  // 创建 OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // 开启阻尼
  controls.dampingFactor = 0.25; // 设置阻尼系数
  controls.screenSpacePanning = false; // 禁用屏幕空间平移


  // 封装创建物理体和几何体的函数
  function createPhysicsObject(geometryType, materialType, options = {}) {
    const { mass = 1, position = { x: 0, y: 0, z: 0 }, shapeType = 'box', size = [1, 1, 1] } = options;

    let geometry, material, shape;
    
    // 创建 Three.js 几何体和材质
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

    // 创建物理体
    if (shapeType === 'sphere') {
      shape = new Ammo.btSphereShape(size[0]);  // 半径
    } else if (shapeType === 'box') {
      shape = new Ammo.btBoxShape(new Ammo.btVector3(size[0] / 2, size[1] / 2, size[2] / 2));  // 立方体尺寸
    }

    const transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));

    const motionState = new Ammo.btDefaultMotionState(transform);
    const localInertia = new Ammo.btVector3(0, 0, 0);
    shape.calculateLocalInertia(mass, localInertia);

    const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
    const body = new Ammo.btRigidBody(rbInfo);

    // 将物理体添加到物理世界
    physicsWorld.addRigidBody(body);

    return { mesh, body };
  }
  const cube = createPhysicsObject('box', 'standard', { mass: 1, position: { x: 3, y: 2, z: 0 }, shapeType: 'box', size: [1, 1, 1] });
  const sphere = createPhysicsObject('sphere', 'standard', { mass: 1, position: { x: 3, y: 4, z: 0 }, shapeType: 'sphere', size: [1, 32, 32] });



  // 创建地面
  const groundGeometry = new THREE.PlaneGeometry(100, 100); // 使用 PlaneGeometry 创建一个平面
  const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x777777, side: THREE.DoubleSide });
  
  const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
  groundMesh.rotation.x = Math.PI / 2; // 旋转地面，使它平放
  groundMesh.receiveShadow = true; // 地面接收阴影
  scene.add(groundMesh);

  // 创建一个点光源
  const pointLight = new THREE.PointLight(0xffffff, 1, 100);  // 颜色，强度，距离
  pointLight.position.set(5, 5, 5);  // 设置光源的位置
  pointLight.castShadow = true; // 点光源投射阴影
  scene.add(pointLight);

  // 修改光照强度
  pointLight.intensity = 200;



  // 创建地面物理体
  const groundShape = new Ammo.btBoxShape(new Ammo.btVector3(50, 0.1, 50)); // 创建一个大的立方体作为地面
  const groundTransform = new Ammo.btTransform();
  groundTransform.setIdentity();
  groundTransform.setOrigin(new Ammo.btVector3(0, -0.1, 0)); // 将地面放置在 Y=-0.5 的位置

  const groundMotionState = new Ammo.btDefaultMotionState(groundTransform);
  const groundLocalInertia = new Ammo.btVector3(0, 0, 0);
  groundShape.calculateLocalInertia(0, groundLocalInertia); // 地面没有质量

  const groundRbInfo = new Ammo.btRigidBodyConstructionInfo(0, groundMotionState, groundShape, groundLocalInertia); // 地面质量为 0，表示静态物体
  const groundBody = new Ammo.btRigidBody(groundRbInfo);

  // 将地面物理体添加到物理世界
  physicsWorld.addRigidBody(groundBody);

  // 创建 GUI 控件
  const gui = new dat.GUI();
  // GUI 控件对象
  const controlsObj = {
    cubeColor: "#ff0000", // 默认颜色
    cubeSize: 1,          // 默认立方体尺寸
    cubePositionX:1,
    cubePositionY:1,
    cubePositionZ:1,

    sphereColor: "#0000ff", // 默认球体颜色
    sphereSize: 1        , // 默认球体尺寸
    spherePosition:(0,0,0),
  };
  const lightControls = {
    pointLightIntensity: 200, // 默认强度
    lightX: pointLight.position.x,
    lightY: pointLight.position.y,
    lightZ: pointLight.position.z
  };
  const displayControls = {
    showFPS :true
  }

  gui.addColor(controlsObj, 'cubeColor').name('颜色').onChange((value) => {
    cube.mesh.material.color.set(value);  // 更新立方体的颜色
  });

  gui.add(controlsObj, 'cubeSize', 0.1, 3).name('尺寸').onChange((value) => {
    cube.mesh.scale.set(value, value, value);  // 更新立方体的尺寸
    cube.body.getCollisionShape().setLocalScaling(new Ammo.btVector3(value,value,value))

  });
  gui.add(controlsObj,'cubePositionX',-10,10).name('位置').onChange((value)=>{
    cube.mesh.position.x = value;
  });

    // 更新球体颜色和尺寸
    gui.addColor(controlsObj, 'sphereColor').name('球体颜色').onChange((value) => {
    sphere.mesh.material.color.set(value);  // 更新球体的颜色

  });

  gui.add(controlsObj, 'sphereSize', 0.1, 3).name('球体尺寸').onChange((value) => {
    sphere.mesh.scale.set(value, value, value);  // 更新球体的尺寸
    // 更新物理体的大小
    sphere.body.getCollisionShape().setLocalScaling(new Ammo.btVector3(value, value, value));
  });
  gui.add(lightControls, 'pointLightIntensity', 0, 1000).name('点光源强度').onChange((value) => {
    pointLight.intensity = value;  // 更新点光源强度 
  });
  gui.add(lightControls, 'lightX', -10, 10).name('光源 X').onChange((value) => {
    pointLight.position.x = value;  // 更新光源 X 位置
  });
  gui.add(lightControls, 'lightY', -10, 10).name('光源 Y').onChange((value) => {
    pointLight.position.y = value;  // 更新光源 Y 位置
  });
  gui.add(lightControls, 'lightZ', -10, 10).name('光源 Z').onChange((value) => {
    pointLight.position.z = value;  // 更新光源 Z 位置
  }); 
    // 添加控制 FPS 显示开关
    gui.add(displayControls, 'showFPS').name('显示FPS').onChange((value) => {
    if (value) {
      stats.dom.style.display = 'block';  // 显示 FPS
    } else {
      stats.dom.style.display = 'none';  // 隐藏 FPS
    }
  });

  // 动画函数
  function animate() {
    requestAnimationFrame(animate);

    // 更新物理世界
    physicsWorld.stepSimulation(1 / 60, 10);

  
    const cubeTransform = cube.body.getWorldTransform();
    const cubeOrigin = cubeTransform.getOrigin();
    cube.mesh.position.set(cubeOrigin.x(), cubeOrigin.y(), cubeOrigin.z());

    const sphereTransform = sphere.body.getWorldTransform();
    const sphereOrigin = sphereTransform.getOrigin();
    sphere.mesh.position.set(sphereOrigin.x(), sphereOrigin.y(), sphereOrigin.z());
    // 渲染场景


    stats.begin(); // 开始计时
    renderer.render(scene, camera);
    stats.end(); // 结束计时
  }

  animate();
});
</script>

<style scoped>
#app {
  width: 100vw;
  height: 100vh;
  margin: 0;
}
</style>
