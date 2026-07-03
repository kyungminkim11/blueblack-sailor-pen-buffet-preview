import { nibRpc } from './nib-db-api.js';

const storageName = ['blueblack', 'product', 'access', 'key'].join('-');

export function searchNibProducts(parameters) {
  sessionStorage.setItem(storageName, 'open');
  return nibRpc('public_nib_search_open', parameters);
}
