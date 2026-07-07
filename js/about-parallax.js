// Parallax sutil da foto do about-me: a imagem (118% da altura do card) drifta
// verticalmente conforme a posição do card na viewport. rAF-throttled, só roda
// com o card visível (IntersectionObserver) e nunca com prefers-reduced-motion.
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var card = document.querySelector('.about-photo-card');
  var img = card && card.querySelector('img');
  if (!img) return;

  // Curso máximo: ±7% da altura da imagem (folga de 9% de cada lado do crop).
  var RANGE = 0.07;
  var visible = false, raf = null;

  function update() {
    raf = null;
    var r = card.getBoundingClientRect();
    var vh = window.innerHeight || 1;
    // -1 (card abaixo da viewport) .. 0 (centrado) .. 1 (acima)
    var p = (vh / 2 - (r.top + r.height / 2)) / (vh / 2 + r.height / 2);
    if (p < -1) p = -1; else if (p > 1) p = 1;
    img.style.transform = 'translate3d(0,' + (p * RANGE * 100).toFixed(2) + '%,0)';
  }

  function schedule() {
    if (visible && !raf) raf = requestAnimationFrame(update);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      schedule();
    }).observe(card);
  } else {
    visible = true;
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  visible = true; // garante 1º frame correto antes do IO disparar
  schedule();
})();
