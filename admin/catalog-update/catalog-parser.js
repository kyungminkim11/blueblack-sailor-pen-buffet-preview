const cleanText=value=>String(value??'').trim();
const cleanNumber=value=>{if(value===null||value===undefined||value==='')return null;const parsed=Number(String(value).replace(/,/g,'').replace(/원/g,'').trim());return Number.isFinite(parsed)?parsed:null};
const mapHeaders=row=>new Map(row.map((value,index)=>[cleanText(value),index]).filter(([key])=>key));
const valueAt=(row,map,name)=>row[map.get(name)]??'';

async function readWorkbook(file){
  if(!window.XLSX)throw new Error('엑셀 읽기 기능을 불러오지 못했습니다. 페이지를 새로고침해 주세요.');
  return XLSX.read(await file.arrayBuffer(),{type:'array',cellDates:false,raw:false});
}

function findSheet(workbook,preferred,requiredHeaders){
  const names=[preferred,...workbook.SheetNames.filter(name=>name!==preferred)];
  for(const name of names){
    const sheet=workbook.Sheets[name];
    if(!sheet)continue;
    const rows=XLSX.utils.sheet_to_json(sheet,{header:1,raw:false,defval:'',blankrows:false});
    const headerIndex=rows.findIndex(row=>requiredHeaders.every(header=>row.map(cleanText).includes(header)));
    if(headerIndex>=0)return{name,rows,headerIndex};
  }
  throw new Error(`필수 열(${requiredHeaders.join(', ')})을 찾지 못했습니다.`);
}

export async function parseProductFile(file){
  const workbook=await readWorkbook(file);
  const result=findSheet(workbook,'품목등록',['품목코드','품목명','소비자가','바코드']);
  const headers=mapHeaders(result.rows[result.headerIndex]);
  const rows=[];
  for(let index=result.headerIndex+1;index<result.rows.length;index++){
    const row=result.rows[index];
    const itemCode=cleanText(valueAt(row,headers,'품목코드'));
    const productName=cleanText(valueAt(row,headers,'품목명'));
    if(!itemCode||!productName)continue;
    rows.push({source_row:index+1,item_code:itemCode,manufacturer:cleanText(valueAt(row,headers,'제조사'))||null,product_name:productName,product_type:cleanText(valueAt(row,headers,'종류'))||null,consumer_price:cleanNumber(valueAt(row,headers,'소비자가')),sale_price:cleanNumber(valueAt(row,headers,'판매가')),store_price:null,barcode:cleanText(valueAt(row,headers,'바코드'))||null,location:cleanText(valueAt(row,headers,'재고 위치'))||null,note:cleanText(valueAt(row,headers,'적요'))||null});
  }
  if(!rows.length)throw new Error('등록 가능한 상품 행을 찾지 못했습니다.');
  return{rows,sheetName:result.name};
}

export async function parseStockFile(file){
  const workbook=await readWorkbook(file);
  const result=findSheet(workbook,'재고현황',['품목코드','품명 및 규격','재고수량']);
  const headers=mapHeaders(result.rows[result.headerIndex]);
  const rows=[];
  for(let index=result.headerIndex+1;index<result.rows.length;index++){
    const row=result.rows[index];
    const itemCode=cleanText(valueAt(row,headers,'품목코드'));
    const productName=cleanText(valueAt(row,headers,'품명 및 규격'));
    if(!itemCode||!productName)continue;
    rows.push({source_row:index+1,item_code:itemCode,manufacturer:cleanText(valueAt(row,headers,'품목그룹1명'))||null,product_name:productName,stock_qty:cleanNumber(valueAt(row,headers,'재고수량')),consumer_price:cleanNumber(valueAt(row,headers,'소비자가')),sale_price:cleanNumber(valueAt(row,headers,'판매가')),location:cleanText(valueAt(row,headers,'재고 위치'))||null,note:cleanText(valueAt(row,headers,'적요'))||null});
  }
  if(!rows.length)throw new Error('등록 가능한 재고 행을 찾지 못했습니다.');
  return{rows,sheetName:result.name};
}