const CATALOG_PARTS = 8;

export async function loadBuiltInCatalog() {
  const requests = Array.from({ length: CATALOG_PARTS }, (_, index) =>
    fetch(`./data/catalog-${index + 1}.txt`).then((response) => {
      if (!response.ok) throw new Error('기본 상품 DB 파일이 없습니다.');
      return response.text();
    })
  );

  const encoded = (await Promise.all(requests)).join('').replace(/\s+/g, '');
  const binary = atob(encoded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  const json = await new Response(stream).text();
  return JSON.parse(json);
}
