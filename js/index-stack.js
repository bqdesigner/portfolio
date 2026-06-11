// Posiciona o logo da home: dentro do hero-card por padrão, mas movido para o
// topo do body quando o menu mobile abre — senão ficaria atrás do overlay
// (stacking context próprio do hero).
(function () {
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
  // Footer/header chegam via partials; reposiciona quando o DOM deles existir.
  document.addEventListener('partials-ready', function () {
    placeLogo();
    watchOverlay();
  });
})();
