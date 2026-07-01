import { INK_PRODUCTS } from './ink-products-data.js';

const omasDecantSeries = {
  id: 'omas-75ml',
  brandKo: '오마스',
  brandEn: 'OMAS',
  productKo: '병잉크 75ml',
  productEn: '75 ml Bottle Ink',
  price5: null,
  price10: null,
  color: '#6f4a8e',
  keywords: ['오마스', 'omas', '75ml'],
};

if (!INK_PRODUCTS.some((item) => item.id === omasDecantSeries.id)) {
  INK_PRODUCTS.push(omasDecantSeries);
}
