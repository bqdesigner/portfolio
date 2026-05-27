// Footer credit typewriter — triggers when footer scrolls into view
(function() {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initFooterCreditTypewriter() {
    var footerEl = document.getElementById('footerCredit');
    if (!footerEl) return;
    var text = footerEl.getAttribute('data-text');
    if (!text) return;

    footerEl.textContent = '';
    var words = text.split(' ');
    var spans = [];
    var cursor = document.createElement('span');
    cursor.className = 'footer-credit-cursor';

    words.forEach(function(word, i) {
      var span = document.createElement('span');
      span.className = 'fc-word';
      span.textContent = word + (i < words.length - 1 ? ' ' : '');
      footerEl.appendChild(span);
      spans.push(span);
    });

    var started = false;

    if (prefersReducedMotion) {
      spans.forEach(function(s) { s.classList.add('visible'); });
      return;
    }

    function startTypewriter() {
      if (started) return;
      started = true;
      var idx = 0;
      var interval = 80;

      function showNext() {
        if (idx >= spans.length) {
          spans[spans.length - 1].after(cursor);
          cursor.style.display = 'inline-block';
          return;
        }
        spans[idx].classList.add('visible');
        spans[idx].after(cursor);
        cursor.style.display = 'inline-block';
        idx++;
        setTimeout(showNext, interval);
      }

      setTimeout(showNext, 1000);
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          startTypewriter();
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });

    observer.observe(footerEl);
  }

  if (document.getElementById('footerCredit')) initFooterCreditTypewriter();
  else document.addEventListener('partials-ready', initFooterCreditTypewriter);
})();
