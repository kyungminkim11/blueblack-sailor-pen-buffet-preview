let disposeCurrentViewer=null;

function ensurePanoramaStyle(){
  if(document.querySelector('link[data-admin-panorama-addon]'))return;
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href=new URL('../admin-360-panorama-addon.css?v=1',import.meta.url).href;
  link.dataset.adminPanoramaAddon='true';
  document.head.append(link);
}

function createShader(gl,type,source){
  const shader=gl.createShader(type);
  gl.shaderSource(shader,source);
  gl.compileShader(shader);
  if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
    const message=gl.getShaderInfoLog(shader)||'360 뷰어 셰이더를 만들지 못했습니다.';
    gl.deleteShader(shader);
    throw new Error(message);
  }
  return shader;
}

function createProgram(gl){
  const vertex=createShader(gl,gl.VERTEX_SHADER,`
    attribute vec2 aPosition;
    varying vec2 vUv;
    void main(){
      vUv=aPosition*0.5+0.5;
      gl_Position=vec4(aPosition,0.0,1.0);
    }
  `);
  const fragment=createShader(gl,gl.FRAGMENT_SHADER,`
    precision mediump float;
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float uYaw;
    uniform float uPitch;
    uniform float uFov;
    uniform float uAspect;
    const float PI=3.14159265358979323846;
    void main(){
      vec2 p=vUv*2.0-1.0;
      p.y=-p.y;
      float scale=tan(uFov*0.5);
      vec3 dir=normalize(vec3(p.x*uAspect*scale,p.y*scale,-1.0));
      float cp=cos(uPitch);
      float sp=sin(uPitch);
      vec3 pitched=vec3(dir.x,dir.y*cp-dir.z*sp,dir.y*sp+dir.z*cp);
      float cy=cos(uYaw);
      float sy=sin(uYaw);
      vec3 d=vec3(pitched.x*cy-pitched.z*sy,pitched.y,pitched.x*sy+pitched.z*cy);
      float lon=atan(d.x,-d.z);
      float lat=asin(clamp(d.y,-1.0,1.0));
      vec2 uv=vec2(fract(0.5+lon/(2.0*PI)),0.5-lat/PI);
      gl_FragColor=texture2D(uTexture,uv);
    }
  `);
  const program=gl.createProgram();
  gl.attachShader(program,vertex);
  gl.attachShader(program,fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
    const message=gl.getProgramInfoLog(program)||'360 뷰어 프로그램을 만들지 못했습니다.';
    gl.deleteProgram(program);
    throw new Error(message);
  }
  return program;
}

