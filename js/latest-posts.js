// Renderiza os 3 posts mais recentes do blog na index.
// Same-origin nos dois ambientes: prod via rewrite /blog/* (vercel.json), dev via
// proxy /blog -> blog dev server (server.js). Por isso caminho relativo basta.
(function () {
  var BASE = '/blog';

  // Mesma paleta/hash do card do blog (_components/BlogList.js) pra cor da categoria.
  var PALETTE = ['#1DA1F2', '#C4A8FF', '#6BA6FF', '#8DD5A6', '#FFB347'];
  function catColor(name) {
    if (!name) return PALETTE[0];
    var h = 0;
    for (var i = 0; i < name.length; i++) h = (h + name.charCodeAt(i)) | 0;
    return PALETTE[Math.abs(h) % PALETTE.length];
  }

  function lang() { return localStorage.getItem('lang') || 'pt'; }

  function fmtDate(iso, l) {
    if (!iso) return '';
    var loc = l === 'en' ? 'en-US' : 'pt-BR';
    return new Date(iso).toLocaleDateString(loc, {
      day: '2-digit', month: 'short', year: 'numeric',
    }).replace(/\.$/, '');
  }

  var ARROW = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>';

  function card(post) {
    var l = lang();
    var color = catColor(post.category);

    var a = document.createElement('a');
    a.className = 'post-card';
    a.href = BASE + '/' + post.slug;
    a.style.setProperty('--cat-color', color);

    var top = document.createElement('div');
    top.className = 'post-top';
    if (post.category) {
      var cat = document.createElement('span');
      cat.className = 'post-cat';
      cat.textContent = post.category;
      cat.style.color = color;
      cat.style.borderColor = 'color-mix(in srgb, ' + color + ' 30%, transparent)';
      cat.style.background = 'color-mix(in srgb, ' + color + ' 8%, transparent)';
      top.appendChild(cat);
    }
    if (post.publishedAt) {
      var date = document.createElement('span');
      date.className = 'post-date';
      date.textContent = fmtDate(post.publishedAt, l);
      top.appendChild(date);
    }
    a.appendChild(top);

    var title = document.createElement('h3');
    title.className = 'post-title';
    title.textContent = post.title;
    a.appendChild(title);

    var meta = document.createElement('div');
    meta.className = 'post-readmeta';
    var lead = document.createElement('span');
    lead.textContent = l === 'en' ? 'Reading' : 'Leitura';
    var dot = document.createElement('span');
    dot.className = 'post-dot';
    var mins = document.createElement('span');
    mins.textContent = post.readingTime + ' min';
    meta.appendChild(lead); meta.appendChild(dot); meta.appendChild(mins);
    a.appendChild(meta);

    if (post.excerpt) {
      var p = document.createElement('p');
      p.className = 'post-preview';
      p.textContent = post.excerpt;
      a.appendChild(p);
    }

    if (post.tags && post.tags.length) {
      var tags = document.createElement('div');
      tags.className = 'post-tags';
      post.tags.forEach(function (t) {
        var span = document.createElement('span');
        span.className = 'post-tag';
        span.textContent = t;
        tags.appendChild(span);
      });
      a.appendChild(tags);
    }

    var arrow = document.createElement('span');
    arrow.className = 'post-arrow';
    arrow.innerHTML = ARROW;
    a.appendChild(arrow);

    return a;
  }

  function render(posts, listEl, section) {
    listEl.textContent = '';
    posts.forEach(function (p) { listEl.appendChild(card(p)); });
    section.removeAttribute('hidden');
  }

  function init() {
    var section = document.getElementById('escrita');
    var listEl = document.getElementById('writingList');
    if (!section || !listEl) return;

    fetch(BASE + '/api/latest-posts')
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (posts) {
        if (!Array.isArray(posts) || !posts.length) { section.remove(); return; }
        window.__latestPosts = posts;
        render(posts, listEl, section);
      })
      .catch(function () { section.remove(); });

    // Datas e labels ("Leitura"/"Reading") seguem o idioma atual.
    document.addEventListener('langchange', function () {
      if (window.__latestPosts) render(window.__latestPosts, listEl, section);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
