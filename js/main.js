// Reduced motion preference
var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scroll indicator: scroll to #trabalhos
var scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
  function scrollToWork() {
    var target = document.getElementById('trabalhos');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  }
  scrollIndicator.addEventListener('click', scrollToWork);
  scrollIndicator.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scrollToWork(); }
  });
}

// Logo: smooth scroll to top (logo lives in header partial — wait for it)
function bindLogoSmoothScroll() {
  var logoLink = document.getElementById('logoLink');
  if (!logoLink) return;
  var isIndex = /\/(index(\.html)?)?$/.test(location.pathname);
  if (!isIndex) return; // outras páginas: href="index.html" navega normalmente
  logoLink.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
if (document.getElementById('logoLink')) bindLogoSmoothScroll();
else document.addEventListener('partials-ready', bindLogoSmoothScroll);

// Back to top smooth scroll (button lives in async-loaded footer partial)
document.addEventListener('click', function (e) {
  var btn = e.target.closest && e.target.closest('#backToTop');
  if (!btn) return;
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Header scroll, hamburger, closeMobileMenu live in partials/loader.js

// Typewriter animation — word by word, cursor follows last visible word
(function() {
  var lines = document.querySelectorAll('.typewriter-line');
  var allWords = [];
  var wordToLine = [];

  var cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  cursor.style.display = 'none';

  lines.forEach(function(line, lineIdx) {
    var text = line.getAttribute('data-text');
    if (!text) return;
    var words = text.split(' ');
    words.forEach(function(word, i) {
      var span = document.createElement('span');
      span.className = 'word';
      span.textContent = word + (i < words.length - 1 ? ' ' : '');
      line.appendChild(span);
      allWords.push(span);
      wordToLine.push(lineIdx);
    });
  });

  // If reduced motion, show all words immediately
  if (prefersReducedMotion) {
    allWords.forEach(function(w) { w.classList.add('visible'); });
    var indicator = document.querySelector('.scroll-indicator');
    if (indicator) indicator.classList.add('scroll-indicator--visible');
    return;
  }

  var wordIndex = 0;
  var delay = 300;
  var interval = 60;

  function showNext() {
    if (wordIndex >= allWords.length) {
      allWords[allWords.length - 1].after(cursor);
      cursor.style.display = 'inline-block';
      var indicator = document.querySelector('.scroll-indicator');
      if (indicator) indicator.classList.add('scroll-indicator--visible');
      return;
    }

    var currentWord = allWords[wordIndex];
    currentWord.classList.add('visible');

    currentWord.after(cursor);
    cursor.style.display = 'inline-block';

    var lineEl = currentWord.parentElement;
    if (lineEl.classList.contains('muted')) {
      cursor.style.background = 'var(--color-mid)';
    } else {
      cursor.style.background = 'var(--color-deep)';
    }

    wordIndex++;

    var currentLine = wordToLine[wordIndex - 1];
    var nextLine = wordIndex < allWords.length ? wordToLine[wordIndex] : -1;
    var nextDelay = nextLine !== currentLine ? 400 : interval;

    setTimeout(showNext, nextDelay);
  }

  setTimeout(showNext, delay);
})();

// Disable link navigation on project cards (cases not ready), except linked ones
document.querySelectorAll('.project-card:not(.project-card--link)').forEach(function(card) {
  card.style.cursor = 'default';
  card.addEventListener('click', function(e) {
    e.preventDefault();
  });
});

// Footer credit typewriter — triggers when footer scrolls into view
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

  // If reduced motion, show all words immediately
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

// Logo marquee — infinite scroll, reverses on scroll up, pauses on hover
(function() {
  var track = document.getElementById('marqueeTrack');
  if (!track) return;

  // Skip marquee animation for reduced motion
  if (prefersReducedMotion) return;

  var originalHTML = track.innerHTML;
  track.innerHTML = originalHTML + originalHTML + originalHTML + originalHTML;

  var speed = 0.5;
  var paused = false;
  var position = 0;
  var scrollDirection = -1;
  var prevScrollY = window.scrollY;
  var rafId = null;

  window.addEventListener('scroll', function() {
    var currentY = window.scrollY;
    if (currentY > prevScrollY) {
      scrollDirection = -1;
    } else if (currentY < prevScrollY) {
      scrollDirection = 1;
    }
    prevScrollY = currentY;
  }, { passive: true });

  track.parentElement.addEventListener('mouseenter', function() {
    paused = true;
  });
  track.parentElement.addEventListener('mouseleave', function() {
    paused = false;
  });

  var singleSetWidth = 0;

  function measureSet() {
    var items = track.querySelectorAll('img');
    var perSet = items.length / 4;
    singleSetWidth = 0;
    for (var i = 0; i < perSet; i++) {
      singleSetWidth += items[i].offsetWidth + 48;
    }
  }

  function animate() {
    if (!paused) {
      position -= speed * scrollDirection;

      if (position <= -singleSetWidth) {
        position += singleSetWidth;
      } else if (position >= 0) {
        position -= singleSetWidth;
      }

      track.style.transform = 'translate3d(' + position + 'px, 0, 0)';
    }
    rafId = requestAnimationFrame(animate);
  }

  // Pause when tab is not visible
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    } else {
      if (!rafId) animate();
    }
  });

  window.addEventListener('load', function() {
    requestAnimationFrame(function() {
      measureSet();
      position = -1;
      animate();
    });
  });

  window.addEventListener('resize', function() {
    measureSet();
  });
})();

