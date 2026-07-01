const STORAGE_MODULE_URL = 'https://cdn.jsdelivr.net/npm/idb-keyval@6.2.1/+esm';
const STORAGE_KEY = 'blueblack-product-catalog-v1';

async function storage() {
  return import(STORAGE_MODULE_URL);
}

export async function loadBuiltInCatalog() {
  const { get } = await storage();
  const saved = await get(STORAGE_KEY);

  return saved || {
    version: 1,
    updatedAt: null,
    sourceName: '',
    sourceDate: '',
    products: []
  };
}

export async function saveCatalog(catalog) {
  const { set } = await storage();
  await set(STORAGE_KEY, catalog);
}

export async function removeCatalog() {
  const { del } = await storage();
  await del(STORAGE_KEY);
}
