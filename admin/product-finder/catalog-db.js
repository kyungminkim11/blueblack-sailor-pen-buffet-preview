export async function loadBuiltInCatalog() {
  const response = await fetch('./product-catalog.json');
  if (!response.ok) throw new Error('기본 상품 DB를 불러오지 못했습니다.');
  return response.json();
}
