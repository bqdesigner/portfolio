// Fetches [data-partial] placeholders, injects markup, then dispatches `partials-ready`.
// Header/theme/menu wiring lives in header.js, which listens for that event.
(function () {
  var placeholders = document.querySelectorAll('[data-partial]');
  if (!placeholders.length) { dispatchReady(); return; }

  var promises = [];
  placeholders.forEach(function (el) {
    var name = el.getAttribute('data-partial');
    promises.push(
      fetch('partials/' + name + '.html')
        .then(function (r) { return r.text(); })
        .then(function (html) {
          // Strip live-server's injected hot-reload script (it gets wedged inside SVG)
          html = html.replace(/<!-- Code injected by live-server -->[\s\S]*?<\/script>/g, '');
          var parent = el.parentNode;
          if (!parent) return;
          var tpl = document.createElement('template');
          tpl.innerHTML = html;
          parent.insertBefore(tpl.content, el);
          parent.removeChild(el);
        })
        .catch(function (err) { console.error('partial', name, err); })
    );
  });

  Promise.all(promises).then(function () {
    dispatchReady();
    fitBigName();
  });

  function dispatchReady() {
    document.dispatchEvent(new CustomEvent('partials-ready'));
  }

  function fitBigName() {
    var els = document.querySelectorAll('.footer-bigname');
    if (!els.length) return;
    function fit() {
      els.forEach(function (el) {
        var cs = getComputedStyle(el);
        var pad = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
        var avail = el.clientWidth - pad;
        if (avail <= 0) return;
        el.style.fontSize = '100px';
        var contentW = 0;
        for (var i = 0; i < el.children.length; i++) contentW += el.children[i].getBoundingClientRect().width;
        if (contentW <= 0) return;
        el.style.fontSize = Math.floor(100 * avail / contentW * 0.98) + 'px';
      });
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fit);
    } else {
      fit();
    }
    var raf;
    window.addEventListener('resize', function () {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(fit);
    });
  }
})();
