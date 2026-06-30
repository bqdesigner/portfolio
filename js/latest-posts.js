// Renderiza os 3 posts mais recentes do blog na index.
// Same-origin nos dois ambientes: prod via rewrite /blog/* (vercel.json), dev via
// proxy /blog -> blog dev server (server.js). Por isso caminho relativo basta.
// Card minimalista (categoria + título), espelhando o "Continue lendo" do blog.
(function () {
  var BASE = '/blog';

  function card(post) {
    var a = document.createElement('a');
    a.className = 'post-card';
    a.href = BASE + '/' + post.slug;

    if (post.category) {
      var cat = document.createElement('span');
      cat.className = 'post-cat';
      cat.textContent = post.category;
      a.appendChild(cat);
    }

    var title = document.createElement('span');
    title.className = 'post-title';
    title.textContent = post.title;
    a.appendChild(title);

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
        render(posts, listEl, section);
      })
      .catch(function () { section.remove(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
