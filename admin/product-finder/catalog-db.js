const DATABASE_NAME = 'blueblack-product-finder';
const DATABASE_VERSION = 1;
const STORE_NAME = 'catalog';

export const CATALOG_KEY = 'products-v1';
export const META_KEY = 'meta-v1';

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
