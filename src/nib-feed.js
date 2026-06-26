import * as THREE from 'three';

function curvedNibGeometry() {
  const rows = [
    { x: -36.7, width: 0.12, edgeZ: 2.68, crownZ: 2.8 },
    { x: -35.8, width: 0.44, edgeZ: 2.46, crownZ: 2.98 },
    { x: -34.1, width: 0.96, edgeZ: 2.12, crownZ: 3.12 },
    { x: -31.5, width: 2.12, edgeZ: 1.72, crownZ: 3.24 },
    { x: -28.3, width: 3.46, edgeZ: 1.34, crownZ: 3.34 },
    { x: -24.6, width: 4.82, edgeZ: 1.12, crownZ: 3.4 },
    { x: -21.5, width: 4.72, edgeZ: 1.18, crownZ: 3.36 },
    { x: -18.9, width: 4.08, edgeZ: 1.28, crownZ: 3.26 },
  ];
  const columns = 15;
  const thickness = 0.2;
  const positions = [];
  const indices = [];
  const rowSize = columns;
  const surfaceSize = rows.length * rowSize;
  const makeZ = (row, v) => row.edgeZ + (row.crownZ - row.edgeZ) * Math.max(0, 1 - Math.pow(Math.abs(v), 1.9));

  for (const offset of [0, -thickness]) {
    for (const row of rows) {
      for (let column = 0; column < columns; column += 1) {
        const v = column / (columns - 1) * 2 - 1;
        positions.push(row.x, v * row.width, makeZ(row, v) + offset);
      }
    }
  }
  for (let row = 0; row < rows.length - 1; row += 1) {
    for (let column = 0; column < columns - 1; column += 1) {
      const a = row * rowSize + column;
      const b = (row + 1) * rowSize + column;
      const c = a + 1;
      const d = b + 1;
      indices.push(a, b, c, b, d, c);
      const bottomA = surfaceSize + a;
      const bottomB = surfaceSize + b;
      const bottomC = surfaceSize + c;
      const bottomD = surfaceSize + d;
      indices.push(bottomA, bottomC, bottomB, bottomB, bottomC, bottomD);
    }
  }
  const connectEdge = (topA, topB) => {
    const bottomA = surfaceSize + topA;
    const bottomB = surfaceSize + topB;
    indices.push(topA, bottomA, topB, topB, bottomA, bottomB);
  };
  for (let row = 0; row < rows.length - 1; row += 1) {
    connectEdge(row * rowSize, (row + 1) * rowSize);
    connectEdge((row + 1) * rowSize - 1, (row + 2) * rowSize - 1);
  }
  for (let column = 0; column < columns - 1; column += 1) {
    connectEdge(column + 1, column);
    const lastRow = (rows.length - 1) * rowSize;
    connectEdge(lastRow + column, lastRow + column + 1);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function feedCoreGeometry() {
  const rows = [
    { x: -36.15, halfWidth: 0.34, topZ: 2.16, bottomZ: 0.96 },
    { x: -34.75, halfWidth: 0.78, topZ: 2.14, bottomZ: 0.34 },
    { x: -32.55, halfWidth: 1.58, topZ: 2.07, bottomZ: -0.44 },
    { x: -29.65, halfWidth: 2.55, topZ: 1.95, bottomZ: -0.98 },
    { x: -26.05, halfWidth: 3.36, topZ: 1.78, bottomZ: -1.34 },
    { x: -22.25, halfWidth: 3.82, topZ: 1.58, bottomZ: -1.58 },
    { x: -18.65, halfWidth: 3.98, topZ: 1.42, bottomZ: -1.7 },
  ];
  const positions = [];
  const indices = [];
  for (const row of rows) {
    positions.push(
      row.x, -row.halfWidth, row.topZ,
      row.x, row.halfWidth, row.topZ,
      row.x, -row.halfWidth * 0.7, row.bottomZ,
      row.x, row.halfWidth * 0.7, row.bottomZ,
    );
  }
  for (let index = 0; index < rows.length - 1; index += 1) {
    const current = index * 4;
    const next = (index + 1) * 4;
    indices.push(
      current, next, current + 1, next, next + 1, current + 1,
      current + 2, current + 3, next + 2, next + 2, current + 3, next + 3,
      current, current + 2, next, next, current + 2, next + 2,
      current + 1, next + 1, current + 3, next + 1, next + 3, current + 3,
    );
  }
  const last = (rows.length - 1) * 4;
  indices.push(0, 1, 2, 1, 3, 2, last, last + 2, last + 1, last + 1, last + 2, last + 3);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function createNib({ fixedMetal, darkInset }) {
  const group = new THREE.Group();
  group.name = 'nib_group';
  group.rotation.x = -0.14;
  group.position.set(0.08, 0, 0.36);
  const nibMaterial = fixedMetal.clone();
  nibMaterial.color.set('#d6d9de');
  nibMaterial.metalness = 0.9;
  nibMaterial.roughness = 0.16;
  const nib = new THREE.Mesh(curvedNibGeometry(), nibMaterial);
  nib.name = 'nib';
  nib.castShadow = true;
  nib.receiveShadow = true;
  group.add(nib);

  const slitCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-36.15, 0, 2.88),
    new THREE.Vector3(-33.25, 0, 3.08),
    new THREE.Vector3(-30.2, 0, 3.2),
    new THREE.Vector3(-27.8, 0, 3.28),
  ]);
  const slit = new THREE.Mesh(new THREE.TubeGeometry(slitCurve, 30, 0.045, 6, false), darkInset.clone());
  slit.name = 'nib_slit';
  group.add(slit);

  const breatherHole = new THREE.Mesh(new THREE.CircleGeometry(0.52, 40), darkInset.clone());
  breatherHole.name = 'nib_breather_hole';
  breatherHole.position.set(-27.35, 0, 3.3);
  group.add(breatherHole);

  const tipping = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 18), nibMaterial.clone());
  tipping.name = 'nib_tipping';
  tipping.position.set(-36.52, 0, 2.7);
  tipping.scale.set(1.18, 0.52, 0.5);
  tipping.castShadow = true;
  group.add(tipping);
  return group;
}

