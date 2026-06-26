import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { parts, colors, defaultSelection } from './data.js';
import { buildPenModel } from './pen-model.js';

const state = {
  activePartId: parts[0].id,
  selections: { ...defaultSelection },
  viewMode: 'open',
  autoRotate: true,
  root: null,
  groups: null,
  partMeshes: new Map(),
};

const params = new URLSearchParams(location.search);
for (const part of parts) {
  const value = params.get(part.id);
  if (colors.some((color) => color.id === value)) state.selections[part.id] = value;
}

const canvas = document.querySelector('#pen-canvas');
const canvasWrap = document.querySelector('#canvas-wrap');
const loadingPanel = document.querySelector('#loading-panel');
const modelError = document.querySelector('#model-error');
const partTabs = document.querySelector('#part-tabs');
const swatchGrid = document.querySelector('#swatch-grid');
const summaryList = document.querySelector('#summary-list');
const copyFeedback = document.querySelector('#copy-feedback');
document.querySelector('#loading-progress').textContent = '모델 구성 중';

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  preserveDrawingBuffer: true,
});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 1000);
camera.position.set(0, 46, 188);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.065;
controls.minDistance = 100;
controls.maxDistance = 290;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;
controls.target.set(0, 0, 0);

scene.add(new THREE.HemisphereLight(0xffffff, 0x8e9aaa, 2.15));
const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
keyLight.position.set(45, 70, 85);
keyLight.castShadow = true;
scene.add(keyLight);
const fillLight = new THREE.DirectionalLight(0xc6dbff, 1.6);
fillLight.position.set(-55, 18, 50);
scene.add(fillLight);
const rimLight = new THREE.DirectionalLight(0xffebca, 1.35);
rimLight.position.set(20, -25, -50);
scene.add(rimLight);

const ground = new THREE.Mesh(
  new THREE.CircleGeometry(124, 96),
  new THREE.ShadowMaterial({ color: 0x263548, opacity: 0.13 }),
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -24;
ground.receiveShadow = true;
scene.add(ground);

const materials = {
  fixedMetal: new THREE.MeshStandardMaterial({ color: 0xc8ccd1, metalness: 0.92, roughness: 0.18 }),
  darkMetal: new THREE.MeshStandardMaterial({ color: 0x555b63, metalness: 0.65, roughness: 0.25 }),
  feedMaterial: new THREE.MeshStandardMaterial({ color: 0x16181c, roughness: 0.34 }),
  darkInset: new THREE.MeshStandardMaterial({ color: 0x111318, roughness: 0.42 }),
  customMaterial: () => new THREE.MeshPhysicalMaterial({
    color: 0xdce8ee,
    roughness: 0.16,
    metalness: 0,
    clearcoat: 0.65,
    clearcoatRoughness: 0.14,
    transparent: true,
    opacity: 0.46,
    transmission: 0.12,
    thickness: 1.1,
    side: THREE.DoubleSide,
  }),
};

function allColorMeshes() {
  return [...state.partMeshes.values()].flat();
}

function resetGroupTransforms() {
  if (!state.groups) return;
  for (const group of Object.values(state.groups)) {
    group.position.set(0, 0, 0);
    group.rotation.set(0, 0, 0);
  }
}

function updateModelLayout() {
  if (!state.groups) return;
  const { capTopGroup, capBodyGroup, sectionGroup, barrelGroup, tailPlugGroup } = state.groups;
  resetGroupTransforms();

  if (state.viewMode === 'open') {
    capTopGroup.position.set(-8, 30, 0);
    capBodyGroup.position.set(8, 30, 0);
    sectionGroup.position.set(-8, -7, 0);
    barrelGroup.position.set(8, -7, 0);
    tailPlugGroup.position.set(21, -7, 0);
    state.root.position.set(-6, -3, 0);
    camera.position.set(0, 52, 202);
    controls.minDistance = 115;
    controls.maxDistance = 310;
    ground.position.y = -28;
  } else {
    capTopGroup.position.set(22.2, 0, 0);
    capBodyGroup.position.set(22.2, 0, 0);
    state.root.position.set(-8, 0, 0);
    camera.position.set(0, 28, 180);
    controls.minDistance = 95;
    controls.maxDistance = 245;
    ground.position.y = -13;
  }

  controls.target.set(0, 0, 0);
  controls.update();
}

function getColor(id) {
  return colors.find((color) => color.id === id) ?? colors[0];
}

function applyMaterial(mesh, color, active) {
  const material = mesh.material;
  material.color.set(color.hex);
  material.metalness = 0;
  material.roughness = color.transparent ? 0.08 : 0.17;
  material.clearcoat = 0.74;
  material.clearcoatRoughness = 0.11;
  material.transparent = Boolean(color.transparent);
  material.opacity = color.transparent ? 0.43 : 1;
  material.transmission = color.transparent ? 0.13 : 0;
  material.depthWrite = !color.transparent;
  material.side = color.transparent ? THREE.DoubleSide : THREE.FrontSide;
  material.emissive = new THREE.Color(active ? color.hex : '#000000');
  material.emissiveIntensity = active ? 0.035 : 0;
  material.needsUpdate = true;
}

function applyAllColors() {
  for (const part of parts) {
    const color = getColor(state.selections[part.id]);
    const meshes = state.partMeshes.get(part.id) ?? [];
    for (const mesh of meshes) {
      applyMaterial(mesh, color, state.activePartId === part.id);
    }
  }
}

function setQueryString() {
  const query = new URLSearchParams();
  for (const part of parts) query.set(part.id, state.selections[part.id]);
  history.replaceState(null, '', `${location.pathname}?${query.toString()}`);
}

function combinationCode() {
  return `BB-SAILOR-${parts.map((part) => getColor(state.selections[part.id]).code).join('-')}`;
}

function selectPart(id) {
  state.activePartId = id;
  applyAllColors();
  renderControls();
}

function renderPartTabs() {
  partTabs.replaceChildren(...parts.map((part, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'part-tab';
    button.role = 'tab';
    button.textContent = `${index + 1}. ${part.nameKo}`;
    button.setAttribute('aria-selected', String(state.activePartId === part.id));
    button.addEventListener('click', () => selectPart(part.id));
    return button;
  }));
}

function renderSwatches() {
  const activeColorId = state.selections[state.activePartId];
  swatchGrid.replaceChildren(...colors.map((color) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'swatch-button';
    button.role = 'radio';
    button.setAttribute('aria-checked', String(activeColorId === color.id));
    button.setAttribute('aria-label', `${color.nameKo} 선택`);
    button.innerHTML = `<span class="swatch-circle${color.transparent ? ' transparent' : ''}" style="background:${color.hex}"></span><span>${color.nameKo}</span>`;
    button.addEventListener('click', () => {
      state.selections[state.activePartId] = color.id;
      setQueryString();
      applyAllColors();
      renderControls();
    });
    return button;
  }));
}

