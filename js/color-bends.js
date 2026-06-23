// ColorBends — fundo animado do hero-card.
// Port vanilla do componente React Bits (JS+CSS, three). Mantém o shader
// original; só troca os hooks por setup/cleanup imperativo. Renderiza uma
// camada WebGL transparente por cima da cor do card (--color-fixed-dark).
// O three (~1.2MB) é importado dinamicamente em idle pós-load (ver mount), fora
// do caminho crítico — o efeito roda idêntico, só inicia uns ms depois.

const MAX_COLORS = 8;

const frag = `
#define MAX_COLORS ${MAX_COLORS}
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform int uColorCount;
uniform vec3 uColors[MAX_COLORS];
uniform int uTransparent;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform vec2 uPointer; // in NDC [-1,1]
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;
uniform int uIterations;
uniform float uIntensity;
uniform float uBandWidth;
varying vec2 vUv;

void main() {
  float t = uTime * uSpeed;
  vec2 p = vUv * 2.0 - 1.0;
  p += uPointer * uParallax * 0.1;
  vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
  // Referência fixa na ALTURA: y mapeia ±1, x estende por aspect (e recorta).
  // Features redondas em qualquer aspect E zoom preso à altura do viewport —
  // como a altura é parecida desktop/mobile, o retrato mostra as bandas na
  // mesma escala do desktop (só recorta a largura), sem zoom extra.
  float uAspect = uCanvas.x / uCanvas.y;
  vec2 q = rp;
  q.x *= uAspect;
  q /= max(uScale, 0.0001);
  q /= 0.5 + 0.2 * dot(q, q);
  q += 0.2 * cos(t) - 7.56;
  vec2 toward = (uPointer - rp);
  q += toward * uMouseInfluence * 0.2;

    for (int j = 0; j < 5; j++) {
      if (j >= uIterations - 1) break;
      vec2 rr = sin(1.5 * (q.yx * uFrequency) + 2.0 * cos(q * uFrequency));
      q += (rr - q) * 0.15;
    }

    vec3 col = vec3(0.0);
    float a = 1.0;

    if (uColorCount > 0) {
      vec2 s = q;
      vec3 sumCol = vec3(0.0);
      float cover = 0.0;
      for (int i = 0; i < MAX_COLORS; ++i) {
            if (i >= uColorCount) break;
            s -= 0.01;
            vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
            float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);
            float kBelow = clamp(uWarpStrength, 0.0, 1.0);
            float kMix = pow(kBelow, 0.3); // strong response across 0..1
            float gain = 1.0 + max(uWarpStrength - 1.0, 0.0); // allow >1 to amplify displacement
            vec2 disp = (r - s) * kBelow;
            vec2 warped = s + disp * gain;
            float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0);
            float m = mix(m0, m1, kMix);
            float w = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
            sumCol += uColors[i] * w;
            cover = max(cover, w);
      }
      col = clamp(sumCol, 0.0, 1.0);
      a = uTransparent > 0 ? cover : 1.0;
    } else {
        vec2 s = q;
        for (int k = 0; k < 3; ++k) {
            s -= 0.01;
            vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
            float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(k)) / 4.0);
            float kBelow = clamp(uWarpStrength, 0.0, 1.0);
            float kMix = pow(kBelow, 0.3);
            float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
            vec2 disp = (r - s) * kBelow;
            vec2 warped = s + disp * gain;
            float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(k)) / 4.0);
            float m = mix(m0, m1, kMix);
            col[k] = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
        }
        a = uTransparent > 0 ? max(max(col.r, col.g), col.b) : 1.0;
    }

    col *= uIntensity;

    if (uNoise > 0.0001) {
      float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);
      col += (n - 0.5) * uNoise;
      col = clamp(col, 0.0, 1.0);
    }

    vec3 rgb = (uTransparent > 0) ? col * a : col;
    gl_FragColor = vec4(rgb, a);
}
`;

const vert = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const toVec3 = (THREE, hex) => {
  const h = hex.replace('#', '').trim();
  const v =
    h.length === 3
      ? [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16)]
      : [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  return new THREE.Vector3(v[0] / 255, v[1] / 255, v[2] / 255);
};

