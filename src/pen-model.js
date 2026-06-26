import * as THREE from 'three';
import { parts } from './data.js';
import { createNib, createFeed } from './nib-feed.js';

function latheMesh(name, profile, material, segments = 96) {
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
function cylinderAlongX(radius, length, material, radialSegments = 80) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, radialSegments), material);
  mesh.rotation.z = Math.PI / 2;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}
function addRing(parent, x, radius, width, material, name = '') {
  const ring = cylinderAlongX(radius, width, material, 96);
  ring.position.x = x;
  ring.name = name;
  parent.add(ring);
  return ring;
}
function createClip(fixedMetal) {
  const group = new THREE.Group();
  group.name = 'clip_group';
  const stem = new THREE.Mesh(new THREE.CapsuleGeometry(0.9, 37, 6, 14), fixedMetal.clone());
  stem.rotation.z = Math.PI / 2;
  stem.position.set(-31, 0, 7.6);
  stem.scale.y = 0.76;
  stem.name = 'clip';
  stem.castShadow = true;
  group.add(stem);
  const anchor = new THREE.Mesh(new THREE.SphereGeometry(2.2, 48, 24), fixedMetal.clone());
  anchor.scale.set(1.25, 0.75, 0.55);
  anchor.position.set(-51.2, 0, 7.25);
  anchor.name = 'clip_anchor';
  group.add(anchor);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(1.8, 40, 20), fixedMetal.clone());
  tip.scale.set(1.45, 0.72, 0.52);
  tip.position.set(-10.4, 0, 7.3);
  tip.name = 'clip_tip';
  group.add(tip);
  return group;
}

export function buildPenModel(materials) {
  const { customMaterial, fixedMetal, darkMetal } = materials;
  const root = new THREE.Group();
  root.name = 'profit_junior_preview';
  root.rotation.y = -0.06;
  root.rotation.x = 0.02;

  const bodyGroup = new THREE.Group();
  bodyGroup.name = 'body_group';
  bodyGroup.add(latheMesh('grip_section', [[-18, 3.35], [-16.5, 3.72], [-13, 4.08], [-6, 4.32], [0, 4.82], [4.2, 5.4]], customMaterial()));
  bodyGroup.add(latheMesh('center_ring_or_connector', [[4.2, 5.45], [5.2, 6.25], [9.5, 6.38], [11.5, 6.55], [13.0, 6.6]], customMaterial()));
  bodyGroup.add(latheMesh('barrel_body', [[13.0, 6.58], [19, 6.7], [36, 6.95], [55, 7.02], [70, 6.82], [80.5, 6.15]], customMaterial()));
  bodyGroup.add(latheMesh('barrel_end', [[80.5, 6.15], [84, 5.65], [88, 4.42], [90.5, 2.4], [91.4, 0.55]], customMaterial()));
  addRing(bodyGroup, 3.65, 5.65, 0.7, fixedMetal.clone(), 'connector_ring_fixed');
  addRing(bodyGroup, 12.65, 6.78, 0.55, fixedMetal.clone(), 'barrel_ring_fixed');
  bodyGroup.add(createFeed(materials));
  bodyGroup.add(createNib(materials));
  root.add(bodyGroup);

  const capGroup = new THREE.Group();
  capGroup.name = 'cap_group';
  capGroup.add(latheMesh('cap_body', [[-55, 6.35], [-51, 6.72], [-38, 7.1], [-20, 7.35], [-7.5, 7.35], [-1.5, 7.28], [0, 7.25]], customMaterial()));
  capGroup.add(latheMesh('cap_top', [[-65.2, 0.6], [-64.3, 2.5], [-62, 4.6], [-58.3, 5.9], [-55, 6.35]], customMaterial()));
  addRing(capGroup, -2.0, 7.48, 1.65, fixedMetal.clone(), 'cap_band_main');
  addRing(capGroup, -4.1, 7.42, 0.42, fixedMetal.clone(), 'cap_band_thin');
  addRing(capGroup, -6.0, 7.36, 0.28, fixedMetal.clone(), 'cap_band_hairline');
  const innerLip = addRing(capGroup, -0.15, 6.72, 1.1, darkMetal.clone(), 'inner_cap_lip');
  innerLip.material.roughness = 0.34;
  capGroup.add(createClip(fixedMetal));
  root.add(capGroup);

  const meshByPart = new Map();
  for (const part of parts) {
    const mesh = root.getObjectByName(part.id);
    if (mesh?.isMesh) meshByPart.set(part.id, mesh);
  }
  return { root, capGroup, meshByPart };
}
