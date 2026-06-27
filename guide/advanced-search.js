const $=(selector,root=document)=>root.querySelector(selector);

const aliases=[
  [['한글작은','한글세필','받침많은','작은한글'],'korean-small'],
  [['필압강한','필압센','꾹눌러','힘줘서'],'strong-pressure'],
  [['손이작','작은손','손작은'],'small-hands'],
  [['손이큰','큰손','손큰'],'large-hands'],
  [['관리쉬운','세척쉬운','관리편한'],'easy-care'],
  [['첫금닙','금닙입문','금닙'],'first-gold'],
  [['부모님선물','은사선물','선생님선물'],'mentor-gift'],
  [['잉크자주','색자주바꿈','잉크교체'],'frequent-ink-change']
];

function handle(query){
  const normalized=String(query||'').replace(/\s+/g,'').toLowerCase();
  const match=aliases.find(([terms])=>terms.some(term=>normalized.includes(term)));
  if(!match)return false;
  const target=document.querySelector(`[data-extra-scenario="${match[1]}"]`);
  if(target){target.click();return true}
  setTimeout(()=>document.querySelector(`[data-extra-scenario="${match[1]}"]`)?.click(),150);
  return true;
}

$('#search-button')?.addEventListener('click',event=>{if(handle($('#global-search')?.value)){event.preventDefault();event.stopImmediatePropagation()}},true);
$('#global-search')?.addEventListener('keydown',event=>{if(event.key==='Enter'&&handle(event.currentTarget.value)){event.preventDefault();event.stopImmediatePropagation()}},true);
