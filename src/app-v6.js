import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { parts, colors, defaultSelection } from './data.js';
import { buildPenModel } from './pen-model.js';
import { getLanguage, initializeLanguage, localizeColor, localizePart, setLanguage, t } from './i18n-v3.js';

const STORE = {
  addressKo: '서울특별시 종로구 사직로 109 (내자동)',
  addressEn: '109 Sajik-ro, Jongno-gu, Seoul (Naeja-dong)',
  addressJa: 'ソウル特別市 鍾路区 社稷路109（内資洞）',
  phone: '02-765-8868',
};

initializeLanguage();

const mobileMedia = window.matchMedia('(max-width: 699px)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const state = {
  activePartId: parts[0].id,
  selections: { ...defaultSelection },
  viewMode: 'assembled',
  fullscreen: false,
  root: null,
  groups: null,
  partMeshes: new Map(),
};

const legacyKeys = { cap_end: 'cap_top', nib_grip: 'grip_section' };
const initialQuery = new URLSearchParams(location.search);
for (const part of parts) {
  const value = initialQuery.get(part.id) ?? initialQuery.get(legacyKeys[part.id]);
  if (colors.some((color) => color.id === value && color.group === part.colorGroup)) state.selections[part.id] = value;
}

const $ = (selector) => document.querySelector(selector);
const viewerCard = $('#viewer-card');
const canvasWrap = $('#viewer-stage');
const canvas = $('#pen-canvas');
const loading = $('#viewer-loading');
const error = $('#viewer-error');
const fallback = $('#static-pen-fallback');
const partGrid = $('#part-grid');
const palette = $('#palette');
const summary = $('#summary-list');
const staffSummary = $('#staff-summary');
const staffDialog = $('#staff-dialog');
const toast = $('#toast');

function getColor(id) {
  return colors.find((color) => color.id === id) ?? colors[0];
}

function saveQuery() {
  const query = new URLSearchParams(location.search);
  query.set('lang', getLanguage());
  for (const part of parts) query.set(part.id, state.selections[part.id]);
  history.replaceState(null, '', `${location.pathname}?${query}`);
  localStorage.setItem('blueblack-pen-combination-query', query.toString());
  window.dispatchEvent(new CustomEvent('combinationchange', { detail: { ...state.selections } }));
}

function storeAddress() {
  if (getLanguage() === 'en') return STORE.addressEn;
  if (getLanguage() === 'ja') return STORE.addressJa;
  return STORE.addressKo;
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    if (toast.textContent === message) toast.textContent = '';
  }, 2600);
}

function renderStaticText() {
  document.title = t('title');
  document.querySelectorAll('[data-t]').forEach((element) => {
    element.textContent = t(element.dataset.t);
  });
  document.querySelectorAll('[data-language]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.language === getLanguage()));
  });
  $('#progress-pill').textContent = t('partProgress', {
    current: String(parts.findIndex((part) => part.id === state.activePartId) + 1),
    total: String(parts.length),
  });
  $('#viewer-mode').textContent = state.viewMode === 'assembled' ? t('assembled') : t('exploded');
  $('#toggle-view').textContent = state.viewMode === 'assembled' ? t('exploded') : t('assembled');
  $('#toggle-fullscreen').textContent = state.fullscreen ? t('close') : t('largeView');
  $('#store-address').textContent = storeAddress();
  $('#store-phone').textContent = STORE.phone;
  updateViewerPartLabel();
}

function updateViewerPartLabel() {
  let badge = $('#viewer-active-part');
  if (!badge) {
    badge = document.createElement('div');
    badge.id = 'viewer-active-part';
    badge.className = 'viewer-active-part';
    canvasWrap.append(badge);
  }
  const part = parts.find((item) => item.id === state.activePartId);
  badge.innerHTML = `<small>${getLanguage() === 'ja' ? '選択中' : getLanguage() === 'en' ? 'SELECTING' : '현재 선택 중'}</small><strong>${localizePart(part).name}</strong>`;
}

