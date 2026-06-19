// Hero pinado coreografado por scroll (só na index). Ordem ESTRITAMENTE serial:
//   Fase 1 — shrink (1ª parte do scrub): no repouso o hero está full-bleed
//     (colado nas laterais e no topo, 100vh, sem raio). Ao scrollar ele encolhe
//     até o "tamanho atual": altura de repouso (--hero-h0) com frame 16/12px + raio.
//     Os cases ficam fora da tela.
//   Fase 2 — collapse (2ª parte): o card encolhe de --hero-h0 até 0 e o conteúdo
//     some (fade); os cases (.stack-projects, CSS: margin-top + z-index) sobem em
//     sincronia 1:1 — a distância do collapse = altura do card, então a borda de
//     baixo do card e o topo dos cases se encontram exatamente, sem buraco.
// O conteúdo do hero sobe sozinho: card é bottom-aligned + overflow:hidden, então
// ao encolher a altura a borda de baixo sobe levando o conteúdo. Off em reduced-motion.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  var scroll = document.querySelector('.hero-scroll');
  var hero = document.querySelector('.hero');
  if (!scroll || !hero) return;

  document.documentElement.classList.add('js-hero-motion');

  var ticking = false;

  function clamp(n, a, b) { return n < a ? a : n > b ? b : n; }

  function update() {
    ticking = false;
    var vh = window.innerHeight;
    var h0 = (window.matchMedia('(max-width: 767px)').matches ? 0.80 : 0.85) * vh;
    var d1 = vh;             // distância da fase 1 (full-bleed -> framed)
    var pinDur = d1 + h0;    // = pista (200vh + h0) - hero (100vh)

    var scrolled = clamp(-scroll.getBoundingClientRect().top, 0, pinDur);

    var frameK, cardH, op;
    if (scrolled <= d1) {
      // Fase 1: encolhe full-bleed -> framed.
      var e = scrolled / d1;          // 0..1
      frameK = e;                     // 0 (full-bleed) -> 1 (framed)
      cardH = vh - (vh - h0) * e;     // 100vh -> h0
      op = 1;
    } else {
      // Fase 2: collapse. Distância = h0, pros cases casarem 1:1.
      var c = (scrolled - d1) / h0;   // 0..1
      frameK = 1;
      cardH = h0 * (1 - c);           // h0 -> 0
      op = 1 - c;
    }

    hero.style.setProperty('--hero-frame', frameK);
    hero.style.setProperty('--hero-card-h', cardH + 'px');
    hero.style.setProperty('--hero-op', op);
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
