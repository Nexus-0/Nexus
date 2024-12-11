import * as THREE from 'three';
import Ammo from 'ammo.js';

export function createPhysicsObject(type, options, physicsWorld) {
  const { mass = 1, size = [1, 1, 1], position = [0, 0, 0], color = 0x00ff00 } = options;

  let geometry, shape;
  if (type === 'box') {
    geometry = new THREE.BoxGeometry(...size);
    shape = new Ammo.btBoxShape(new Ammo.btVector3(size[0] / 2, size[1] / 2, size[2] / 2));
  } else if (type === 'sphere') {
    geometry = new THREE.SphereGeometry(size[0]);
    shape = new Ammo.btSphereShape(size[0]);
  }

  const material = new THREE.MeshStandardMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.position.set(...position);

  const transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin(new Ammo.btVector3(...position));

  const motionState = new Ammo.btDefaultMotionState(transform);
  const localInertia = new Ammo.btVector3(0, 0, 0);
  shape.calculateLocalInertia(mass, localInertia);

  const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
  const body = new Ammo.btRigidBody(rbInfo);

  physicsWorld.addRigidBody(body);

  return { mesh, body };
}