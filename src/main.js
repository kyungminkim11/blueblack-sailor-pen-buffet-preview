import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { parts, colors, defaultSelection } from './data.js';
import { buildPenModel } from './pen-model.js';
import {
  getLanguage,
  initI18n,
  localizeColor,
  localizePart,
  t,
} from './i18n.js';
import { initUiEnhancements, refreshUiEnhancements } from './ui-enhancements.js';
import { renderStoreGuide } from './store-guide.js';

initI18n();

const mobileMedia = window.matchMedia('(max-width: 640px)');
const state = {
  activePartId: parts[0].id,
  selections: { ...defaultSelection },
  viewMode: mobileMedia.matches ? 'closed' : 'open',
  autoRotate: true,
  fullscreen: false,
  root: null,
  groups: null,
  partMeshes: new Map(),
};

const initialParams = new URLSearchParams(location.search);
const legacyKeys = { cap_end: 'cap_top', nib_grip: 'grip_section' };
for (const part of parts) {
  const value = initialParams.get(part.id) ?? initialParams.get(legacyKeys[part.id]);
  if (colors.some((color) => color.id === value && color.group === part.colorGroup)) {
    state.selections[part.id] = value;
  }
}

const $ = (selector) => document.querySelector(selector);
const canvas = $('#pen-canvas');
const canvasWrap = $('#canvas-wrap');
const viewerCard = $('.viewer-card');
const loadingPanel = $('#loading-panel');
const modelError = $('#model-error');
const partTabs = $('#part-tabs');
const swatchGrid = $('#swatch-grid');
const summaryList = $('#summary-list');
const copyFeedback = $('#copy-feedback');
const fullscreenButton = $('#toggle-fullscreen');
const resetCameraButton = $('#reset-camera');

const viewerButtonText = {
  ko: { enlarge: '크게 보기', close: '크게 보기 닫기', reset: '시점 초기화' },
  en: { enlarge: 'Open large view', close: 'Close large view', reset: 'Reset view' },
  ja: { enlarge: '大きく見る', close: '拡大表示を閉じる', reset: '視点をリセット' },
};

function currentViewerText() {
  return viewerButtonText[getLanguage()] ?? viewerButtonText.ko;
}

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  preserveDrawingBuffer: true,
});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 2000);

const pmrem = new THREE.PMREMGenerator(renderer);
const room = new RoomEnvironment();
scene.environment = pmrem.fromScene(room, 0.04).texture;
room.dispose();
pmrem.dispose();

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.065;
controls.enablePan = false;
controls.minDistance = 80;
controls.maxDistance = 360;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

scene.add(new THREE.HemisphereLight(0xffffff, 0x8e9aaa, 2.05));
for (const [color, intensity, position] of [
  [0xffffff, 3.1, [45, 70, 85]],
  [0xc6dbff, 1.45, [-55, 18, 50]],
  [0xffebca, 1.2, [20, -25, -50]],
]) {
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(...position);
  scene.add(light);
}

