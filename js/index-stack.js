// Stacking scroll da home: cada camada (.stack-layer) gruda via position:sticky
// e a próxima rola por cima — hero < projects < about-me < footer.
// top = min(0, innerHeight - alturaDaCamada):
//  - camada mais alta que a tela → top negativo → gruda alinhada embaixo, ou
//    seja, rola até revelar todo o conteúdo e só então congela enquanto a
//    próxima sobe por cima;
//  - camada menor que a tela → top 0 → gruda no topo.
(function () {
  var layers = Array.prototype.slice.call(document.querySelectorAll('.stack-layer'));
  if (!layers.length) return;

  function recompute() {
    var vh = window.innerHeight;
    layers.forEach(function (el) {
      el.style.top = Math.min(0, vh - el.offsetHeight) + 'px';
    });
  }

  // O header (menu) fica no topo do body pra ficar sempre fixo/à frente. O logo
  // mora dentro do hero-card (rola junto com o hero e é coberto pelos projetos),
  // MAS quando o menu abre ele precisa aparecer sobre o overlay — e dentro do
  // hero (stacking context próprio) ficaria atrás do overlay. Então: menu aberto
  // → logo no topo do body (z-index vence o overlay); menu fechado → logo no
  // hero-card.
  function placeLogo() {
    var logo = document.getElementById('logoLink');
    var card = document.querySelector('.hero-card');
    if (!logo || !card) return;
    var overlay = document.getElementById('mobileOverlay');
    var open = overlay && overlay.classList.contains('mobile-overlay--open');
    if (open) {
      if (logo.parentElement !== document.body) document.body.appendChild(logo);
    } else if (!card.contains(logo)) {
      card.insertBefore(logo, card.firstChild);
    }
  }

  function watchOverlay() {
    var overlay = document.getElementById('mobileOverlay');
    if (overlay && window.MutationObserver) {
      new MutationObserver(placeLogo).observe(overlay, {
        attributes: true,
        attributeFilter: ['class'],
      });
    }
  }

  placeLogo();
  recompute();
  window.addEventListener('resize', recompute, { passive: true });
  window.addEventListener('load', recompute);
  // Footer/header chegam via partials; recalcula quando o DOM deles existir.
  document.addEventListener('partials-ready', function () {
    placeLogo();
    watchOverlay();
    recompute();
  });

  // Imagens (cards, carrossel) mudam a altura das camadas ao carregar.
  if (window.ResizeObserver) {
    var ro = new ResizeObserver(recompute);
    layers.forEach(function (el) { ro.observe(el); });
  }
})();