function initColorBends(THREE, container, pointerTargetEl, opts) {
  const {
    rotation = 90,
    speed = 0.2,
    colors = [],
    transparent = true,
    autoRotate = 0,
    scale = 1,
    frequency = 1,
    warpStrength = 1,
    mouseInfluence = 1,
    parallax = 0.5,
    noise = 0.15,
    iterations = 1,
    intensity = 1.5,
    bandWidth = 6,
    animate = true
  } = opts;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const geometry = new THREE.PlaneGeometry(2, 2);

  const uColorsArray = Array.from({ length: MAX_COLORS }, () => new THREE.Vector3(0, 0, 0));
  const arr = (colors || []).filter(Boolean).slice(0, MAX_COLORS).map(c => toVec3(THREE, c));
  arr.forEach((c, i) => uColorsArray[i].copy(c));

  const rad = (rotation * Math.PI) / 180;

  const material = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    uniforms: {
      uCanvas: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uSpeed: { value: speed },
      uRot: { value: new THREE.Vector2(Math.cos(rad), Math.sin(rad)) },
      uColorCount: { value: arr.length },
      uColors: { value: uColorsArray },
      uTransparent: { value: transparent ? 1 : 0 },
      uScale: { value: scale },
      uFrequency: { value: frequency },
      uWarpStrength: { value: warpStrength },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uMouseInfluence: { value: mouseInfluence },
      uParallax: { value: parallax },
      uNoise: { value: noise },
      uIterations: { value: iterations },
      uIntensity: { value: intensity },
      uBandWidth: { value: bandWidth }
    },
    premultipliedAlpha: true,
    transparent: true
  });

  scene.add(new THREE.Mesh(geometry, material));

  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: 'high-performance',
    alpha: true
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, transparent ? 0 : 1);
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  container.appendChild(renderer.domElement);

  const clock = new THREE.Clock();

  const handleResize = () => {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    renderer.setSize(w, h, false);
    material.uniforms.uCanvas.value.set(w, h);
  };
  handleResize();

  let ro = null;
  if ('ResizeObserver' in window) {
    ro = new ResizeObserver(handleResize);
    ro.observe(container);
  } else {
    window.addEventListener('resize', handleResize);
  }

  const pointerTarget = new THREE.Vector2(0, 0);
  const pointerCurrent = new THREE.Vector2(0, 0);
  const handlePointerMove = e => {
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / (rect.width || 1)) * 2 - 1;
    const y = -(((e.clientY - rect.top) / (rect.height || 1)) * 2 - 1);
    pointerTarget.set(x, y);
  };
  pointerTargetEl.addEventListener('pointermove', handlePointerMove);

  let rafId = null;
  const loop = () => {
    const dt = clock.getDelta();
    const elapsed = clock.elapsedTime;
    material.uniforms.uTime.value = elapsed;

    const deg = (rotation % 360) + autoRotate * elapsed;
    const r2 = (deg * Math.PI) / 180;
    material.uniforms.uRot.value.set(Math.cos(r2), Math.sin(r2));

    pointerCurrent.lerp(pointerTarget, Math.min(1, dt * 8));
    material.uniforms.uPointer.value.copy(pointerCurrent);

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(loop);
  };

  if (animate) {
    rafId = requestAnimationFrame(loop);
  } else {
    renderer.render(scene, camera); // frame estático p/ prefers-reduced-motion
  }

  return () => {
    if (rafId !== null) cancelAnimationFrame(rafId);
    if (ro) ro.disconnect();
    else window.removeEventListener('resize', handleResize);
    pointerTargetEl.removeEventListener('pointermove', handlePointerMove);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    if (renderer.domElement.parentElement === container) container.removeChild(renderer.domElement);
  };
}

function mount() {
  const card = document.querySelector('.hero-card');
  if (!card) return;

  const bg = document.createElement('div');
  bg.className = 'hero-bg';
  bg.setAttribute('aria-hidden', 'true');
  card.insertBefore(bg, card.firstChild);

  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Importa o three fora do caminho crítico. O card já mostra a cor sólida de
  // fundo enquanto isso; a camada WebGL entra por cima quando carrega.
  import('three').then(THREE => {
    initColorBends(THREE, bg, card, {
      // Tons do accent (#1DA1F2): mais escuro → accent → mais claro. Monocromático
      // azul pra ficar sutil sobre o card escuro.
      colors: ['#0c4a73', '#1DA1F2', '#7fc9f7'],
      rotation: 90,
      speed: 0.59,
      scale: 0.9,
      frequency: 2.2,
      warpStrength: 1,
      mouseInfluence: 1,
      noise: 0.12,
      parallax: 0.5,
      iterations: 1,
      intensity: 0.85,
      bandWidth: 6,
      transparent: true,
      animate: !reduce
    });
  });
}

// Agenda o mount fora do caminho crítico: só após o load, em idle. Não compete
// com o LCP nem com o trabalho de main-thread do carregamento inicial.
function schedule() {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(mount, { timeout: 2000 });
  } else {
    setTimeout(mount, 200);
  }
}

if (document.readyState === 'complete') {
  schedule();
} else {
  window.addEventListener('load', schedule, { once: true });
}
