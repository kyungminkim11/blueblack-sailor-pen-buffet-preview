export const ENDPOINT='https://jnciddblcndmthmmvqrz.supabase.co/functions/v1/blueblack-store-tour';
export const SPOTS=[
['f1-01','출입구·계산대 앞',31,87,{straight:'f1-02'}],
['f1-02','입구 중앙',48,81,{straight:'f1-03',right:'f1-09',back:'f1-01'}],
['f1-03','전면 기둥·안내대',40,72,{straight:'f1-04',back:'f1-02'}],
['f1-04','전면 중앙 교차점',48,64,{straight:'f1-05',left:'f1-06',right:'f1-07',back:'f1-03'}],
['f1-05','중앙 진열 통로',48,52,{straight:'f1-11',left:'f1-06',right:'f1-07',back:'f1-04'}],
['f1-06','좌측 잉크 진열벽 앞',32,40,{straight:'f1-10',right:'f1-05',back:'f1-04'}],
['f1-07','우측 잉크 진열벽 앞',65,40,{straight:'f1-08',left:'f1-05',back:'f1-04'}],
['f1-08','후면 블랙 진열장',82,55,{straight:'f1-09',left:'f1-07',back:'f1-07'}],
['f1-09','후문·블랙 진열장',84,72,{straight:'f1-02',left:'f1-08',back:'f1-08'}],
['f1-10','핑크·오렌지 잉크벽',30,28,{straight:'f1-11',right:'f1-06',back:'f1-06'}],
['f1-11','옐로 잉크벽·블랙 아일랜드',48,20,{left:'f1-10',right:'f1-07',back:'f1-05'}]
].map((v,i)=>({id:v[0],title:v[1],x:v[2],y:v[3],connections:v[4],floor:1,code:`1F-${String(i+1).padStart(2,'0')}`,sortOrder:i+1,imageMode:'default',isPublic:true}));
export const LABEL={left:'좌측',straight:'직진',right:'우측',back:'뒤로'},ARROW={left:'←',straight:'↑',right:'→',back:'↓'};
