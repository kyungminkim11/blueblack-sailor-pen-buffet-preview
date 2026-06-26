import * as THREE from 'three';
import { parts } from './data.js';
import { createNib, createFeed } from './nib-feed.js';

function latheMesh(name, profile, material, segments = 128) {
  const points = profile.map(([axis, radius]) => new THREE.Vector2(radius, axis));
  const geometry = new THREE.LatheGeometry(points, segments);
  geometry.rotateZ(-Math.PI / 2);
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function cylinderAlongX(radius, length, material, radialSegments = 96) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, radialSegments), material);
  mesh.rotation.z = Math.PI / 2;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function addRing(parent, x, radius, width, material, name = '') {
  const ring = cylinderAlongX(radius, width, material, 112);
  ring.position.x = x;
  ring.name = name;
  parent.add(ring);
  return ring;
}

class HelixCurve extends THREE.Curve {
  constructor({ startX, length, radius, turns }) {
    super();
    this.startX = startX;
    this.length = length;
    this.radius = radius;
    this.turns = turns;
  }

  getPoint(t, target = new THREE.Vector3()) {
    const angle = Math.PI * 2 * this.turns * t;
    return target.set(
      this.startX + this.length * t,
      Math.cos(angle) * this.radius,
      Math.sin(angle) * this.radius,
    );
  }
}

function createThreadMesh({ name, startX, length, radius, turns, thickness, material }) {
  const path = new HelixCurve({ startX, length, radius, turns });
  const geometry = new THREE.TubeGeometry(path, Math.ceil(turns * 30), thickness, 8, false);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function createClip(fixedMetal) {
  const group = new THREE.Group();
  group.name = 'clip_group';

  const stem = new THREE.Mesh(new THREE.CapsuleGeometry(0.82, 38, 8, 18), fixedMetal.clone());
  stem.rotation.z = Math.PI / 2;
  stem.position.set(-31.5, 0, 7.5);
  stem.scale.y = 0.68;
  stem.name = 'clip';
  stem.castShadow = true;
  group.add(stem);

  const anchor = new THREE.Mesh(new THREE.SphereGeometry(1.95, 56, 28), fixedMetal.clone());
  anchor.scale.set(1.38, 0.7, 0.48);
  anchor.position.set(-53.2, 0, 7.08);
  anchor.name = 'clip_anchor';
  anchor.castShadow = true;
  group.add(anchor);

  const tip = new THREE.Mesh(new THREE.SphereGeometry(1.5, 48, 24), fixedMetal.clone());
  tip.scale.set(1.5, 0.66, 0.46);
  tip.position.set(-9.4, 0, 7.12);
  tip.name = 'clip_tip';
  tip.castShadow = true;
  group.add(tip);

  return group;
}

function createConverterAssembly() {
  const group = new THREE.Group();
  group.name = 'converter_assembly';

  const tubeMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xd4d9de,
    roughness: 0.2,
    transparent: true,
    opacity: 0.28,
    transmission: 0.06,
    depthWrite: false,
  });
  const tube = cylinderAlongX(2.88, 49, tubeMaterial, 72);
  tube.position.x = 42.5;
  tube.name = 'converter_tube';
  group.add(tube);

  const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x24272c, roughness: 0.35, metalness: 0.08 });
  const neck = cylinderAlongX(1.95, 7.5, darkMaterial.clone(), 64);
  neck.position.x = 14.2;
  neck.name = 'converter_neck';
  group.add(neck);

  const piston = cylinderAlongX(2.98, 1.1, darkMaterial.clone(), 72);
  piston.position.x = 67.3;
  piston.name = 'converter_piston';
  group.add(piston);

  const rearKnob = cylinderAlongX(2.45, 4.6, darkMaterial.clone(), 64);
  rearKnob.position.x = 74.8;
  rearKnob.name = 'converter_knob';
  group.add(rearKnob);

  return group;
}

function createInnerCap() {
  const group = new THREE.Group();
  group.name = 'inner_cap_assembly';
  const linerMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x5b636c,
    roughness: 0.3,
    transparent: true,
    opacity: 0.15,
    depthWrite: false,
  });
  const liner = cylinderAlongX(6.05, 39, linerMaterial, 96);
  liner.position.x = -25.5;
  liner.name = 'inner_cap_liner';
  group.add(liner);
  return group;
}

function registerPart(partMeshes, partId, mesh) {
  mesh.userData.partId = partId;
  if (!partMeshes.has(partId)) partMeshes.set(partId, []);
  partMeshes.get(partId).push(mesh);
  return mesh;
}

function registerGroupMeshes(partMeshes, partId, group) {
  group.traverse((object) => {
    if (object.isMesh) registerPart(partMeshes, partId, object);
  });
  return group;
}