export function createFeed({ feedMaterial, darkInset }) {
  const group = new THREE.Group();
  group.name = 'feed_group';
  group.rotation.x = -0.12;
  group.position.set(0.08, 0, 0.1);

  const bodyMaterial = feedMaterial.clone();
  bodyMaterial.color.set('#111419');
  bodyMaterial.roughness = 0.34;

  const core = new THREE.Mesh(feedCoreGeometry(), bodyMaterial);
  core.name = 'feed';
  core.castShadow = true;
  core.receiveShadow = true;
  group.add(core);

  const channelCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-35.72, 0, 2.19),
    new THREE.Vector3(-32.45, 0, 2.12),
    new THREE.Vector3(-28.7, 0, 1.97),
    new THREE.Vector3(-24.65, 0, 1.76),
    new THREE.Vector3(-20.25, 0, 1.5),
  ]);
  const channelMaterial = darkInset.clone();
  channelMaterial.color.set('#050607');
  const channel = new THREE.Mesh(new THREE.TubeGeometry(channelCurve, 42, 0.072, 6, false), channelMaterial);
  channel.name = 'feed_ink_channel';
  group.add(channel);

  const finXs = [-26.55, -25.77, -24.99, -24.21, -23.43, -22.65, -21.87, -21.09, -20.31, -19.53];
  finXs.forEach((x, index) => {
    const progress = index / (finXs.length - 1);
    const fin = new THREE.Mesh(
      new THREE.BoxGeometry(0.21, 6.7 + progress * 0.86, 2.12 + progress * 0.3),
      bodyMaterial.clone(),
    );
    fin.position.set(x, 0, -2.34 - progress * 0.13);
    fin.name = `feed_fin_${index + 1}`;
    fin.castShadow = true;
    group.add(fin);
  });

  const rearShoulder = new THREE.Mesh(new THREE.BoxGeometry(1.35, 7.55, 3.1), bodyMaterial.clone());
  rearShoulder.position.set(-18.45, 0, -0.35);
  rearShoulder.name = 'feed_rear_shoulder';
  rearShoulder.castShadow = true;
  group.add(rearShoulder);
  return group;
}
