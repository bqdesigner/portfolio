// Barra de progresso fixa no rodapé — mesma mecânica do blog (ReadingProgress.js).
(function () {
  var bar = document.createElement('div');
  bar.className = 'reading-progress';
  var fill = document.createElement('div');
  fill.className = 'reading-progress-fill';
  bar.appendChild(fill);
  document.body.appendChild(bar);

  function onScroll() {
    var doc = document.documentElement;
    var scrolled = window.scrollY || doc.scrollTop || 0;
    var total = Math.max(doc.scrollHeight, document.body.scrollHeight) - (window.innerHeight || doc.clientHeight);
    var p = total > 0 ? Math.min(100, (scrolled / total) * 100) : 0;
    fill.style.width = p + '%';
  }

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
})();
