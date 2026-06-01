// Playground: slider horizontal dirigido pelo scroll vertical (somente desktop).
// O track (.playground-scroll) recebe altura de N viewports; enquanto a seção
// fica pinada (sticky), o progresso do scroll é traduzido em translateX nos
// cards. Scroll pra cima reverte automaticamente (é posição, não animação).
// No último card a seção despina e o scroll segue normal pro próximo bloco.
(function () {
  var scroll = document.querySelector('.playground-scroll');
  var grid = document.querySelector('.playground-grid');
  if (!scroll || !grid) return;

  var desktop = window.matchMedia('(min-width: 1091px)');
  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var maxShift = 0;
  var ticking = false;

  function active() {
    return desktop.matches && !motion.matches;
  }

  function setup() {
    if (!active()) {
      scroll.classList.remove('is-slider');
      scroll.style.height = '';
      grid.style.transform = '';
      return;
    }
    scroll.classList.add('is-slider');
    var cards = grid.children.length;
    // 1 viewport de scroll por card => range de pin = (N-1) viewports
    scroll.style.height = (cards * 100) + 'vh';
    var gap = parseFloat(getComputedStyle(grid).columnGap) || 0;
    maxShift = (cards - 1) * (window.innerWidth + gap);
    update();
  }

  function update() {
    ticking = false;
    if (!active()) return;
    var range = scroll.offsetHeight - window.innerHeight;
    var progress = range > 0 ? (-scroll.getBoundingClientRect().top) / range : 0;
    progress = Math.max(0, Math.min(1, progress));
    grid.style.transform = 'translate3d(' + (-progress * maxShift) + 'px,0,0)';
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  setup();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', setup, { passive: true });
  desktop.addEventListener('change', setup);
  motion.addEventListener('change', setup);
})();
