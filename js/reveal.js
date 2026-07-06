// Reveal on scroll/load (index + cases): conteúdo surge com fade + translateY de
// baixo pra cima ao entrar na viewport. Fade só na 1ª aparição — depois fica
// visível (sem fade-out/in no scroll pra cima). Estado oculto é puro CSS (gated
// por .js-reveal); aqui só ligamos .reveal-in na interseção. Seletores que não
// existem na página atual simplesmente não casam. NÃO observa .stack-layer (sticky).
(function () {
  var html = document.documentElement;
  // .js-reveal só existe quando NÃO é prefers-reduced-motion → se ausente, nada
  // foi escondido pelo CSS; não há o que animar.
  if (!html.classList.contains('js-reveal')) return;

  var SELECTOR = [
    // index
    '.hero-title',
    '.hero-sub',
    '.section-label',
    '.cases > .case-row',
    '.logo-marquee',
    '.about-me-left > *',
    '.experience-list > *',
    // cases
    '.case-header-section',
    '.case-hero-visual',
    '.case-meta-item',
    '.case-section',
    '.case-img-full',
    '.next-case',
    // footer (partial, compartilhado)
    '.footer-col',
    '.footer-bigname',
    '.footer-credit'
  ].join(',');

  // Fallback sem IntersectionObserver: revela tudo pra não ficar oculto.
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll(SELECTOR).forEach(function (el) {
      el.classList.add('reveal-in');
    });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      // Revela uma vez e para de observar — nada de fade-out/in ao voltar.
      if (e.isIntersecting) {
        e.target.classList.add('reveal-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  var seen = new WeakSet();
  function observe() {
    document.querySelectorAll(SELECTOR).forEach(function (el) {
      if (seen.has(el)) return;
      seen.add(el);
      io.observe(el);
    });
  }

  observe();
  // Header/footer chegam via partials — reobserva quando o DOM deles existir.
  document.addEventListener('partials-ready', observe);
})();
