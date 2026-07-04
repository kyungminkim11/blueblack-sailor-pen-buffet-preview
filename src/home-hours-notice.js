const summary=document.querySelector('.quick-info');
if(summary){
  const card=document.createElement('article');
  card.id='homeHoursNote';
  const label=document.createElement('small');
  label.textContent='마감 전 이용 안내';
  const title=document.createElement('strong');
  title.textContent='구매 상담 및 소분 주문은 오후 5시 40분까지';
  const body=document.createElement('span');
  body.textContent='매장은 오후 6시에 마감합니다. 마감 준비로 인해 오후 5시 40분부터는 구매 상담이 어려울 수 있습니다. 상담이 필요하신 경우 조금 일찍 방문해 주시거나 다른 영업일에 여유 있게 방문해 주세요.';
  card.append(label,title,body);
  summary.appendChild(card);
}