function renderParts() {
  partGrid.replaceChildren(...parts.map((part, index) => {
    const { name } = localizePart(part);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'part-button';
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', String(part.id === state.activePartId));
    button.textContent = `${index + 1}. ${name}`;
    button.addEventListener('click', () => selectPart(part.id, true));
    return button;
  }));
}

function makeSwatch(color, part) {
  const name = localizeColor(color);
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'swatch';
  button.setAttribute('role', 'radio');
  button.setAttribute('aria-checked', String(state.selections[part.id] === color.id));
  button.setAttribute('aria-label', name);
  button.innerHTML = `
    ${color.isNew ? '<span class="new-tag">NEW</span>' : ''}
    <span class="swatch-check">✓</span>
    <span class="swatch-dot" style="background:${color.hex}"></span>
    <span>${name}</span>
  `;
  button.addEventListener('click', () => {
    state.selections[part.id] = color.id;
    saveQuery();
    applyColors();
    renderCustomizer();
    pulseActivePart();
  });
  return button;
}

function paletteGroup(title, caption, list, part) {
  const section = document.createElement('section');
  section.className = 'palette-group';
  section.innerHTML = `<div class="palette-heading"><b>${title}</b><span>${caption}</span></div>`;
  const grid = document.createElement('div');
  grid.className = 'swatch-grid';
  grid.setAttribute('role', 'radiogroup');
  grid.append(...list.map((color) => makeSwatch(color, part)));
  section.append(grid);
  return section;
}

function renderPalette() {
  const part = parts.find((item) => item.id === state.activePartId);
  const list = colors.filter((color) => color.group === part.colorGroup);
  if (part.colorGroup === 'metal') {
    palette.replaceChildren(paletteGroup(t('metalColors'), String(list.length), list, part));
    return;
  }
  const original = list.filter((color) => !color.isNew);
  const newer = list.filter((color) => color.isNew);
  palette.replaceChildren(
    paletteGroup(t('originalColors'), String(original.length), original, part),
    paletteGroup(t('newColors'), String(newer.length), newer, part),
  );
}

function summaryItems(target) {
  target.replaceChildren(...parts.map((part) => {
    const color = getColor(state.selections[part.id]);
    const item = document.createElement('div');
    item.className = 'summary-item';
    item.dataset.partId = part.id;
    item.innerHTML = `
      <span class="swatch-dot" style="background:${color.hex}"></span>
      <div><small>${localizePart(part).name}</small><b>${localizeColor(color)}</b></div>
    `;
    return item;
  }));
}

function renderCustomizer() {
  const index = parts.findIndex((part) => part.id === state.activePartId);
  const part = parts[index];
  const localized = localizePart(part);
  const color = getColor(state.selections[part.id]);

  $('#part-name-en').textContent = part.nameEn.toUpperCase();
  $('#part-name').textContent = localized.name;
  $('#part-description').textContent = localized.description;
  $('#selected-dot').style.background = color.hex;
  $('#selected-color').textContent = localizeColor(color);
  $('#previous-part').disabled = index === 0;
  $('#next-part').textContent = index === parts.length - 1 ? t('finishSelection') : t('nextPart');

  renderStaticText();
  renderParts();
  renderPalette();
  summaryItems(summary);
  summaryItems(staffSummary);
}

function selectPart(id, focus = false) {
  state.activePartId = id;
  applyColors();
  renderCustomizer();
  if (focus) requestAnimationFrame(focusActivePart);
}

function movePart(direction) {
  const index = parts.findIndex((part) => part.id === state.activePartId);
  const next = index + direction;
  if (next >= 0 && next < parts.length) {
    selectPart(parts[next].id, true);
    $('.control-card').scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
  } else if (direction > 0) {
    $('#result-section').scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
  }
}

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
} catch (exception) {
  console.error(exception);
  loading.hidden = true;
  error.hidden = false;
  fallback?.classList.add('is-visible');
  throw exception;
}
renderer.setPixelRatio(Math.min(devicePixelRatio, mobileMedia.matches ? 1.2 : 1.65));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.shadowMap.enabled = !mobileMedia.matches;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 2000);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.enablePan = false;
controls.minDistance = 60;
controls.maxDistance = 380;
controls.autoRotate = !reducedMotion.matches;
controls.autoRotateSpeed = 0.42;

