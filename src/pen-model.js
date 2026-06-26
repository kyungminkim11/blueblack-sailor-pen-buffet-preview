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
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, length, radialSegments),
    material,
  );
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

  const stem = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.82, 38, 8, 18),
    fixedMetal.clone(),
  );
  stem.rotation.z = Math.PI / 2;
  stem.position.set(-31.2, 0, 7.48);
  stem.scale.y = 0.68;
  stem.name = 'clip';
  stem.castShadow = true;
  group.add(stem);

  const anchor = new THREE.Mesh(
    new THREE.SphereGeometry(2.05, 56, 28),
    fixedMetal.clone(),
  );
  anchor.scale.set(1.36, 0.72, 0.5);
  anchor.position.set(-52.4, 0, 7.1);
  anchor.name = 'clip_anchor';
  anchor.castShadow = true;
  group.add(anchor);

  const tip = new THREE.Mesh(
    new THREE.SphereGeometry(1.55, 48, 24),
    fixedMetal.clone(),
  );
  tip.scale.set(1.55, 0.68, 0.48);
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
    metalness: 0,
    transparent: true,
    opacity: 0.34,
    transmission: 0.08,
    depthWrite: false,
  });
  const tube = cylinderAlongX(3.05, 54, tubeMaterial, 72);
  tube.position.x = 46;
  tube.name = 'converter_tube';
  group.add(tube);

  const darkMaterial = new THREE.MeshStandardMaterial({
    color: 0x24272c,
    roughness: 0.35,
    metalness: 0.08,
  });
  const neck = cylinderAlongX(2.05, 8.5, darkMaterial.clone(), 64);
  neck.position.x = 15.8;
  neck.name = 'converter_neck';
  group.add(neck);

  const piston = cylinderAlongX(3.18, 1.3, darkMaterial.clone(), 72);
  piston.position.x = 68.6;
  piston.name = 'converter_piston';
  group.add(piston);

  const rearKnob = cylinderAlongX(2.65, 5.2, darkMaterial.clone(), 64);
  rearKnob.position.x = 76.8;
  rearKnob.name = 'converter_knob';
  group.add(rearKnob);

  return group;
}

function createInnerCap() {
  const group = new THREE.Group();
  group.name = 'inner_cap_assembly';

  const linerMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x56606a,
    roughness: 0.26,
    transparent: true,
    opacity: 0.18,
    depthWrite: false,
  });
  const liner = cylinderAlongX(6.18, 42, linerMaterial, 96);
  liner.position.x = -25.5;
  liner.name = 'inner_cap_liner';
  group.add(liner);

  const sealMaterial = new THREE.MeshStandardMaterial({
    color: 0x31363c,
    roughness: 0.38,
    transparent: true,
    opacity: 0.55,
  });
  const seal = cylinderAlongX(5.35, 4.2, sealMaterial, 80);
  seal.position.x = -45.3;
  seal.name = 'inner_cap_seal';
  group.add(seal);

  return group;
}

function registerPart(partMeshes, partId, mesh) {
  mesh.userData.partId = partId;
  mesh.name = mesh.name || partId;
  if (!partMeshes.has(partId)) partMeshes.set(partId, []);
  partMeshes.get(partId).push(mesh);
  return mesh;
}

