// Cursor customizado "Ver case" sobre as imagens dos cases (.card-img-case).
// Pílula glassmorphism que segue o mouse com follow suave; some/aparece com
// fade + spring. Só em dispositivos com mouse fino (não toca em touch).
// A cor (clara/escura) muda automaticamente conforme o brilho do pixel da
// imagem sob o cursor — fica legível tanto em UI clara quanto escura.
(function () {
  if (!window.matchMedia ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  var cards = document.querySelectorAll('.card-img-case');
  if (!cards.length) return;

  var TEXT = { pt: 'Ver case', en: 'View case' };
  function curLang() { return localStorage.getItem('lang') === 'en' ? 'en' : 'pt'; }

  var cursor = document.createElement('div');
  cursor.className = 'case-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  var pill = document.createElement('div');
  pill.className = 'case-cursor-pill';
  var label = document.createElement('span');
  label.textContent = TEXT[curLang()];
  pill.appendChild(label);
  pill.insertAdjacentHTML('beforeend',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg>');
  cursor.appendChild(pill);
  document.body.appendChild(cursor);
  document.body.classList.add('case-cursor-on');

  // Texto acompanha a troca de idioma (evento disparado pelo lang-switcher)
  document.addEventListener('langchange', function (e) {
    label.textContent = TEXT[(e.detail && e.detail.lang === 'en') ? 'en' : 'pt'];
  });

  // Canvas reduzido por imagem (cache) pra ler o pixel sob o cursor
  var canvasCache = new WeakMap();
  function getCanvas(img) {
    var c = canvasCache.get(img);
    if (c) return c;
    if (!img.complete || !img.naturalWidth) return null;
    var cw = 80, ch = Math.max(1, Math.round(80 * img.naturalHeight / img.naturalWidth));
    var cv = document.createElement('canvas');
    cv.width = cw; cv.height = ch;
    var cx = cv.getContext('2d', { willReadFrequently: true });
    try { cx.drawImage(img, 0, 0, cw, ch); } catch (e) { return null; }
    c = { cv: cv, cx: cx };
    canvasCache.set(img, c);
    return c;
  }

  // Retângulo real da imagem renderizada (considera object-fit: contain dos mockups)
  function sampleDark(img) {
    var c = getCanvas(img);
    if (!c) return false;
    var box = img.getBoundingClientRect();
    var ar = img.naturalWidth / img.naturalHeight;
    var w, h;
    if (box.width / box.height > ar) { h = box.height; w = h * ar; }
    else { w = box.width; h = w / ar; }
    var left = box.left + (box.width - w) / 2;
    var top = box.top + (box.height - h) / 2;
    var rx = (lastX - left) / w, ry = (lastY - top) / h;
    // Fora da imagem (letterbox) = fundo do card (cor de marca, escura) → cursor claro
    if (rx < 0 || rx > 1 || ry < 0 || ry > 1) return false;
    var px = c.cx.getImageData(
      Math.min(c.cv.width - 1, Math.floor(rx * c.cv.width)),
      Math.min(c.cv.height - 1, Math.floor(ry * c.cv.height)), 1, 1).data;
    if (px[3] < 40) return false; // transparente = fundo escuro do card
    var lum = 0.2126 * px[0] + 0.7152 * px[1] + 0.0722 * px[2];
    return lum > 140; // claro → cursor escuro
  }

  var hoverImg = null, lastX = 0, lastY = 0, raf = null;
  document.addEventListener('mousemove', function (e) {
    lastX = e.clientX;
    lastY = e.clientY;
    if (!raf) {
      raf = requestAnimationFrame(function () {
        raf = null;
        cursor.style.transform = 'translate3d(' + lastX + 'px,' + lastY + 'px,0)';
        if (hoverImg) cursor.classList.toggle('is-dark', sampleDark(hoverImg));
      });
    }
  });

  for (var i = 0; i < cards.length; i++) {
    (function (card) {
      var img = card.querySelector('img');
      card.addEventListener('mouseenter', function () {
        hoverImg = img;
        cursor.classList.add('is-visible');
        if (img) cursor.classList.toggle('is-dark', sampleDark(img));
      });
      card.addEventListener('mouseleave', function () {
        hoverImg = null;
        cursor.classList.remove('is-visible');
        cursor.classList.remove('is-dark');
      });
    })(cards[i]);
  }
})();
