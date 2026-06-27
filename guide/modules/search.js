import { synonyms } from '../data/catalog.js';

const chosung = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
export function toChosung(text='') {
  return [...String(text)].map(ch => {
    const code = ch.charCodeAt(0) - 0xAC00;
    return code >= 0 && code <= 11171 ? chosung[Math.floor(code / 588)] : ch;
  }).join('');
}
export function normalize(text='') {
  return String(text).toLowerCase().normalize('NFKC').replace(/[.,!?()[\]{}:;"']/g,' ').replace(/\s+/g,' ').trim();
}
function distance(a,b) {
  const m=a.length,n=b.length,dp=Array.from({length:m+1},()=>Array(n+1).fill(0));
  for(let i=0;i<=m;i++)dp[i][0]=i; for(let j=0;j<=n;j++)dp[0][j]=j;
  for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)dp[i][j]=Math.min(dp[i-1][j]+1,dp[i][j-1]+1,dp[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
  return dp[m][n];
}
function expandToken(token) {
  const set=new Set([token]);
  Object.entries(synonyms).forEach(([key,values])=>{
    if(token.includes(normalize(key)) || normalize(key).includes(token)) values.forEach(v=>set.add(normalize(v)));
  });
  return [...set];
}
export function buildIndex(items) {
  return items.map(item=>{
    const text=normalize([item.title,item.summary,...(item.keywords||[]),item.category].join(' '));
    return {...item,__text:text,__cho:toChosung(text)};
  });
}
export function searchIndex(index, query) {
  const q=normalize(query); if(!q) return [];
  const tokens=q.split(' ').filter(Boolean).flatMap(expandToken);
  const qCho=toChosung(q);
  return index.map(item=>{
    let score=0;
    tokens.forEach(token=>{
      if(item.__text.includes(token))score+=5;
      if(normalize(item.title).includes(token))score+=7;
      const words=item.__text.split(' ');
      if(token.length>=3 && words.some(w=>distance(token,w)<=1))score+=2;
    });
    if(qCho.length>=2 && item.__cho.includes(qCho))score+=4;
    return {...item,score};
  }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score || a.title.localeCompare(b.title,'ko'));
}
