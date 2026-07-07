(()=>{
  const UNLOCKED='blueblack-admin-unlocked';
  const CATALOG_SESSION='blueblack-catalog-session';
  const API_URL=['https://jnciddblcndmthmmvqrz','.supabase.co'].join('');
  const API_KEY=['sb','publishable','UUzSE7O9wqI0WN9cKG9OAQ','VleRkL4I'].join('_');
  const style=document.createElement('style');
  style.textContent='.bb-admin-lock{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:22px;background:linear-gradient(135deg,#071629,#102b4c);font-family:Pretendard,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.bb-admin-lock-card{width:min(420px,100%);padding:26px;border-radius:22px;background:#fff;box-shadow:0 24px 80px rgba(0,0,0,.28);color:#10233f}.bb-admin-lock-card small{display:block;color:#a77a3d;font-size:10px;font-weight:900}.bb-admin-lock-card h1{margin:8px 0}.bb-admin-lock-card p{color:#64758a;font-size:13px;line-height:1.7}.bb-admin-lock-card input{width:100%;height:52px;padding:0 14px;border:1px solid #ccd8e3;border-radius:13px;font-size:16px;box-sizing:border-box}.bb-admin-lock-card button{width:100%;height:52px;margin-top:10px;border:0;border-radius:13px;background:#102b4c;color:#fff;font-weight:900}.bb-admin-lock-card button:disabled{opacity:.55}.bb-admin-lock-error{min-height:20px;margin-top:10px;color:#b42318;font-size:12px;font-weight:800}';
  document.head.append(style);

  async function deriveSession(value){
    const source=new TextEncoder().encode(`${value}|blueblack-catalog-v1`);
    const digest=await crypto.subtle.digest('SHA-256',source);
    return [...new Uint8Array(digest)].map(byte=>byte.toString(16).padStart(2,'0')).join('');
  }

  async function sessionIsValid(value){
    const response=await fetch(`${API_URL}/rest/v1/rpc/internal_catalog_update_session_ok`,{
      method:'POST',
      headers:{apikey:API_KEY,Authorization:`Bearer ${API_KEY}`,'Content-Type':'application/json'},
      body:JSON.stringify({p_session:value})
    });
    if(!response.ok)return false;
    return Boolean(await response.json().catch(()=>false));
  }

  function injectTools(){
    const grid=document.querySelector('.admin-tools-grid');
    if(!grid)return;
    const tools=[
      {href:'./inventory-audit/',icon:'▥',small:'INVENTORY AUDIT',title:'재고 조사',copy:'구역을 선택하고 바코드를 스캔해 수량을 자동 집계하고 엑셀로 내려받습니다.'},
      {href:'./catalog-update/',icon:'↥',small:'CATALOG UPDATE',title:'상품 데이터 업데이트',copy:'상품·바코드 파일과 재고현황 파일을 선택해 Supabase 상품 DB를 직접 업데이트합니다.'},
      {href:'./store-tour/',icon:'◎',small:'360 STORE TOUR',title:'360 매장 로드뷰 관리',copy:'1층 도면 위치별 360 사진을 등록하고 고객용 매장 둘러보기 화면에 반영합니다.'}
    ];
    tools.forEach(tool=>{
      if(grid.querySelector(`[href="${tool.href}"]`))return;
      const card=document.createElement('a');
      card.className='admin-tool-card primary';
      card.href=tool.href;
      card.innerHTML=`<span class="admin-tool-icon">${tool.icon}</span><span class="admin-tool-copy"><small>${tool.small}</small><h2>${tool.title}</h2><p>${tool.copy}</p></span><span class="admin-tool-arrow">→</span>`;
      grid.append(card);
    });
  }

  function showGate(){
    const existing=sessionStorage.getItem(CATALOG_SESSION);
    if(sessionStorage.getItem(UNLOCKED)==='1'&&existing)return;
    sessionStorage.removeItem(UNLOCKED);
    sessionStorage.removeItem(CATALOG_SESSION);
    const gate=document.createElement('div');
    gate.className='bb-admin-lock';
    gate.innerHTML='<form class="bb-admin-lock-card" autocomplete="off"><small>BLUEBLACK PEN SHOP · ADMIN</small><h1>관리자 암호 확인</h1><p>매장 내부용 도구입니다. 암호를 확인하면 현재 브라우저 탭에서 상품 검색, 재고 조사와 데이터 업데이트를 사용할 수 있습니다.</p><input type="password" placeholder="관리자 암호" autofocus><button type="submit">관리자 페이지 열기</button><div class="bb-admin-lock-error"></div></form>';
    const form=gate.querySelector('form'),input=gate.querySelector('input'),button=gate.querySelector('button'),error=gate.querySelector('.bb-admin-lock-error');
    form.onsubmit=async event=>{
      event.preventDefault();
      const value=input.value.trim();
      if(!value){error.textContent='암호를 입력해 주세요.';return}
      button.disabled=true;error.textContent='암호를 확인하고 있습니다…';
      try{
        const session=await deriveSession(value);
        if(!await sessionIsValid(session))throw new Error('invalid');
        sessionStorage.setItem(UNLOCKED,'1');
        sessionStorage.setItem(CATALOG_SESSION,session);
        gate.remove();
      }catch{
        input.value='';input.focus();error.textContent='암호가 맞지 않습니다.';
      }finally{button.disabled=false}
    };
    document.body.append(gate);
  }

  const init=()=>{injectTools();showGate()};
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();