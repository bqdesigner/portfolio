(function () {
  const container = document.getElementById('dot-pattern');
  if (!container) return;

  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const root = document.documentElement;
  const cs = () => getComputedStyle(root);

  function parseColor(str) {
    if (!str) return { r: 255, g: 255, b: 255 };
    const s = str.trim();
    let m = /^#([a-f\d])([a-f\d])([a-f\d])$/i.exec(s);
    if (m) return { r: parseInt(m[1] + m[1], 16), g: parseInt(m[2] + m[2], 16), b: parseInt(m[3] + m[3], 16) };
    m = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(s);
    if (m) return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
    m = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i.exec(s);
    if (m) return { r: +m[1], g: +m[2], b: +m[3] };
    return { r: 255, g: 255, b: 255 };
  }

  function readNum(name, fallback) {
    const v = parseFloat(cs().getPropertyValue(name));
    return Number.isFinite(v) ? v : fallback;
  }

  const config = {};
  function refreshConfig() {
    config.dotSize = readNum('--dot-size', 2);
    config.gap = readNum('--dot-gap', 24);
    config.proximity = readNum('--dot-proximity', 120);
    config.glowIntensity = readNum('--dot-glow-intensity', 0.5);
    config.waveSpeed = readNum('--dot-wave-speed', 0.5);
    config.baseColor = parseColor(cs().getPropertyValue('--dot-base'));
    config.glowColor = parseColor(cs().getPropertyValue('--dot-glow'));
  }
  refreshConfig();

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    config.waveSpeed = 0;
  }

  let dots = [];
  let mouse = { x: -1000, y: -1000 };
  const startTime = Date.now();
  let raf = null;
  let running = false;
  let visible = !document.hidden;
  let mouseDirty = false;
  let lastMouseEvent = null;

  function buildGrid() {
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, rect.width * dpr);
    canvas.height = Math.max(1, rect.height * dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const cell = config.dotSize + config.gap;
    const cols = Math.ceil(rect.width / cell) + 1;
    const rows = Math.ceil(rect.height / cell) + 1;
    const offsetX = (rect.width - (cols - 1) * cell) / 2;
    const offsetY = (rect.height - (rows - 1) * cell) / 2;

    dots = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push({
          x: offsetX + c * cell,
          y: offsetY + r * cell,
          baseOpacity: 0.3 + Math.random() * 0.2,
        });
      }
    }
  }

  function applyMouse() {
    if (!mouseDirty || !lastMouseEvent) return;
    const rect = canvas.getBoundingClientRect();
    mouse.x = lastMouseEvent.clientX - rect.left;
    mouse.y = lastMouseEvent.clientY - rect.top;
    mouseDirty = false;
  }

  function draw() {
    applyMouse();
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    const { proximity, baseColor: bc, glowColor: gc, dotSize, glowIntensity, waveSpeed } = config;
    const proxSq = proximity * proximity;
    const time = (Date.now() - startTime) * 0.001 * waveSpeed;

    for (const d of dots) {
      const dx = d.x - mouse.x;
      const dy = d.y - mouse.y;
      const distSq = dx * dx + dy * dy;
      const wave = Math.sin(d.x * 0.02 + d.y * 0.02 + time) * 0.5 + 0.5;
      let opacity = d.baseOpacity + wave * 0.15;
      let scale = 1 + wave * 0.2;
      let r = bc.r, g = bc.g, b = bc.b, glow = 0;

      if (distSq < proxSq) {
        const dist = Math.sqrt(distSq);
        const t = 1 - dist / proximity;
        const e = t * t * (3 - 2 * t);
        r = Math.round(bc.r + (gc.r - bc.r) * e);
        g = Math.round(bc.g + (gc.g - bc.g) * e);
        b = Math.round(bc.b + (gc.b - bc.b) * e);
        opacity = Math.min(1, opacity + e * 0.7);
        scale += e * 0.8;
        glow = e * glowIntensity;
      }

      const radius = (dotSize / 2) * scale;

      if (glow > 0) {
        const grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, radius * 4);
        grad.addColorStop(0, `rgba(${gc.r},${gc.g},${gc.b},${glow * 0.4})`);
        grad.addColorStop(0.5, `rgba(${gc.r},${gc.g},${gc.b},${glow * 0.1})`);
        grad.addColorStop(1, `rgba(${gc.r},${gc.g},${gc.b},0)`);
        ctx.beginPath();
        ctx.arc(d.x, d.y, radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${opacity})`;
      ctx.fill();
    }

    raf = requestAnimationFrame(draw);
  }

  function start() {
    if (running) return;
    if (!visible) return;
    running = true;
    raf = requestAnimationFrame(draw);
  }

  function stop() {
    running = false;
    if (raf) {
      cancelAnimationFrame(raf);
      raf = null;
    }
    mouse = { x: -1000, y: -1000 };
    mouseDirty = false;
    lastMouseEvent = null;
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
  }

  function onMouseMove(e) {
    lastMouseEvent = e;
    mouseDirty = true;
  }

  function onMouseLeave() {
    mouse = { x: -1000, y: -1000 };
    mouseDirty = false;
    lastMouseEvent = null;
  }

  function onVisibility() {
    visible = !document.hidden;
    visible ? start() : stop();
  }

  const themeObserver = new MutationObserver(refreshConfig);
  themeObserver.observe(root, { attributes: true, attributeFilter: ['data-theme'] });

  const ro = new ResizeObserver(buildGrid);
  ro.observe(container);

  window.addEventListener('mousemove', onMouseMove, { passive: true });
  document.addEventListener('mouseleave', onMouseLeave);
  document.addEventListener('visibilitychange', onVisibility);

  function cleanup() {
    stop();
    themeObserver.disconnect();
    ro.disconnect();
    window.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseleave', onMouseLeave);
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('pagehide', cleanup);
  }
  window.addEventListener('pagehide', cleanup);

  buildGrid();
  start();
})();
