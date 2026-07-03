import{API_URL,API_KEY}from'../inventory-audit/audit-config.js';

const BATCH_SIZE=400;

async function rpc(name,body){
  const response=await fetch(`${API_URL}/rest/v1/rpc/${name}`,{
    method:'POST',
    headers:{apikey:API_KEY,Authorization:`Bearer ${API_KEY}`,'Content-Type':'application/json'},
    body:JSON.stringify(body)
  });
  const data=await response.json().catch(()=>null);
  if(!response.ok)throw new Error(data?.message||data?.error||'업데이트 요청에 실패했습니다.');
  return data;
}

function makeId(){return crypto.randomUUID?.()||`${Date.now()}-${Math.random().toString(16).slice(2)}`}

async function sendBatches(name,session,batchId,rows,onProgress){
  for(let index=0;index<rows.length;index+=BATCH_SIZE){
    const batch=rows.slice(index,index+BATCH_SIZE);
    await rpc(name,{p_token:session,p_batch_id:batchId,p_rows:batch});
    onProgress(index+batch.length);
  }
}

export async function updateCatalog({session,infoRows,stockRows,onStage}){
  const infoBatch=makeId();
  await sendBatches('internal_product_info_import_batch',session,infoBatch,infoRows,current=>onStage('info-upload',current));
  onStage('info-finish',infoRows.length);
  const infoResult=await rpc('internal_product_info_import_finish',{p_token:session,p_batch_id:infoBatch,p_expected_count:infoRows.length});

  const stockBatch=makeId();
  await sendBatches('internal_product_stock_import_batch',session,stockBatch,stockRows,current=>onStage('stock-upload',current));
  onStage('stock-finish',stockRows.length);
  const stockResult=await rpc('internal_product_stock_import_finish',{p_token:session,p_batch_id:stockBatch,p_expected_count:stockRows.length,p_consume_token:false});

  return{info:Array.isArray(infoResult)?infoResult[0]:infoResult,stock:Array.isArray(stockResult)?stockResult[0]:stockResult};
}