export function buildPenModel(materials) {
  const { customMaterial, fixedMetal, darkMetal } = materials;
  const root = new THREE.Group();
  root.name = 'profit_junior_preview';
  root.rotation.y = -0.055;
  root.rotation.x = 0.018;

  const partMeshes = new Map(parts.map((part) => [part.id, []]));
  const bodyGroup = new THREE.Group();
  bodyGroup.name = 'body_group';

  const grip = registerPart(
    partMeshes,
    'grip_section',
    latheMesh(
      'grip_section',
      [
        [-19.2, 4.25],
        [-18.4, 4.5],
        [-17.25, 4.42],
        [-14.8, 3.75],
        [-10.8, 3.48],
        [-6.2, 3.72],
        [-1.2, 4.5],
        [3.65, 5.38],
      ],
      customMaterial(),
    ),
  );
  bodyGroup.add(grip);

  const gripLip = registerPart(
    partMeshes,
    'grip_section',
    addRing(bodyGroup, -18.55, 4.58, 0.78, customMaterial(), 'grip_section_front_lip'),
  );
  gripLip.userData.partId = 'grip_section';

  const connector = registerPart(
    partMeshes,
    'center_ring_or_connector',
    latheMesh(
      'center_ring_or_connector',
      [
        [3.65, 5.38],
        [4.4, 5.92],
        [5.25, 6.12],
        [13.2, 6.12],
        [14.15, 6.35],
        [15.55, 6.5],
      ],
      customMaterial(),
    ),
  );
  bodyGroup.add(connector);

  const connectorThread = registerPart(
    partMeshes,
    'center_ring_or_connector',
    createThreadMesh({
      name: 'center_connector_thread',
      startX: 5.05,
      length: 8.25,
      radius: 6.2,
      turns: 9.2,
      thickness: 0.115,
      material: customMaterial(),
    }),
  );
  bodyGroup.add(connectorThread);

  const connectorShoulder = registerPart(
    partMeshes,
    'center_ring_or_connector',
    addRing(bodyGroup, 14.45, 6.48, 0.55, customMaterial(), 'center_connector_shoulder'),
  );
  connectorShoulder.userData.partId = 'center_ring_or_connector';

  const barrelBody = registerPart(
    partMeshes,
    'barrel_body',
    latheMesh(
      'barrel_body',
      [
        [15.55, 6.5],
        [18.5, 6.68],
        [31, 6.9],
        [48, 7.02],
        [65, 6.98],
        [77, 6.72],
        [83, 6.25],
      ],
      customMaterial(),
    ),
  );
  bodyGroup.add(barrelBody);

  const barrelSeam = registerPart(
    partMeshes,
    'barrel_body',
    addRing(bodyGroup, 82.65, 6.3, 0.34, customMaterial(), 'barrel_body_end_seam'),
  );
  barrelSeam.userData.partId = 'barrel_body';

  const barrelEnd = registerPart(
    partMeshes,
    'barrel_end',
    latheMesh(
      'barrel_end',
      [
        [83, 6.25],
        [85.5, 6.02],
        [88.6, 5.45],
        [91.8, 4.5],
        [94.4, 3.28],
        [96.4, 1.92],
        [97.5, 0.92],
        [98.0, 0.36],
      ],
      customMaterial(),
    ),
  );
  bodyGroup.add(barrelEnd);

  const barrelEndSeat = registerPart(
    partMeshes,
    'barrel_end',
    addRing(bodyGroup, 83.15, 6.28, 0.3, customMaterial(), 'barrel_end_seat'),
  );
  barrelEndSeat.userData.partId = 'barrel_end';

  bodyGroup.add(createFeed(materials));
  bodyGroup.add(createNib(materials));
  bodyGroup.add(createConverterAssembly());
  root.add(bodyGroup);

  const capGroup = new THREE.Group();
  capGroup.name = 'cap_group';

  const capBody = registerPart(
    partMeshes,
    'cap_body',
    latheMesh(
      'cap_body',
      [
        [-54.2, 6.28],
        [-51.2, 6.62],
        [-42.5, 6.98],
        [-25, 7.22],
        [-9, 7.28],
        [-2.5, 7.22],
        [0, 7.15],
      ],
      customMaterial(),
    ),
  );
  capGroup.add(capBody);

  const capTop = registerPart(
    partMeshes,
    'cap_top',
    latheMesh(
      'cap_top',
      [
        [-67.1, 0.42],
        [-66.55, 1.3],
        [-65.25, 2.82],
        [-62.9, 4.55],
        [-59.8, 5.75],
        [-56.5, 6.25],
        [-54.2, 6.28],
      ],
      customMaterial(),
    ),
  );
  capGroup.add(capTop);

  const capTopSeat = registerPart(
    partMeshes,
    'cap_top',
    addRing(capGroup, -54.15, 6.33, 0.34, customMaterial(), 'cap_top_seat'),
  );
  capTopSeat.userData.partId = 'cap_top';

  addRing(capGroup, -1.65, 7.38, 1.5, fixedMetal.clone(), 'cap_band_main');
  addRing(capGroup, -4.05, 7.31, 0.34, fixedMetal.clone(), 'cap_band_hairline');
  addRing(capGroup, -54.15, 6.48, 0.38, fixedMetal.clone(), 'clip_crown_ring');
  capGroup.add(createClip(fixedMetal));
  capGroup.add(createInnerCap());
  root.add(capGroup);

  return { root, capGroup, partMeshes };
}
