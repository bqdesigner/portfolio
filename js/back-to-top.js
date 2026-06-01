// Voltar ao topo: easing suave no começo e aceleração depois (ease-in cubic).
// O botão #backToTop vive no footer carregado de forma assíncrona, por isso
// usamos delegação de clique no document.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  function scrollToTop() {
    var start = window.scrollY || document.documentElement.scrollTop || 0;
    if (start <= 0) return;
    if (reduce.matches) { window.scrollTo(0, 0); return; }

    // Desliga o scroll-behavior:smooth global durante a animação, senão o
    // navegador re-anima a cada frame e atropela o nosso easing.
    var root = document.documentElement;
    var prevBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';

    var duration = Math.min(1000, Math.max(500, start * 0.6));
    var startTime = null;
    function easeIn(t) { return t * t * t * t; } // bem lento no início, acelera no fim
    function step(now) {
      if (startTime === null) startTime = now;
      var p = Math.min(1, (now - startTime) / duration);
      window.scrollTo(0, Math.round(start * (1 - easeIn(p))));
      if (p < 1) requestAnimationFrame(step);
      else root.style.scrollBehavior = prevBehavior;
    }
    requestAnimationFrame(step);
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('#backToTop');
    if (!btn) return;
    e.preventDefault();
    scrollToTop();
  });
})();