const pmrem = new THREE.PMREMGenerator(renderer);
const room = new RoomEnvironment();
scene.environment = pmrem.fromScene(room, 0.04).texture;
room.dispose();
pmrem.dispose();
scene.add(new THREE.HemisphereLight(0xffffff, 0x8896a8, 2));
for (const [color, intensity, position] of [
  [0xffffff, 3, [45, 70, 85]],
  [0xc8dcff, 1.35, [-55, 18, 50]],
  [0xffedcf, 1.05, [20, -25, -50]],
]) {
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(...position);
  scene.add(light);
}

const ground = new THREE.Mesh(
  new THREE.CircleGeometry(130, 80),
  new THREE.ShadowMaterial({ color: 0x263548, opacity: 0.1 }),
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -22;
ground.receiveShadow = true;
scene.add(ground);

const materials = {
  fixedMetal: new THREE.MeshStandardMaterial({ color: 0xc8ccd1, metalness: 0.92, roughness: 0.18, envMapIntensity: 1.15 }),
  darkMetal: new THREE.MeshStandardMaterial({ color: 0x555b63, metalness: 0.65, roughness: 0.25 }),
  feedMaterial: new THREE.MeshStandardMaterial({ color: 0x16181c, roughness: 0.34 }),
  darkInset: new THREE.MeshStandardMaterial({ color: 0x111318, roughness: 0.42 }),
  customMaterial: () => new THREE.MeshPhysicalMaterial({
    color: 0xdce8ee, roughness: 0.12, metalness: 0, clearcoat: 0.68, clearcoatRoughness: 0.08,
    transparent: true, opacity: 1, transmission: 0.45, thickness: 1.2, ior: 1.47,
    attenuationDistance: 1.2, attenuationColor: new THREE.Color('#dce8ee'), envMapIntensity: 1.05,
  }),
};

const partTuning = {
  cap_body: { transmission: 0.96, thickness: 1.08 },
  cap_end: { transmission: 0.78, thickness: 1.28 },
  nib_grip: { transmission: 0.72, thickness: 1.16 },
  barrel_body: { transmission: 0.92, thickness: 1.12 },
  barrel_end: { transmission: 0.76, thickness: 1.3 },
};

function paintMesh(mesh, color, part, active) {
  const material = mesh.material;
  if (part.colorGroup === 'metal') {
    material.color.set(color.hex);
    material.metalness = color.metalness ?? 0.9;
    material.roughness = color.roughness ?? 0.2;
    material.transparent = false;
    material.opacity = 1;
    material.transmission = 0;
    material.envMapIntensity = 1.18;
  } else {
    const surface = new THREE.Color(color.hex);
    const tuning = partTuning[part.id] ?? { transmission: 1, thickness: 1 };
    material.color.copy(surface);
    material.metalness = 0;
    material.roughness = color.roughness ?? 0.12;
    material.clearcoat = 0.68;
    material.clearcoatRoughness = 0.08;
    material.transparent = true;
    material.opacity = 1;
    material.transmission = Math.min(0.9, (color.transmission ?? 0.45) * tuning.transmission);
    material.thickness = (color.thickness ?? 1.2) * tuning.thickness;
    material.ior = 1.47;
    material.attenuationColor.copy(surface);
    material.attenuationDistance = color.attenuationDistance ?? 1.2;
    material.specularIntensity = 0.72;
    material.envMapIntensity = active ? 1.22 : 0.96;
  }
  material.emissive = new THREE.Color(active ? color.hex : '#000000');
  material.emissiveIntensity = active ? 0.09 : 0;
  material.needsUpdate = true;
}

function applyColors() {
  if (!state.root) return;
  for (const part of parts) {
    const color = getColor(state.selections[part.id]);
    for (const mesh of state.partMeshes.get(part.id) ?? []) paintMesh(mesh, color, part, part.id === state.activePartId);
  }
}

function pulseActivePart() {
  viewerCard.classList.remove('part-change-pulse');
  requestAnimationFrame(() => viewerCard.classList.add('part-change-pulse'));
  window.setTimeout(() => viewerCard.classList.remove('part-change-pulse'), 420);
}

function resetTransforms() {
  if (!state.groups) return;
  for (const group of Object.values(state.groups)) group.position.set(0, 0, 0);
}

function applyLayout() {
  if (!state.root || !state.groups) return;
  resetTransforms();
  const { capEndGroup, capBodyGroup, nibGripGroup, barrelGroup, barrelEndGroup } = state.groups;
  state.root.rotation.z = mobileMedia.matches ? Math.PI / 2 : 0;
  if (state.viewMode === 'exploded') {
    capEndGroup.position.set(-8, 30, 0);
    capBodyGroup.position.set(8, 30, 0);
    nibGripGroup.position.set(-8, -7, 0);
    barrelGroup.position.set(8, -7, 0);
    barrelEndGroup.position.set(21, -7, 0);
    state.root.position.set(-6, -3, 0);
  } else {
    capEndGroup.position.set(22.2, 0, 0);
    capBodyGroup.position.set(22.2, 0, 0);
    state.root.position.set(-8, 0, 0);
  }
  requestAnimationFrame(resetCamera);
  renderStaticText();
}

function resizeRenderer() {
  const width = canvasWrap.clientWidth;
  const height = canvasWrap.clientHeight;
  if (!width || !height) return;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function wholeModelBounds() {
  scene.updateMatrixWorld(true);
  return new THREE.Box3().setFromObject(state.root);
}

function resetCamera() {
  if (!state.root) return;
  resizeRenderer();
  const box = wholeModelBounds();
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
  const distance = Math.max(size.y / (2 * Math.tan(vFov / 2)), size.x / (2 * Math.tan(hFov / 2)), size.z * 2.2) * (state.fullscreen ? 1.08 : 1.18);
  camera.position.set(center.x, center.y + distance * 0.05, center.z + distance);
  controls.target.copy(center);
  controls.minDistance = Math.max(40, distance * 0.45);
  controls.maxDistance = Math.max(260, distance * 2.5);
  controls.update();
}

function focusActivePart() {
  if (!state.root) return;
  const meshes = state.partMeshes.get(state.activePartId) ?? [];
  if (!meshes.length) return;
  scene.updateMatrixWorld(true);
  const activeBox = new THREE.Box3();
  for (const mesh of meshes) activeBox.expandByObject(mesh);
  if (activeBox.isEmpty()) return;
  const wholeCenter = wholeModelBounds().getCenter(new THREE.Vector3());
  const activeCenter = activeBox.getCenter(new THREE.Vector3());
  const desired = wholeCenter.clone().lerp(activeCenter, state.activePartId === 'metal_parts' ? 0.16 : 0.32);
  const offset = camera.position.clone().sub(controls.target);
  controls.target.lerp(desired, 0.75);
  camera.position.copy(controls.target).add(offset.multiplyScalar(0.94));
  controls.update();
  pulseActivePart();
}

function zoom(factor) {
  const offset = camera.position.clone().sub(controls.target).multiplyScalar(factor);
  const distance = offset.length();
  if (distance < controls.minDistance || distance > controls.maxDistance) return;
  camera.position.copy(controls.target).add(offset);
  controls.update();
}

function setFullscreen(enabled) {
  state.fullscreen = enabled;
  viewerCard.classList.toggle('viewer-fullscreen', enabled);
  document.body.style.overflow = enabled ? 'hidden' : '';
  renderStaticText();
  requestAnimationFrame(resetCamera);
}

function toggleView() {
  state.viewMode = state.viewMode === 'assembled' ? 'exploded' : 'assembled';
  applyLayout();
}

let rendering = true;
let viewerVisible = true;
function animate() {
  if (!rendering) return;
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
function updateRendering() {
  const shouldRender = viewerVisible && !document.hidden;
  if (shouldRender && !rendering) {
    rendering = true;
    animate();
  } else if (!shouldRender) {
    rendering = false;
  }
}

try {
  const model = buildPenModel(materials);
  state.root = model.root;
  state.groups = model.groups;
  state.partMeshes = model.partMeshes;
  scene.add(state.root);
  applyLayout();
  applyColors();
  loading.hidden = true;
  fallback?.classList.remove('is-visible');
  window.dispatchEvent(new CustomEvent('penviewerready'));
} catch (exception) {
  console.error(exception);
  loading.hidden = true;
  error.hidden = false;
  fallback?.classList.add('is-visible');
}

new ResizeObserver(() => {
  resizeRenderer();
  if (state.root) resetCamera();
}).observe(canvasWrap);

new IntersectionObserver((entries) => {
  viewerVisible = entries[0]?.isIntersecting ?? true;
  updateRendering();
}, { threshold: 0.01 }).observe(viewerCard);
document.addEventListener('visibilitychange', updateRendering);
mobileMedia.addEventListener('change', () => {
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobileMedia.matches ? 1.2 : 1.65));
  renderer.shadowMap.enabled = !mobileMedia.matches;
  applyLayout();
});

function shareCombination() {
  const data = { title: t('title'), text: t('resultTitle'), url: location.href };
  if (navigator.share) navigator.share(data).then(() => showToast(t('shared'))).catch(() => {});
  else navigator.clipboard.writeText(location.href).then(() => showToast(t('copied'))).catch(() => showToast(location.href));
}

function saveImage() {
  renderer.render(scene, camera);
  canvas.toBlob((blob) => {
    if (!blob) return;
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = 'blueblack-pen-combination.png';
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(anchor.href), 1000);
    showToast(t('imageSaved'));
  }, 'image/png');
}

