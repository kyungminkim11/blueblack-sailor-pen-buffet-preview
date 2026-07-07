import { seedBundledPhotos } from './admin-360-bundled-seed.js';

async function start360Admin(){
  try{await seedBundledPhotos();}catch(error){console.warn('Bundled 360 photo seed failed',error);}
  await import('./admin-360-roadview-v2.js');
  await import('./admin-360-panorama-addon.js');
  await import('./admin-360-batch-addon.js');
}

start360Admin();