function renderSummary() {
  summaryList.replaceChildren(...parts.map((part) => {
    const color = getColor(state.selections[part.id]);
    const item = document.createElement('div');
    item.className = 'summary-item';
    item.innerHTML = `<span class="summary-dot" style="background:${color.hex}"></span><div><small>${part.nameKo}</small><b>${color.nameKo}</b></div>`;
    return item;
  }));
  document.querySelector('#combination-code').textContent = combinationCode();
}

function renderControls() {
  const activeIndex = parts.findIndex((part) => part.id === state.activePartId);
  const part = parts[activeIndex];
  const color = getColor(state.selections[part.id]);
  document.querySelector('#progress-text').textContent = `${activeIndex + 1} / ${parts.length}`;
  document.querySelector('#part-name-en').textContent = part.nameEn;
  document.querySelector('#part-name-ko').textContent = part.nameKo;
  document.querySelector('#part-description').textContent = part.description;
  document.querySelector('#selected-color-name').textContent = `${color.nameKo} · ${color.nameEn}`;
  document.querySelector('#selected-color-dot').style.background = color.hex;
  renderPartTabs();
  renderSwatches();
  renderSummary();
}

function resizeRenderer() {
  const width = canvasWrap.clientWidth;
  const height = canvasWrap.clientHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function showFeedback(message) {
  copyFeedback.textContent = message;
  setTimeout(() => {
    if (copyFeedback.textContent === message) copyFeedback.textContent = '';
  }, 2600);
}

try {
  const model = buildPenModel(materials);
  state.root = model.root;
  state.groups = model.groups;
  state.partMeshes = model.partMeshes;
  scene.add(state.root);
  updateModelLayout();
  applyAllColors();
  loadingPanel.hidden = true;
} catch (error) {
  console.error(error);
  loadingPanel.hidden = true;
  modelError.hidden = false;
}

new ResizeObserver(resizeRenderer).observe(canvasWrap);
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
canvas.addEventListener('pointerup', (event) => {
  if (!state.root || event.pointerType === 'touch') return;
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects(allColorMeshes(), false)[0];
  const partId = hit?.object?.userData?.partId;
  if (partId) selectPart(partId);
});

document.querySelector('#toggle-rotate').addEventListener('click', (event) => {
  state.autoRotate = !state.autoRotate;
  event.currentTarget.textContent = `자동 회전 ${state.autoRotate ? '켬' : '끔'}`;
  event.currentTarget.setAttribute('aria-pressed', String(state.autoRotate));
});

document.querySelector('#toggle-view').addEventListener('click', (event) => {
  state.viewMode = state.viewMode === 'open' ? 'closed' : 'open';
  event.currentTarget.textContent = state.viewMode === 'open' ? '완성 상태 보기' : '파츠 분리 보기';
  document.querySelector('#view-title').textContent = state.viewMode === 'open' ? '파츠 분리 보기' : '완성 상태 보기';
  updateModelLayout();
});

document.querySelector('#copy-link').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(location.href);
    showFeedback('조합 링크를 복사했습니다.');
  } catch {
    showFeedback('주소창의 링크를 직접 복사해 주세요.');
  }
});

document.querySelector('#save-image').addEventListener('click', () => {
  renderer.render(scene, camera);
  canvas.toBlob((blob) => {
    if (!blob) return;
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `${combinationCode()}.png`;
    anchor.click();
    URL.revokeObjectURL(anchor.href);
    showFeedback('현재 3D 화면을 이미지로 저장했습니다.');
  }, 'image/png');
});

document.querySelector('#reset-combination').addEventListener('click', () => {
  state.selections = { ...defaultSelection };
  state.activePartId = parts[0].id;
  setQueryString();
  applyAllColors();
  renderControls();
  showFeedback('기본 조합으로 초기화했습니다.');
});

renderControls();
resizeRenderer();
function animate() {
  controls.autoRotate = state.autoRotate;
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