function resetCombination() {
  state.selections = { ...defaultSelection };
  state.activePartId = parts[0].id;
  saveQuery();
  applyColors();
  renderCustomizer();
  resetCamera();
  showToast(t('resetDone'));
  $('.control-card').scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
}

for (const button of document.querySelectorAll('[data-language]')) {
  button.addEventListener('click', () => {
    setLanguage(button.dataset.language);
    saveQuery();
    renderCustomizer();
  });
}
$('#toggle-view').addEventListener('click', toggleView);
$('#toggle-fullscreen').addEventListener('click', () => setFullscreen(!state.fullscreen));
$('#fullscreen-close').addEventListener('click', () => setFullscreen(false));
$('#reset-view').addEventListener('click', resetCamera);
$('#zoom-in').addEventListener('click', () => zoom(0.82));
$('#zoom-out').addEventListener('click', () => zoom(1.22));
$('#previous-part').addEventListener('click', () => movePart(-1));
$('#next-part').addEventListener('click', () => movePart(1));
$('#share-combination').addEventListener('click', shareCombination);
$('#save-image').addEventListener('click', saveImage);
$('#reset-combination').addEventListener('click', resetCombination);
$('#staff-view').addEventListener('click', () => staffDialog.showModal());
$('#staff-close').addEventListener('click', () => staffDialog.close());
staffDialog.addEventListener('click', (event) => {
  if (event.target === staffDialog) staffDialog.close();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && state.fullscreen) setFullscreen(false);
});
canvas.addEventListener('pointerdown', () => { controls.autoRotate = false; }, { once: true });

renderCustomizer();
renderStaticText();
resizeRenderer();
animate();
window.blueblackPenApp = {
  get selections() { return { ...state.selections }; },
  get activePartId() { return state.activePartId; },
  selectPart,
  resetCombination,
  render: () => renderer.render(scene, camera),
};
