import { INK_PRODUCTS } from './ink-products-data.js';

const super5 = INK_PRODUCTS.find((item) => item.id === 'super5-standard');
if (super5) {
  super5.keywords = [...new Set([
    ...(super5.keywords || []),
    '피그먼트',
    '방수',
    '내광성',
    'pigment',
    'waterproof',
    'lightfast',
  ])];
}
