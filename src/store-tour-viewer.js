function shader(gl, type, source) {
  const item = gl.createShader(type);
  gl.shaderSource(item, source);
  gl.compileShader(item);
  if (!gl.getShaderParameter(item, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(item) || '360 viewer error');
  return item;
}
function makeProgram(gl) {
  const vertex = shader(gl, gl.VERTEX_SHADER, 'attribute vec2 aPosition;varying vec2 vUv;void main(){vUv=aPosition*.5+.5;gl_Position=vec4(aPosition,0.,1.);}');
  const fragment = shader(gl, gl.FRAGMENT_SHADER, 'precision mediump float;varying vec2 vUv;uniform sampler2D uTexture;uniform float uYaw,uPitch,uFov,uAspect;const float PI=3.141592653589793;void main(){vec2 p=vUv*2.-1.;p.y=-p.y;float s=tan(uFov*.5);vec3 d=normalize(vec3(p.x*uAspect*s,p.y*s,-1.));float cp=cos(uPitch),sp=sin(uPitch);d=vec3(d.x,d.y*cp-d.z*sp,d.y*sp+d.z*cp);float cy=cos(uYaw),sy=sin(uYaw);d=vec3(d.x*cy-d.z*sy,d.y,d.x*sy+d.z*cy);float lon=atan(d.x,-d.z),lat=asin(clamp(d.y,-1.,1.));gl_FragColor=texture2D(uTexture,vec2(fract(.5+lon/(2.*PI)),.5-lat/PI));}');
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('360 viewer link error');
  return program;
}
function resizeForTexture(image, limit) {
  const longest = Math.max(image.naturalWidth, image.naturalHeight);
  if (!longest || longest <= limit) return image;
  const scale = limit / longest;
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(2, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(2, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext('2d', { alpha: false });
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}
export function createPanoramaViewer(root, options = {}) {
  const compact = options.compact ?? matchMedia('(max-width: 760px), (pointer: coarse)').matches;
  root.classList.add('store-tour-panorama');
  root.innerHTML = '<canvas aria-label="360도 매장 사진"></canvas><div class="store-tour-loading">360 사진을 불러오는 중입니다.</div><div class="store-tour-view-controls"><button type="button" data-view="left" aria-label="왼쪽으로 보기">←</button><button type="button" data-view="right" aria-label="오른쪽으로 보기">→</button><button type="button" data-view="in" aria-label="확대">＋</button><button type="button" data-view="out" aria-label="축소">−</button><button type="button" data-view="reset">정면</button></div>';
  const canvas = root.querySelector('canvas');
  const loading = root.querySelector('.store-tour-loading');
  const gl = canvas.getContext('webgl', { antialias: !compact, alpha: false, powerPreference: compact ? 'low-power' : 'default', preserveDrawingBuffer: false });
  if (!gl) {
    loading.textContent = '이 브라우저에서는 360 뷰어를 사용할 수 없습니다.';
    return { setSource: async () => false, reset() {} };
  }
  const program = makeProgram(gl);
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const uniforms = { yaw: gl.getUniformLocation(program, 'uYaw'), pitch: gl.getUniformLocation(program, 'uPitch'), fov: gl.getUniformLocation(program, 'uFov'), aspect: gl.getUniformLocation(program, 'uAspect') };
  gl.uniform1i(gl.getUniformLocation(program, 'uTexture'), 0);
  const maxTexture = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 4096;
  const textureLimit = Math.min(maxTexture, compact ? 3072 : 4096);
  let texture;
  let yaw = 0;
  let pitch = 0.05;
  let fov = Math.PI / 2.25;
  let frame = 0;
  let dragging = false;
  let previousX = 0;
  let previousY = 0;
  let token = 0;
  let contextLost = false;
  const clamp = () => { pitch = Math.max(-1.15, Math.min(1.15, pitch)); fov = Math.max(0.5, Math.min(1.75, fov)); };
  function draw() {
    frame = 0;
    if (!texture || contextLost || !root.isConnected) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, compact ? 1 : 2);
    const width = Math.max(2, Math.round(rect.width * dpr));
    const height = Math.max(2, Math.round(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1f(uniforms.yaw, yaw);
    gl.uniform1f(uniforms.pitch, pitch);
    gl.uniform1f(uniforms.fov, fov);
    gl.uniform1f(uniforms.aspect, width / height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  const render = () => { if (!frame && !contextLost) frame = requestAnimationFrame(draw); };
  const reset = () => { yaw = 0; pitch = 0.05; fov = Math.PI / 2.25; render(); };
  async function setSource(source, alt = '360도 매장 사진') {
    const current = ++token;
    loading.hidden = false;
    loading.textContent = '360 사진을 불러오는 중입니다.';
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.decoding = 'async';
    const loaded = await new Promise((resolve) => {
      image.onload = () => resolve(true);
      image.onerror = () => resolve(false);
      image.src = source;
    });
    if (current !== token) return false;
    if (!loaded || !image.naturalWidth) {
      loading.hidden = false;
      loading.textContent = '360 사진을 불러오지 못했습니다.';
      return false;
    }
    try {
      const sourceForTexture = resizeForTexture(image, textureLimit);
      if (texture) gl.deleteTexture(texture);
      texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceForTexture);
      canvas.setAttribute('aria-label', alt);
      loading.hidden = true;
      reset();
      return true;
    } catch (error) {
      console.warn(error);
      loading.hidden = false;
      loading.textContent = '360 사진을 표시할 수 없습니다.';
      return false;
    }
  }
  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    contextLost = true;
    loading.hidden = false;
    loading.textContent = '360 화면을 다시 준비하고 있습니다.';
  });
  canvas.addEventListener('webglcontextrestored', () => { contextLost = false; render(); });
  canvas.addEventListener('pointerdown', (event) => {
    dragging = true;
    previousX = event.clientX;
    previousY = event.clientY;
    canvas.setPointerCapture?.(event.pointerId);
  });
  canvas.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    yaw -= (event.clientX - previousX) * 0.006;
    pitch -= (event.clientY - previousY) * 0.0045;
    previousX = event.clientX;
    previousY = event.clientY;
    clamp();
    render();
  });
  const stopDragging = () => { dragging = false; };
  canvas.addEventListener('pointerup', stopDragging);
  canvas.addEventListener('pointercancel', stopDragging);
  canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    fov += Math.sign(event.deltaY) * 0.1;
    clamp();
    render();
  }, { passive: false });
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-view]')?.dataset.view;
    if (!action) return;
    if (action === 'left') yaw -= 0.3;
    if (action === 'right') yaw += 0.3;
    if (action === 'in') fov -= 0.12;
    if (action === 'out') fov += 0.12;
    if (action === 'reset') reset();
    clamp();
    render();
  });
  const observer = new ResizeObserver(render);
  observer.observe(root);
  return { setSource, reset };
}
