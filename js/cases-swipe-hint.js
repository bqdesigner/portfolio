// Dica de swipe lateral nos cases (mobile): quando o 1º case-row fica totalmente
// visível, o carrossel faz um nudge horizontal pra sinalizar que há mais cases
// pro lado. Dispara só uma vez. Gated por .js-reveal (respeita reduced-motion) e
// só no breakpoint mobile, onde os cases viram scroll horizontal.
(function () {
  var html = document.documentElement;
  if (!html.classList.contains('js-reveal')) return;
  if (!window.matchMedia || !window.matchMedia('(max-width: 767px)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  var cases = document.querySelector('.cases');
  var first = document.querySelector('.cases > .case-row');
  if (!cases || !first) return;

  // Nudge via scroll real: revela o início do próximo case (continuação) e volta.
  // Repete 2x. Desliga o snap durante o gesto pra não voltar/avançar abrupto.
  function nudge(done) {
    cases.scrollTo({ left: 56, behavior: 'smooth' });
    setTimeout(function () {
      cases.scrollTo({ left: 0, behavior: 'smooth' });
      setTimeout(done, 450);
    }, 450);
  }

  function play() {
    var snap = cases.style.scrollSnapType;
    cases.style.scrollSnapType = 'none';
    nudge(function () {
      nudge(function () { cases.style.scrollSnapType = snap; });
    });
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && e.intersectionRatio >= 0.9) {
        io.disconnect();
        // pequeno atraso pra deixar o reveal do card terminar antes do nudge
        setTimeout(play, 600);
      }
    });
  }, { threshold: 0.9 });

  io.observe(first);
})();
