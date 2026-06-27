export const questions = [
  {key:'experience',title:'만년필 사용 경험이 있나요?',help:'처음인지, 기존 펜에서 업그레이드하는지 알려주세요.',options:[['first','첫 만년필','관리 편의성을 우선'],['upgrade','기존 사용자','취향과 차이를 더 세밀하게 비교']]},
  {key:'purpose',title:'주로 어디에 사용하나요?',options:[['study','공부·장문 필기','가벼움과 안정성'],['work','업무·회의','단정함과 범용성'],['diary','다이어리·취미','잉크 표현과 색감'],['gift','선물','디자인과 완성도']]},
  {key:'size',title:'평소 글씨 크기는 어떤가요?',options:[['small','작은 편','촘촘한 필기'],['normal','보통','일반적인 노트 필기'],['large','큰 편','굵고 시원한 글씨']]},
  {key:'paper',title:'가장 자주 쓰는 종이는 무엇인가요?',options:[['copy','복사용지·일반 노트','번짐과 비침 우선'],['planner','다이어리','작은 칸과 건조 속도'],['fp','만년필용 노트','잉크 표현과 부드러움']]},
  {key:'pressure',title:'필압은 어떤 편인가요?',options:[['light','약한 편','힘을 거의 주지 않음'],['normal','보통','일반적인 필압'],['strong','강한 편','종이에 힘이 많이 들어감']]},
  {key:'hand',title:'어느 손으로 쓰나요?',options:[['right','오른손','일반적인 건조 조건'],['left','왼손','번짐과 건조 시간 확인']]},
  {key:'weight',title:'펜 무게는 어떤 쪽이 좋나요?',options:[['light','가벼운 펜','장시간·휴대'],['normal','보통','균형 잡힌 무게'],['solid','묵직한 펜','존재감과 안정감']]},
  {key:'filling',title:'잉크 사용 방식은?',options:[['easy','간단한 카트리지','빠르고 편리하게'],['both','카트리지와 병 잉크','확장성까지'],['bottle','병 잉크 중심','충전 과정과 색상 다양성']]},
  {key:'budget',title:'예산 범위를 선택해 주세요.',options:[['under3','3만원 이하','가볍게 시작'],['3to7','3–7만원','입문 선택 폭'],['7to15','7–15만원','마감과 디자인'],['15plus','15만원 이상','상위 모델과 선물']]},
  {key:'style',title:'어떤 인상을 선호하나요?',options:[['practical','가볍고 실용적','매일 부담 없이'],['classic','클래식','전통적인 디자인'],['colorful','컬러풀','색과 개성'],['premium','고급스러움','선물과 기념']]},
];

const priceRanges={under3:[0,30000], '3to7':[30000,70000], '7to15':[70000,150000], '15plus':[150000,Infinity]};
export function recommend(products, a) {
  const scoreProduct=p=>{
    let score=0,reasons=[];
    const add=(key,n,reason)=>{score+=(p.scores[key]||0)*n;if((p.scores[key]||0)>=4&&reason)reasons.push(reason)};
    add(a.size,3,`${a.size==='small'?'작은 글씨':a.size==='large'?'큰 글씨':'보통 크기 글씨'}에 맞는 방향`);
    add(a.purpose,3,`${a.purpose==='study'?'공부·장문 필기':a.purpose==='work'?'업무':a.purpose==='diary'?'다이어리':'선물'} 용도와 잘 맞음`);
    add(a.weight==='solid'?'classic':a.weight,2,a.weight==='light'?'가벼운 펜 선호 반영':'무게 취향 반영');
    add(a.style==='practical'?'easy':a.style,2,'선호 스타일 반영');
    if(a.hand==='left')add('left',2,'왼손 필기 조건을 고려');
    if(a.filling==='easy')add('cartridge',2,'카트리지 편의성');
    if(a.filling==='both')add('converter',2,'병 잉크 확장성');
    if(a.filling==='bottle'){ if(p.filling.includes('피스톤'))score+=12; else add('converter',2,'병 잉크 사용 가능'); }
    if(a.paper==='copy')add('small',2,'일반 종이에서 가는 선을 우선');
    if(a.paper==='fp')add('diary',1,'잉크 표현에 유리');
    const [min,max]=priceRanges[a.budget];
    if(p.price>=min&&p.price<max){score+=18;reasons.push('선택한 예산 범위')} else if(p.price<max*1.2&&p.price>=min*0.8)score+=4;
    if(a.experience==='first')add('easy',2,'첫 사용 관리 편의성');
    if(a.pressure==='strong')score-=2;
    return {...p,matchScore:score,reasons:[...new Set(reasons)].slice(0,3)};
  };
  const ranked=products.map(scoreProduct).sort((a,b)=>b.matchScore-a.matchScore);
  const nib = a.size==='small'||a.paper==='copy' ? 'EF 또는 F' : a.size==='large'||a.paper==='fp' ? 'M 우선' : 'F 또는 M';
  return {
    nib,
    caution:a.pressure==='strong'?'필압이 강한 편이라면 굵기보다 먼저 힘을 빼고 시필해 주세요.':'같은 표기라도 브랜드별 실제 선 굵기가 달라 시필이 필요합니다.',
    products:ranked.slice(0,3),
    alternatives:ranked.slice(3,5),
  };
}
