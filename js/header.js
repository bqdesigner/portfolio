// Wires header behaviors that depend on partials being present in the DOM:
// theme toggle, scroll show/hide, hamburger menu, controls expand/collapse.
// Listens for the `partials-ready` event dispatched by loader.js.
(function () {
  document.addEventListener('partials-ready', wireAll);

  function wireAll() {
    wireTheme();
    wireHeaderScroll();
    wireHamburger();
    wireBlogThemeSync();
  }

  // Decora links pra /blog com ?theme=<atual> pra sincronizar tema em dev (origins diferentes).
  // Em prod o blog roda no mesmo domínio via rewrite — localStorage compartilhado faz o trabalho;
  // o query param só vira ruído inofensivo, removido pelo bootstrap inline da página alvo.
  function wireBlogThemeSync() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="/blog"]');
      if (!a) return;
      try {
        var theme = document.documentElement.getAttribute('data-theme') || 'dark';
        var u = new URL(a.getAttribute('href'), location.origin);
        u.searchParams.set('theme', theme);
        a.setAttribute('href', u.pathname + u.search + u.hash);
      } catch (_) {}
    }, true);
  }

  function wireTheme() {
    var k = 'theme';
    var current = localStorage.getItem(k) || 'dark';
    function apply(m) {
      localStorage.setItem(k, m);
      document.documentElement.setAttribute('data-theme', m);
      document.querySelectorAll('.header-controls button[data-mode]').forEach(function (b) {
        b.classList.toggle('active', b.getAttribute('data-mode') === m);
      });
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', m === 'dark' ? '#191819' : '#FFFFFF');
    }
    apply(current);
    document.querySelectorAll('.header-controls').forEach(function (s) {
      s.addEventListener('click', function (e) {
        var b = e.target.closest('button[data-mode]');
        if (!b) return;
        apply(b.getAttribute('data-mode'));
      });
    });
  }

  function wireHeaderScroll() {
    var header = document.getElementById('header');
    if (!header) return;
    var lastY = 0;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      header.classList.toggle('header--scrolled', y > 50);
      if (y > 100) {
        if (y > lastY) header.classList.add('header--hidden');
        else header.classList.remove('header--hidden');
      } else {
        header.classList.remove('header--hidden');
      }
      lastY = y;
    }, { passive: true });
  }

  function wireHamburger() {
    var hamburger = document.getElementById('hamburger');
    var overlay = document.getElementById('mobileOverlay');
    if (!hamburger || !overlay) return;
    hamburger.addEventListener('click', function () {
      var isOpen = hamburger.classList.toggle('hamburger--open');
      overlay.classList.toggle('mobile-overlay--open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      hamburger.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });
    window.closeMobileMenu = function () {
      hamburger.classList.remove('hamburger--open');
      overlay.classList.remove('mobile-overlay--open');
      document.body.style.overflow = '';
      hamburger.setAttribute('aria-label', 'Abrir menu');
    };
  }
})();