(function decorateNickname() {
  var line = document.querySelector('.typewriter-line[data-i18n-page="hero.line0"]');
  if (!line) return;
  function apply() {
    line.querySelectorAll('.word').forEach(function (w) {
      if (/Brunão/.test(w.textContent)) w.classList.add('hero-nickname');
    });
  }
  apply();
  new MutationObserver(apply).observe(line, { childList: true, subtree: true });
})();

(function waveCursor() {
  var outer = document.createElement('div');
  outer.className = 'wave-cursor';
  outer.setAttribute('aria-hidden', 'true');
  var inner = document.createElement('span');
  inner.className = 'wave-cursor-inner';
  inner.textContent = '👋';
  outer.appendChild(inner);
  document.body.appendChild(outer);

  var active = false;
  document.addEventListener('mousemove', function (e) {
    if (!active) return;
    outer.style.transform = 'translate(' + (e.clientX - 4) + 'px, ' + (e.clientY - 4) + 'px)';
  }, { passive: true });
  document.addEventListener('mouseover', function (e) {
    var t = e.target;
    if (t && t.classList && t.classList.contains('hero-nickname')) {
      active = true;
      outer.classList.add('active');
    }
  });
  document.addEventListener('mouseout', function (e) {
    var t = e.target;
    if (t && t.classList && t.classList.contains('hero-nickname')) {
      active = false;
      outer.classList.remove('active');
    }
  });
})();

// Hero intro: remove max-width/clip-path constraints after animation so wide
// text (e.g. "DE EXPERIÊNCIA" on small viewports) isn't clipped. Uses
// !important to override the animation's forwards-filled values (animation
// origin outranks normal author styles in the cascade).
document.querySelectorAll('.hero-title-text').forEach(function (el) {
  el.addEventListener('animationend', function (e) {
    if (e.animationName === 'hero-text-in') {
      el.style.setProperty('max-width', 'none', 'important');
      el.style.setProperty('clip-path', 'none', 'important');
    }
  });
});

// Hero shape cover-on-scroll: --hero-cover (0→1) drives scaleX on shapes.
(function () {
  if (prefersReducedMotion) return;
  var hero = document.querySelector('.hero');
  if (!hero) return;
  var rafId = null;
  function update() {
    rafId = null;
    var h = hero.offsetHeight || 1;
    var scrolled = Math.max(0, -hero.getBoundingClientRect().top);
    var p = Math.min(scrolled / h, 1);
    hero.style.setProperty('--hero-cover', p.toFixed(3));
  }
  window.addEventListener('scroll', function () {
    if (rafId == null) rafId = requestAnimationFrame(update);
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