const ground = new THREE.Mesh(
  new THREE.CircleGeometry(124, 96),
  new THREE.ShadowMaterial({ color: 0x263548, opacity: 0.11 }),
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -24;
ground.receiveShadow = true;
scene.add(ground);

const materials = {
  fixedMetal: new THREE.MeshStandardMaterial({
    color: 0xc8ccd1,
    metalness: 0.92,
    roughness: 0.18,
    envMapIntensity: 1.15,
  }),
  darkMetal: new THREE.MeshStandardMaterial({ color: 0x555b63, metalness: 0.65, roughness: 0.25 }),
  feedMaterial: new THREE.MeshStandardMaterial({ color: 0x16181c, roughness: 0.34 }),
  darkInset: new THREE.MeshStandardMaterial({ color: 0x111318, roughness: 0.42 }),
  customMaterial: () => new THREE.MeshPhysicalMaterial({
    color: 0xdce8ee,
    roughness: 0.12,
    metalness: 0,
    clearcoat: 0.68,
    clearcoatRoughness: 0.08,
    transparent: true,
    opacity: 1,
    transmission: 0.45,
    thickness: 1.2,
    ior: 1.47,
    attenuationDistance: 1.2,
    attenuationColor: new THREE.Color('#dce8ee'),
    envMapIntensity: 1.1,
    side: THREE.FrontSide,
  }),
};

function getColor(colorId) {
  return colors.find((color) => color.id === colorId) ?? colors[0];
}

function allSelectableMeshes() {
  return [...state.partMeshes.values()].flat();
}

function resetGroupTransforms() {
  if (!state.groups) return;
  for (const group of Object.values(state.groups)) {
    group.position.set(0, 0, 0);
    group.rotation.set(0, 0, 0);
  }
}

function applyResponsiveOrientation() {
  if (!state.root) return;
  state.root.rotation.z = mobileMedia.matches ? Math.PI / 2 : 0;
}

function fitCameraToModel() {
  if (!state.root) return;

  scene.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(state.root);
  if (box.isEmpty()) return;

  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const verticalFov = THREE.MathUtils.degToRad(camera.fov);
  const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
  const distanceForHeight = size.y / (2 * Math.tan(verticalFov / 2));
  const distanceForWidth = size.x / (2 * Math.tan(horizontalFov / 2));
  const padding = state.fullscreen ? 1.12 : mobileMedia.matches ? 1.18 : 1.25;
  const distance = Math.max(distanceForHeight, distanceForWidth, size.z * 2.4) * padding;
  const elevation = mobileMedia.matches ? 0.04 : 0.12;

  camera.position.set(center.x, center.y + distance * elevation, center.z + distance);
  camera.near = Math.max(0.1, distance / 150);
  camera.far = Math.max(1000, distance * 8);
  camera.updateProjectionMatrix();

  controls.target.copy(center);
  controls.minDistance = Math.max(45, distance * 0.48);
  controls.maxDistance = Math.max(280, distance * 2.4);
  controls.update();
}

function updateModelLayout() {
  if (!state.groups) return;
  const { capEndGroup, capBodyGroup, nibGripGroup, barrelGroup, barrelEndGroup } = state.groups;
  resetGroupTransforms();
  applyResponsiveOrientation();

  if (state.viewMode === 'open') {
    capEndGroup.position.set(-8, 30, 0);
    capBodyGroup.position.set(8, 30, 0);
    nibGripGroup.position.set(-8, -7, 0);
    barrelGroup.position.set(8, -7, 0);
    barrelEndGroup.position.set(21, -7, 0);
    state.root.position.set(-6, -3, 0);
    ground.position.y = -28;
  } else {
    capEndGroup.position.set(22.2, 0, 0);
    capBodyGroup.position.set(22.2, 0, 0);
    state.root.position.set(-8, 0, 0);
    ground.position.y = -13;
  }

  requestAnimationFrame(() => {
    resizeRenderer();
    fitCameraToModel();
  });
  updateViewerLabels();
}

function paintMesh(mesh, color, active, isMetal) {
  const material = mesh.material;

  if (isMetal) {
    material.color.set(color.hex);
    material.metalness = color.metalness ?? 0.9;
    material.roughness = color.roughness ?? 0.2;
    material.clearcoat = 0.18;
    material.clearcoatRoughness = 0.2;
    material.transparent = false;
    material.opacity = 1;
    material.transmission = 0;
    material.depthWrite = true;
    material.side = THREE.FrontSide;
    material.envMapIntensity = 1.2;
  } else {
    const surfaceColor = new THREE.Color(color.hex);
    material.color.copy(surfaceColor);
    material.metalness = 0;
    material.roughness = color.roughness ?? 0.12;
    material.clearcoat = 0.68;
    material.clearcoatRoughness = 0.08;
    material.transparent = true;
    material.opacity = 1;
    material.transmission = color.transmission ?? 0.45;
    material.thickness = color.thickness ?? 1.2;
    material.ior = 1.47;
    material.attenuationColor.copy(surfaceColor);
    material.attenuationDistance = color.attenuationDistance ?? 1.2;
    material.specularIntensity = 0.72;
    material.envMapIntensity = 1.05;
    material.depthWrite = true;
    material.side = THREE.FrontSide;
  }

  material.emissive = new THREE.Color(active ? color.hex : '#000000');
  material.emissiveIntensity = active ? 0.025 : 0;
  material.needsUpdate = true;
}

function applyAllColors() {
  for (const part of parts) {
    const color = getColor(state.selections[part.id]);
    for (const mesh of state.partMeshes.get(part.id) ?? []) {
      paintMesh(mesh, color, state.activePartId === part.id, part.colorGroup === 'metal');
    }
  }
}

function saveQueryString() {
  const query = new URLSearchParams(location.search);
  query.set('lang', getLanguage());
  for (const part of parts) query.set(part.id, state.selections[part.id]);
  history.replaceState(null, '', `${location.pathname}?${query.toString()}`);
}

function combinationCode() {
  return `BB-SAILOR-${parts.map((part) => getColor(state.selections[part.id]).code).join('-')}`;
}

function selectPart(partId) {
  state.activePartId = partId;
  applyAllColors();
  renderControls();
}

function renderPartTabs() {
  partTabs.replaceChildren(...parts.map((part, index) => {
    const localized = localizePart(part);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'part-tab';
    button.role = 'tab';
    button.textContent = `${index + 1}. ${localized.name}`;
    button.setAttribute('aria-selected', String(state.activePartId === part.id));
    button.addEventListener('click', () => selectPart(part.id));
    return button;
  }));
}

function renderSwatches() {
  const activePart = parts.find((part) => part.id === state.activePartId);
  const activeColorId = state.selections[activePart.id];
  const availableColors = colors.filter((color) => color.group === activePart.colorGroup);

  swatchGrid.replaceChildren(...availableColors.map((color) => {
    const colorName = localizeColor(color);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'swatch-button';
    button.role = 'radio';
    button.setAttribute('aria-checked', String(activeColorId === color.id));
    button.setAttribute('aria-label', `${colorName}${color.isNew ? ` · ${t('badge.new')}` : ''}`);
    button.innerHTML = `
      <span class="swatch-circle${color.transparent ? ' transparent' : ''}" style="background:${color.hex}"></span>
      <span>${colorName}</span>
      ${color.isNew ? `<small class="new-badge">${t('badge.new')}</small>` : ''}
    `;
    button.addEventListener('click', () => {
      state.selections[activePart.id] = color.id;
      saveQueryString();
      applyAllColors();
      renderControls();
    });
    return button;
  }));
}

function renderSummary() {
  summaryList.replaceChildren(...parts.map((part) => {
    const localized = localizePart(part);
    const color = getColor(state.selections[part.id]);
    const item = document.createElement('div');
    item.className = 'summary-item';
    item.innerHTML = `
      <span class="summary-dot" style="background:${color.hex}"></span>
      <div><small>${localized.name}</small><b>${localizeColor(color)}${color.isNew ? ` · ${t('badge.new')}` : ''}</b></div>
    `;
    return item;
  }));
  $('#combination-code').textContent = combinationCode();
}

function renderControls() {
  const activeIndex = parts.findIndex((part) => part.id === state.activePartId);
  const part = parts[activeIndex];
  const localized = localizePart(part);
  const color = getColor(state.selections[part.id]);

  $('#progress-text').textContent = `${activeIndex + 1} / ${parts.length}`;
  $('#part-name-en').textContent = part.nameEn.toUpperCase();
  $('#part-name-ko').textContent = localized.name;
  $('#part-description').textContent = localized.description;
  $('#selected-color-name').textContent = `${localizeColor(color)}${color.isNew ? ` · ${t('badge.new')}` : ''}`;
  $('#selected-color-dot').style.background = color.hex;

  renderPartTabs();
  renderSwatches();
  renderSummary();
}

function updateViewerLabels() {
  const extraText = currentViewerText();
  $('#view-title').textContent = state.viewMode === 'open' ? t('viewer.openTitle') : t('viewer.closedTitle');
  $('#toggle-rotate').textContent = state.autoRotate ? t('viewer.autoOn') : t('viewer.autoOff');
  $('#toggle-view').textContent = state.viewMode === 'open' ? t('viewer.showClosed') : t('viewer.showOpen');
  fullscreenButton.textContent = state.fullscreen ? extraText.close : extraText.enlarge;
  resetCameraButton.textContent = extraText.reset;
}

function resizeRenderer() {
  const width = canvasWrap.clientWidth;
  const height = canvasWrap.clientHeight;
  if (!width || !height) return;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function resetCameraView() {
  applyResponsiveOrientation();
  requestAnimationFrame(() => {
    resizeRenderer();
    fitCameraToModel();
  });
}

function setViewerFullscreen(enabled) {
  state.fullscreen = enabled;
  viewerCard.classList.toggle('is-fullscreen', enabled);
  document.body.classList.toggle('viewer-fullscreen-open', enabled);
  fullscreenButton.setAttribute('aria-pressed', String(enabled));
  updateViewerLabels();
  requestAnimationFrame(() => {
    resizeRenderer();
    fitCameraToModel();
  });
}

function showFeedback(message) {
  copyFeedback.textContent = message;
  window.setTimeout(() => {
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

renderControls();
renderStoreGuide(t);
initUiEnhancements(t);
updateViewerLabels();
resizeRenderer();

window.addEventListener('languagechange', () => {
  renderControls();
  renderStoreGuide(t);
  refreshUiEnhancements(t);
  updateViewerLabels();
});

new ResizeObserver(() => {
  resizeRenderer();
}).observe(canvasWrap);

mobileMedia.addEventListener('change', () => {
  if (!state.root) return;
  state.viewMode = mobileMedia.matches ? 'closed' : state.viewMode;
  updateModelLayout();
});

window.addEventListener('orientationchange', () => {
  window.setTimeout(resetCameraView, 220);
});

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
canvas.addEventListener('pointerup', (event) => {
  if (!state.root || event.pointerType === 'touch') return;
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects(allSelectableMeshes(), false)[0];
  const partId = hit?.object?.userData?.partId;
  if (partId) selectPart(partId);
});

canvas.addEventListener('pointerdown', () => {
  if (!state.autoRotate) return;
  state.autoRotate = false;
  $('#toggle-rotate').setAttribute('aria-pressed', 'false');
  updateViewerLabels();
});

let lastTouchAt = 0;
canvas.addEventListener('touchend', () => {
  const now = Date.now();
  if (now - lastTouchAt < 320) resetCameraView();
  lastTouchAt = now;
}, { passive: true });

$('#toggle-rotate').addEventListener('click', (event) => {
  state.autoRotate = !state.autoRotate;
  event.currentTarget.setAttribute('aria-pressed', String(state.autoRotate));
  updateViewerLabels();
});

$('#toggle-view').addEventListener('click', () => {
  state.viewMode = state.viewMode === 'open' ? 'closed' : 'open';
  updateModelLayout();
});

fullscreenButton.addEventListener('click', () => {
  setViewerFullscreen(!state.fullscreen);
});

resetCameraButton.addEventListener('click', resetCameraView);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && state.fullscreen) setViewerFullscreen(false);
});

$('#copy-link').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(location.href);
    showFeedback(t('toast.linkCopied'));
  } catch {
    showFeedback(t('toast.linkFailed'));
  }
});

$('#save-image').addEventListener('click', () => {
  renderer.render(scene, camera);
  canvas.toBlob((blob) => {
    if (!blob) return;
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `${combinationCode()}.png`;
    anchor.click();
    URL.revokeObjectURL(anchor.href);
    showFeedback(t('toast.imageSaved'));
  }, 'image/png');
});

$('#reset-combination').addEventListener('click', () => {
  state.selections = { ...defaultSelection };
  state.activePartId = parts[0].id;
  saveQueryString();
  applyAllColors();
  renderControls();
  showFeedback(t('toast.reset'));
});

(function animate() {
  controls.autoRotate = state.autoRotate;
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
})();
