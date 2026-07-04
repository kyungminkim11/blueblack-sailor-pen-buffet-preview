const tourCard=document.querySelector('a[href="./store-tour/"]');
tourCard?.remove();

const storeCard=document.querySelector('a[href="./store-guide/"]');
if(storeCard){
  const kicker=storeCard.querySelector('small');
  const title=storeCard.querySelector('h3');
  const body=storeCard.querySelector('p');
  if(kicker)kicker.textContent='EXPLORE & PLAN YOUR VISIT';
  if(title)title.textContent='매장 안내';
  if(body)body.textContent='1층·2층 안내도, 브랜드 위치, 주소, 영업시간과 방문 정보를 한곳에서 확인하세요.';
}
