/* WISECHAT — motion & interactions */
(function(){
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('anim');

  /* ---- nav scrolled state ---- */
  var nav = document.querySelector('.nav');
  function onScroll(){
    if(window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ---- reversible reveal: rise in from below scrolling down,
         sink back out scrolling up (each element follows its own position) ---- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  function revealCheck(){
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var line = vh * 0.86;            // reveal once the element's top rises above this line
    for(var i=0;i<reveals.length;i++){
      var el = reveals[i];
      var on = el.getBoundingClientRect().top < line;
      if(on !== el.classList.contains('in')){
        el.classList.toggle('in', on);
        if(!on) el.style.opacity = '';   // clear safety-net override so it can fade back out
      }
    }
  }
  // Safety net: some environments PAUSE css transitions (offscreen capture / screenshot
  // tools), freezing a fade at opacity 0. Timers still fire, so once an element should
  // have finished appearing, force it visible. Real browsers complete the fade first,
  // making this a no-op there.
  function settle(){
    for(var i=0;i<reveals.length;i++){ if(reveals[i].classList.contains('in')) reveals[i].style.opacity = '1'; }
  }
  var rafPending = false, settleTimer = 0;
  function onMove(){
    if(!rafPending){ rafPending = true; requestAnimationFrame(function(){ rafPending = false; revealCheck(); }); }
    clearTimeout(settleTimer); settleTimer = setTimeout(settle, 750);
  }
  window.addEventListener('scroll', onMove, {passive:true});
  document.addEventListener('scroll', onMove, {passive:true, capture:true});
  window.addEventListener('resize', onMove);
  document.addEventListener('wheel', onMove, {passive:true});
  document.addEventListener('touchmove', onMove, {passive:true});

  // paint the hidden pre-state for one frame, then reveal so the load entrance animates in
  requestAnimationFrame(function(){ requestAnimationFrame(revealCheck); });
  setTimeout(revealCheck,200);
  setTimeout(settle,1400);
  window.addEventListener('load', revealCheck);

  /* ---- count-up stats (rect-triggered) ---- */
  var counted = false;
  function animateCounts(){
    if(counted) return; counted = true;
    document.querySelectorAll('.n[data-to]').forEach(function(el){
      var to = parseFloat(el.getAttribute('data-to'));
      var suf = el.getAttribute('data-suf')||'';
      var pre = el.getAttribute('data-pre')||'';
      var dec = parseInt(el.getAttribute('data-dec')||'0',10);
      var dur = 1500, t0 = performance.now();
      function fmt(v){ return pre + (dec? v.toFixed(dec).replace('.',',') : Math.round(v).toLocaleString('pt-BR')) + suf; }
      function tick(now){
        var p = Math.min((now-t0)/dur,1);
        var e = 1-Math.pow(1-p,3);
        el.textContent = fmt(to*e);
        if(p<1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      // failsafe: if rAF is throttled/frozen, still land on the final value
      setTimeout(function(){ el.textContent = fmt(to); }, dur + 150);
    });
  }
  var statsWrap = document.querySelector('.stats');
  function statCheck(){
    if(counted || !statsWrap) return;
    var r = statsWrap.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    if(r.top < vh*0.82 && r.bottom > vh*0.10){ animateCounts(); }
  }
  window.addEventListener('scroll', statCheck, {passive:true});
  document.addEventListener('scroll', statCheck, {passive:true, capture:true});
  window.addEventListener('resize', statCheck);
  document.addEventListener('wheel', statCheck, {passive:true});
  document.addEventListener('touchmove', statCheck, {passive:true});
  // only count once the stats actually scroll into view (so the count is visible)
  if('IntersectionObserver' in window && statsWrap){
    var sio = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting && e.intersectionRatio >= 0.25){ animateCounts(); sio.disconnect(); } });
    }, {threshold:[0,0.25,0.5]});
    sio.observe(statsWrap);
  }
  statCheck();
  setTimeout(statCheck,400);

  /* ---- year ---- */
  var y = document.getElementById('yr'); if(y) y.textContent = new Date().getFullYear();

  /* ---- interactive insights accordion (must run even with reduced motion) ---- */
  (function(){
    var items = Array.prototype.slice.call(document.querySelectorAll('.di-item'));
    var shots = Array.prototype.slice.call(document.querySelectorAll('.di-shots img'));
    var urlEl = document.querySelector('[data-di-url]');
    if(!items.length) return;
    function activate(i){
      items.forEach(function(it,k){
        var on = k===i;
        it.classList.toggle('active', on);
        it.setAttribute('aria-expanded', on ? 'true' : 'false');
      });
      shots.forEach(function(im,k){ im.classList.toggle('active', k===i); });
      if(urlEl && items[i]){ var u = items[i].getAttribute('data-url'); if(u) urlEl.textContent = u; }
    }
    /* scroll-driven: the panel is pinned; track progress decides the active item.
       Clicks set the active item directly and stay put until you scroll into a
       *different* band (hysteresis), so items remain freely clickable. */
    var track = document.querySelector('.di-track');
    var current = 0;
    var lastScrollIdx = 0;   // band the scroll position last resolved to
    function clampi(v,a,b){ return v<a?a:(v>b?b:v); }

    function scrollIdx(){
      var vh = window.innerHeight || document.documentElement.clientHeight;
      if(track && track.offsetHeight > vh*1.4){
        var tr = track.getBoundingClientRect();
        var total = track.offsetHeight - vh;
        var p = clampi((-tr.top) / total, 0, 1);
        return clampi(Math.floor(p*items.length), 0, items.length-1);
      }
      // short layout (mobile): row nearest the reading anchor
      var anchor = vh*0.45, best=0, bd=Infinity;
      for(var i=0;i<items.length;i++){
        var rr = (items[i].querySelector('.di-row')||items[i]).getBoundingClientRect();
        var c = rr.top + rr.height/2, d = Math.abs(c - anchor);
        if(d < bd){ bd = d; best = i; }
      }
      return best;
    }

    /* a click activates the item immediately and overrides the scroll-driven state
       until the user scrolls into a new band */
    items.forEach(function(it,i){
      it.addEventListener('click', function(){ current = i; activate(i); });
    });

    function scrollSync(){
      if(!items.length) return;
      var idx = scrollIdx();
      // only let scrolling take over when the resolved band actually changes,
      // so a manual click isn't instantly re-overridden on the same band
      if(idx !== lastScrollIdx){
        lastScrollIdx = idx;
        if(idx !== current){ current = idx; activate(idx); }
      }
    }
    window.addEventListener('scroll', scrollSync, {passive:true});
    document.addEventListener('scroll', scrollSync, {passive:true, capture:true});
    window.addEventListener('resize', scrollSync);
    document.addEventListener('wheel', scrollSync, {passive:true});
    document.addEventListener('touchmove', scrollSync, {passive:true});
    scrollSync();
    setTimeout(scrollSync,300);
  })();

  /* ---- centralization canvas (final CTA): channels flowing into one hub ---- */
  (function(){
    var c = document.getElementById('centralCanvas');
    if(!c) return;
    var ctx = c.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W=0,H=0,cx=0,cy=0, nodes=[], parts=[];
    function resize(){
      var r = c.getBoundingClientRect();
      W = r.width||900; H = r.height||420;
      c.width = W*dpr; c.height = H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
      cx = W/2; cy = H/2; nodes = [];
      var N = 11;
      for(var i=0;i<N;i++){
        var a = (i/N)*Math.PI*2 - Math.PI/2;
        nodes.push({x: cx+Math.cos(a)*W*0.47, y: cy+Math.sin(a)*H*0.46});
      }
    }
    function spawn(seed){
      var n = nodes[(Math.random()*nodes.length)|0];
      parts.push({ox:n.x, oy:n.y, t: seed?Math.random():0, sp:0.004+Math.random()*0.0065,
                  col: Math.random()<0.5 ? '#9a8cff' : '#e05ff0'});
    }
    function frame(){
      if(!W) return;
      ctx.clearRect(0,0,W,H);
      ctx.lineWidth = 1;
      nodes.forEach(function(n){
        var g = ctx.createLinearGradient(n.x,n.y,cx,cy);
        g.addColorStop(0,'rgba(139,125,255,0.03)');
        g.addColorStop(1,'rgba(214,69,230,0.18)');
        ctx.strokeStyle = g; ctx.beginPath(); ctx.moveTo(n.x,n.y); ctx.lineTo(cx,cy); ctx.stroke();
        ctx.fillStyle = 'rgba(180,170,255,.45)'; ctx.beginPath(); ctx.arc(n.x,n.y,2.4,0,7); ctx.fill();
      });
      for(var i=parts.length-1;i>=0;i--){
        var p = parts[i]; p.t += p.sp;
        if(p.t>=1){ parts.splice(i,1); continue; }
        var e = p.t*p.t;
        var x = p.ox+(cx-p.ox)*e, yv = p.oy+(cy-p.oy)*e;
        ctx.globalAlpha = Math.max(0, Math.min(1, 1-p.t+0.25));
        ctx.fillStyle = p.col; ctx.beginPath(); ctx.arc(x,yv,2.1,0,7); ctx.fill();
      }
      ctx.globalAlpha = 1;
      var pr = 9 + Math.sin(Date.now()*0.002)*3;
      var hg = ctx.createRadialGradient(cx,cy,0,cx,cy,46);
      hg.addColorStop(0,'rgba(214,69,230,.45)'); hg.addColorStop(1,'rgba(214,69,230,0)');
      ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(cx,cy,46,0,7); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(cx,cy,pr+6,0,7); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(cx,cy,4.5,0,7); ctx.fill();
      if(!reduce){ if(Math.random()<0.55) spawn(false); requestAnimationFrame(frame); }
    }
    resize();
    window.addEventListener('resize', function(){ resize(); if(reduce) frame(); });
    for(var i=0;i<46;i++) spawn(true);
    frame();
  })();

  if(reduce) return;

  /* ---- hero glow: intensifies as you scroll down, eases back to light going up ---- */
  (function(){
    var glow = document.querySelector('.stage-glow');
    if(!glow) return;
    var ramp = 720, ticking = false;
    function apply(){
      ticking = false;
      var p = Math.min(Math.max(window.scrollY / ramp, 0), 1);
      var e = p*p*(3-2*p);                 // smoothstep
      // top of page = current (light) look; scrolling down strengthens the gradient
      glow.style.filter = 'brightness(' + (1 + e*0.9).toFixed(3) + ') saturate(' + (1 + e*0.45).toFixed(3) + ')';
    }
    function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(apply); } }
    window.addEventListener('scroll', onScroll, {passive:true});
    apply();
  })();

  /* ---- hero parallax: tilt mockup + drift chips with mouse ---- */
  var stage = document.querySelector('.stage');
  var tilt  = document.querySelector('.hero-stage-tilt');
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  if(stage && tilt){
    var tx=0,ty=0,cx=0,cy=0;
    stage.addEventListener('mousemove', function(ev){
      var r = stage.getBoundingClientRect();
      tx = ((ev.clientX - r.left)/r.width - .5);
      ty = ((ev.clientY - r.top)/r.height - .5);
    });
    stage.addEventListener('mouseleave', function(){ tx=0; ty=0; });
    (function raf(){
      cx += (tx-cx)*.06; cy += (ty-cy)*.06;
      tilt.style.transform = 'rotateX('+(13 - cy*9)+'deg) rotateY('+(cx*9)+'deg) scale(.98)';
      chips.forEach(function(ch,i){
        var depth = (i+1)*9;
        ch.style.transform = 'translate3d('+(cx*depth)+'px,'+(cy*depth)+'px,0)';
      });
      requestAnimationFrame(raf);
    })();
  }

  /* ---- gentle parallax drift on scroll for section media ---- */
  var floaters = Array.prototype.slice.call(document.querySelectorAll('[data-par]'));
  function parScroll(){
    var vh = window.innerHeight;
    floaters.forEach(function(el){
      var r = el.getBoundingClientRect();
      var center = r.top + r.height/2;
      var off = (center - vh/2)/vh;
      var sp = parseFloat(el.getAttribute('data-par')) || 0.06;
      el.style.setProperty('--py', (off*sp*-70)+'px');
    });
    requestAnimationFrame(parScroll);
  }
  if(floaters.length) requestAnimationFrame(parScroll);

  /* ---- integration logos: fall back to the letter chip if a logo fails ---- */
  (function(){
    function fix(img){ var g = img.parentNode; if(!g) return; img.remove(); g.textContent = g.getAttribute('data-l') || ''; }
    Array.prototype.slice.call(document.querySelectorAll('.intg .glyph img')).forEach(function(img){
      if(img.complete && img.naturalWidth === 0){ fix(img); }
      else { img.addEventListener('error', function(){ fix(img); }); }
    });
  })();
})();