function mountPanorama(preview,image){
  const source=image.currentSrc||image.src;
  if(!source)return null;
  const viewer=document.createElement('div');
  viewer.className='capture-panorama-viewer';
  viewer.innerHTML=`
    <canvas aria-label="360도 매장 사진. 드래그하여 둘러보세요."></canvas>
    <div class="capture-panorama-loading">360 사진을 불러오는 중입니다.</div>
    <div class="capture-panorama-hint">드래그로 둘러보기 · 휠/버튼으로 확대</div>
    <div class="capture-panorama-controls" aria-label="360 사진 보기 조작">
      <button type="button" data-pano-action="left" aria-label="왼쪽 보기">←</button>
      <button type="button" data-pano-action="right" aria-label="오른쪽 보기">→</button>
      <button type="button" data-pano-action="in" aria-label="확대">＋</button>
      <button type="button" data-pano-action="out" aria-label="축소">−</button>
      <button type="button" data-pano-action="reset">정면</button>
    </div>`;
  image.replaceWith(viewer);

  const canvas=viewer.querySelector('canvas');
  const loading=viewer.querySelector('.capture-panorama-loading');
  const gl=canvas.getContext('webgl',{antialias:true,alpha:false,preserveDrawingBuffer:false});
  if(!gl){
    viewer.classList.add('is-fallback');
    const fallback=document.createElement('img');
    fallback.src=source;
    fallback.alt='360 사진 원본 미리보기';
    viewer.prepend(fallback);
    loading.textContent='이 브라우저에서는 펼친 360 사진으로 표시합니다.';
    return()=>{};
  }

  let program;
  try{program=createProgram(gl);}catch(error){
    console.warn(error);
    viewer.classList.add('is-fallback');
    const fallback=document.createElement('img');
    fallback.src=source;
    fallback.alt='360 사진 원본 미리보기';
    viewer.prepend(fallback);
    loading.textContent='360 뷰어를 시작하지 못해 원본으로 표시합니다.';
    return()=>{};
  }

  gl.useProgram(program);
  const buffer=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const position=gl.getAttribLocation(program,'aPosition');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);

  const uniforms={
    yaw:gl.getUniformLocation(program,'uYaw'),
    pitch:gl.getUniformLocation(program,'uPitch'),
    fov:gl.getUniformLocation(program,'uFov'),
    aspect:gl.getUniformLocation(program,'uAspect')
  };
  gl.uniform1i(gl.getUniformLocation(program,'uTexture'),0);

  let yaw=0;
  let pitch=0.05;
  let fov=Math.PI/2.25;
  let texture=null;
  let destroyed=false;
  let frame=0;
  let dragging=false;
  let lastX=0;
  let lastY=0;

  const resize=()=>{
    if(destroyed)return;
    const rect=canvas.getBoundingClientRect();
    const dpr=Math.min(window.devicePixelRatio||1,2);
    const width=Math.max(2,Math.round(rect.width*dpr));
    const height=Math.max(2,Math.round(rect.height*dpr));
    if(canvas.width!==width||canvas.height!==height){
      canvas.width=width;
      canvas.height=height;
      gl.viewport(0,0,width,height);
    }
  };

  const draw=()=>{
    frame=0;
    if(destroyed||!texture)return;
    resize();
    gl.useProgram(program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.uniform1f(uniforms.yaw,yaw);
    gl.uniform1f(uniforms.pitch,pitch);
    gl.uniform1f(uniforms.fov,fov);
    gl.uniform1f(uniforms.aspect,canvas.width/Math.max(1,canvas.height));
    gl.drawArrays(gl.TRIANGLES,0,6);
  };
  const requestDraw=()=>{if(!frame)frame=requestAnimationFrame(draw);};
  const clampView=()=>{
    pitch=Math.max(-1.15,Math.min(1.15,pitch));
    fov=Math.max(0.55,Math.min(1.75,fov));
  };

  const panoramaImage=new Image();
  panoramaImage.onload=()=>{
    if(destroyed)return;
    texture=gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,panoramaImage);
    loading.remove();
    viewer.classList.add('is-ready');
    requestDraw();
  };
  panoramaImage.onerror=()=>{
    loading.textContent='360 사진을 불러오지 못했습니다.';
    viewer.classList.add('has-error');
  };
  panoramaImage.src=source;

  const onPointerDown=(event)=>{
    dragging=true;
    lastX=event.clientX;
    lastY=event.clientY;
    canvas.setPointerCapture?.(event.pointerId);
    viewer.classList.add('is-dragging');
  };
  const onPointerMove=(event)=>{
    if(!dragging)return;
    const dx=event.clientX-lastX;
    const dy=event.clientY-lastY;
    lastX=event.clientX;
    lastY=event.clientY;
    yaw-=dx*0.006;
    pitch-=dy*0.0045;
    clampView();
    requestDraw();
  };
  const onPointerUp=(event)=>{
    dragging=false;
    canvas.releasePointerCapture?.(event.pointerId);
    viewer.classList.remove('is-dragging');
  };
  const onWheel=(event)=>{
    event.preventDefault();
    fov+=Math.sign(event.deltaY)*0.1;
    clampView();
    requestDraw();
  };
  const onControls=(event)=>{
    const action=event.target.closest('[data-pano-action]')?.dataset.panoAction;
    if(!action)return;
    if(action==='left')yaw-=0.28;
    if(action==='right')yaw+=0.28;
    if(action==='in')fov-=0.12;
    if(action==='out')fov+=0.12;
    if(action==='reset'){yaw=0;pitch=0.05;fov=Math.PI/2.25;}
    clampView();
    requestDraw();
  };

  canvas.addEventListener('pointerdown',onPointerDown);
  canvas.addEventListener('pointermove',onPointerMove);
  canvas.addEventListener('pointerup',onPointerUp);
  canvas.addEventListener('pointercancel',onPointerUp);
  canvas.addEventListener('wheel',onWheel,{passive:false});
  viewer.addEventListener('click',onControls);
  const resizeObserver='ResizeObserver' in window?new ResizeObserver(requestDraw):null;
  resizeObserver?.observe(viewer);

  return()=>{
    destroyed=true;
    if(frame)cancelAnimationFrame(frame);
    resizeObserver?.disconnect();
    canvas.removeEventListener('pointerdown',onPointerDown);
    canvas.removeEventListener('pointermove',onPointerMove);
    canvas.removeEventListener('pointerup',onPointerUp);
    canvas.removeEventListener('pointercancel',onPointerUp);
    canvas.removeEventListener('wheel',onWheel);
    viewer.removeEventListener('click',onControls);
    if(texture)gl.deleteTexture(texture);
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
  };
}

function enhanceCurrentPreview(){
  const preview=document.querySelector('#capture-detail-panel .capture-photo-preview');
  const image=preview?.querySelector(':scope > img');
  if(!preview||!image)return;
  disposeCurrentViewer?.();
  disposeCurrentViewer=mountPanorama(preview,image);
  const meta=document.querySelector('#capture-detail-panel .capture-photo-meta');
  if(meta&&!meta.querySelector('.capture-privacy-note')){
    const note=document.createElement('div');
    note.className='capture-privacy-note';
    note.innerHTML='<dt>개인정보</dt><dd>촬영자 비노출용 나디르 커버 적용</dd>';
    meta.append(note);
  }
}

function initialiseAddon(){
  ensurePanoramaStyle();
  const detail=document.querySelector('#capture-detail-panel');
  if(!detail){setTimeout(initialiseAddon,80);return;}
  const observer=new MutationObserver(()=>requestAnimationFrame(enhanceCurrentPreview));
  observer.observe(detail,{childList:true,subtree:true});
  enhanceCurrentPreview();
}

initialiseAddon();
