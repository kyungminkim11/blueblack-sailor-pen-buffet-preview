import{ENDPOINT}from'./store-tour-config.js';
const token=()=>sessionStorage.getItem(['blueblack','catalog','session'].join('-'))||'';
async function parse(response){const body=await response.json().catch(()=>({}));if(!response.ok||body.ok===false)throw new Error(body.message||body.error||'360 매장 데이터를 처리하지 못했습니다.');return body;}
async function send(action,extra={}){return parse(await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,session:token(),...extra}),cache:'no-store'}));}
export const loadAdminSpots=()=>send('admin_list');
export const saveAdminSpot=(spotId,patch)=>send('save',{spotId,patch});
export const deleteAdminSpot=spotId=>send('delete',{spotId});
export const restoreAdminSpot=spotId=>send('restore',{spotId});
export async function uploadAdminSpot(spotId,file,width,height){const form=new FormData();form.set('action','upload');form.set('session',token());form.set('spotId',spotId);form.set('file',file,file.name);form.set('width',String(width||0));form.set('height',String(height||0));return parse(await fetch(ENDPOINT,{method:'POST',body:form}));}