export function buildPenModel(materials) {
  const { customMaterial, fixedMetal } = materials;
  const root = new THREE.Group();
  root.name = 'blueblack_sailor_pen_buffet';
  root.rotation.y = -0.055;
  root.rotation.x = 0.018;

  const partMeshes = new Map(parts.map((part) => [part.id, []]));

  const capEndGroup = new THREE.Group();
  capEndGroup.name = 'cap_end_group';
  const capEnd = registerPart(
    partMeshes,
    'cap_end',
    latheMesh('cap_end', [
      [-68.2, 0.34], [-67.75, 1.12], [-66.65, 2.35], [-64.9, 3.72], [-62.75, 4.72], [-61.2, 5.02],
    ], customMaterial()),
  );
  capEndGroup.add(capEnd);
  const capEndStem = registerPart(partMeshes, 'cap_end', cylinderAlongX(2.15, 5.8, customMaterial(), 72));
  capEndStem.name = 'cap_end_stem';
  capEndStem.position.x = -58.4;
  capEndGroup.add(capEndStem);
  root.add(capEndGroup);

  const capBodyGroup = new THREE.Group();
  capBodyGroup.name = 'cap_body_group';
  const capBody = registerPart(
    partMeshes,
    'cap_body',
    latheMesh('cap_body', [
      [-61.2, 5.02], [-59.6, 5.82], [-56.8, 6.45], [-47, 6.92], [-30, 7.2], [-12, 7.27], [-3.5, 7.22], [0, 7.14],
    ], customMaterial()),
  );
  capBodyGroup.add(capBody);
  registerPart(partMeshes, 'metal_parts', addRing(capBodyGroup, -1.7, 7.38, 1.48, fixedMetal.clone(), 'cap_band_main'));
  registerPart(partMeshes, 'metal_parts', addRing(capBodyGroup, -4.0, 7.31, 0.34, fixedMetal.clone(), 'cap_band_hairline'));
  const clipGroup = createClip(fixedMetal);
  registerGroupMeshes(partMeshes, 'metal_parts', clipGroup);
  capBodyGroup.add(clipGroup);
  capBodyGroup.add(createInnerCap());
  root.add(capBodyGroup);

  const nibGripGroup = new THREE.Group();
  nibGripGroup.name = 'nib_grip_group';
  const nibGrip = registerPart(
    partMeshes,
    'nib_grip',
    latheMesh('nib_grip', [
      [-19.3, 4.18], [-18.55, 4.48], [-17.25, 4.38], [-14.8, 3.72], [-10.5, 3.43], [-6.0, 3.7],
      [-1.2, 4.48], [3.75, 5.36], [4.45, 5.52], [12.2, 5.52],
    ], customMaterial()),
  );
  nibGripGroup.add(nibGrip);
  registerPart(partMeshes, 'nib_grip', addRing(nibGripGroup, -18.65, 4.58, 0.72, customMaterial(), 'nib_grip_front_lip'));
  const sectionThread = registerPart(
    partMeshes,
    'nib_grip',
    createThreadMesh({
      name: 'nib_grip_thread',
      startX: 4.65,
      length: 7.1,
      radius: 5.63,
      turns: 8.5,
      thickness: 0.11,
      material: customMaterial(),
    }),
  );
  nibGripGroup.add(sectionThread);
  registerPart(partMeshes, 'metal_parts', addRing(nibGripGroup, 3.95, 5.62, 0.48, fixedMetal.clone(), 'nib_grip_metal_ring'));
  nibGripGroup.add(createFeed(materials));
  const nibGroup = createNib(materials);
  registerGroupMeshes(partMeshes, 'metal_parts', nibGroup);
  nibGripGroup.add(nibGroup);
  root.add(nibGripGroup);

  const barrelGroup = new THREE.Group();
  barrelGroup.name = 'barrel_group';
  const barrel = registerPart(
    partMeshes,
    'barrel_body',
    latheMesh('barrel_body', [
      [12.2, 6.02], [14.4, 6.38], [20, 6.65], [36, 6.92], [55, 7.02], [72, 6.94], [84, 6.52], [91.2, 5.82], [94.0, 5.15],
    ], customMaterial()),
  );
  barrelGroup.add(barrel);
  barrelGroup.add(createConverterAssembly());
  root.add(barrelGroup);

  const barrelEndGroup = new THREE.Group();
  barrelEndGroup.name = 'barrel_end_group';
  const barrelEndStem = registerPart(partMeshes, 'barrel_end', cylinderAlongX(1.72, 5.3, customMaterial(), 64));
  barrelEndStem.name = 'barrel_end_stem';
  barrelEndStem.position.x = 92.2;
  barrelEndGroup.add(barrelEndStem);
  const barrelEnd = registerPart(
    partMeshes,
    'barrel_end',
    latheMesh('barrel_end', [
      [94.0, 5.15], [95.0, 4.68], [96.1, 3.8], [97.05, 2.72], [97.75, 1.5], [98.15, 0.62], [98.3, 0.28],
    ], customMaterial()),
  );
  barrelEndGroup.add(barrelEnd);
  root.add(barrelEndGroup);

  return {
    root,
    partMeshes,
    groups: { capEndGroup, capBodyGroup, nibGripGroup, barrelGroup, barrelEndGroup },
  };
}
