/* ══ Presentation engine ════════════════════════════════════════════
   Keyboard, fullscreen, overview, speaker notes, deep-link via #N.
   ════════════════════════════════════════════════════════════════════ */

const slides = Array.from(document.querySelectorAll('.slide'));
const total = slides.length;
let current = 0;

const els = {
  prev:        document.getElementById('prevBtn'),
  next:        document.getElementById('nextBtn'),
  curIdx:      document.getElementById('curIdx'),
  totIdx:      document.getElementById('totIdx'),
  fs:          document.getElementById('fsBtn'),
  ov:          document.getElementById('overviewBtn'),
  sp:          document.getElementById('speakerBtn'),
  help:        document.getElementById('helpBtn'),
  overview:    document.getElementById('overview'),
  ovGrid:      document.getElementById('overviewGrid'),
  ovClose:     document.getElementById('overviewClose'),
  speaker:     document.getElementById('speakerPanel'),
  spIdx:       document.getElementById('speakerIdx'),
  spTime:      document.getElementById('speakerTime'),
  spNotes:     document.getElementById('speakerNotes'),
  spClose:     document.getElementById('speakerClose'),
  helpModal:   document.getElementById('helpModal'),
  helpClose:   document.getElementById('helpClose'),
  progress:    document.getElementById('progressFill'),
  timeBadge:   document.getElementById('timeBadge'),
};

els.totIdx.textContent = total;

/* ── Slide rendering ─────────────────────────────────────────────── */
function show(idx, opts = {}) {
  if (idx < 0) idx = 0;
  if (idx >= total) idx = total - 1;

  slides.forEach((s, i) => {
    s.classList.remove('is-active', 'is-prev');
    if (i === idx) s.classList.add('is-active');
    else if (i < idx) s.classList.add('is-prev');
  });

  current = idx;
  els.curIdx.textContent = String(idx + 1).padStart(2, '0');
  els.progress.style.width = `${((idx + 1) / total) * 100}%`;

  // Time badge
  const t = slides[idx].dataset.time || '—';
  els.timeBadge.textContent = t === '—' ? '—' : `Bloco · ${t}`;

  // Speaker notes
  if (!els.speaker.hidden) syncSpeaker();

  // Overview highlight
  if (!els.overview.hidden) syncOverview();

  // Hash sync
  if (!opts.silent) {
    history.replaceState(null, '', `#${idx + 1}`);
  }

  // Reset scroll inside slide
  slides[idx].scrollTop = 0;
}

function next() { show(current + 1); }
function prev() { show(current - 1); }

/* ── Keyboard ────────────────────────────────────────────────────── */
window.addEventListener('keydown', (e) => {
  // Ignore typing in inputs
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

  // Help modal — Esc closes
  if (!els.helpModal.hidden && e.key === 'Escape') { closeHelp(); return; }
  if (!els.overview.hidden && e.key === 'Escape')  { closeOverview(); return; }
  if (!els.speaker.hidden && e.key === 'Escape')   { toggleSpeaker(); return; }

  switch (e.key) {
    case 'ArrowRight':
    case 'PageDown':
    case ' ':
      e.preventDefault(); next(); break;
    case 'ArrowLeft':
    case 'PageUp':
      e.preventDefault(); prev(); break;
    case 'Home':
      e.preventDefault(); show(0); break;
    case 'End':
      e.preventDefault(); show(total - 1); break;
    case 'f':
    case 'F':
      toggleFullscreen(); break;
    case 'o':
    case 'O':
      toggleOverview(); break;
    case 's':
    case 'S':
      toggleSpeaker(); break;
    case '?':
      toggleHelp(); break;
    case 'Escape':
      if (document.fullscreenElement) document.exitFullscreen();
      break;
    default:
      // Number keys → jump to slide
      if (/^[1-9]$/.test(e.key)) {
        const n = parseInt(e.key, 10) - 1;
        if (n < total) show(n);
      }
  }
});

/* ── HUD click ───────────────────────────────────────────────────── */
els.next.addEventListener('click', next);
els.prev.addEventListener('click', prev);
els.fs.addEventListener('click', toggleFullscreen);
els.ov.addEventListener('click', toggleOverview);
if (els.sp) els.sp.addEventListener('click', toggleSpeaker);
els.help.addEventListener('click', toggleHelp);
els.ovClose.addEventListener('click', closeOverview);
els.spClose.addEventListener('click', toggleSpeaker);
els.helpClose.addEventListener('click', closeHelp);
els.helpModal.addEventListener('click', (e) => { if (e.target === els.helpModal) closeHelp(); });

/* ── Touch / swipe ───────────────────────────────────────────────── */
let touchStartX = null;
window.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
window.addEventListener('touchend', (e) => {
  if (touchStartX === null) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 60) (dx < 0 ? next : prev)();
  touchStartX = null;
}, { passive: true });

/* ── Click on slide edges → nav (only when no overlay) ───────────── */
document.getElementById('deck').addEventListener('click', (e) => {
  if (!els.overview.hidden || !els.helpModal.hidden) return;
  // Don't hijack clicks on links/buttons
  if (e.target.closest('a, button, .card, .badge, .pill, .anchor')) return;
  const x = e.clientX;
  const w = window.innerWidth;
  if (x > w * 0.66) next();
  else if (x < w * 0.33) prev();
});

/* ── Fullscreen ──────────────────────────────────────────────────── */
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.().catch(() => {});
  } else {
    document.exitFullscreen?.();
  }
}

/* ── Overview ────────────────────────────────────────────────────── */
function buildOverview() {
  els.ovGrid.innerHTML = '';
  slides.forEach((s, i) => {
    const titleEl = s.querySelector('.sl-title, .divider-title, .qa-title, blockquote, .hero-text');
    let title = titleEl ? titleEl.textContent.trim() : `Slide ${i + 1}`;
    title = title.replace(/\s+/g, ' ').slice(0, 90);
    const time = s.dataset.time || '—';

    const t = document.createElement('div');
    t.className = 'thumb';
    t.dataset.idx = i;
    t.innerHTML = `
      <span class="thumb-num">${String(i + 1).padStart(2, '0')}</span>
      <span class="thumb-title">${title}</span>
      <span class="thumb-time">${time}</span>
    `;
    t.addEventListener('click', () => {
      show(i);
      closeOverview();
    });
    els.ovGrid.appendChild(t);
  });
}

function syncOverview() {
  els.ovGrid.querySelectorAll('.thumb').forEach((t, i) => {
    t.classList.toggle('is-current', i === current);
  });
}

function toggleOverview() {
  if (els.overview.hidden) {
    if (!els.ovGrid.children.length) buildOverview();
    els.overview.hidden = false;
    syncOverview();
  } else {
    closeOverview();
  }
}
function closeOverview() { els.overview.hidden = true; }

/* ── Speaker notes ───────────────────────────────────────────────── */
function syncSpeaker() {
  els.spIdx.textContent = current + 1;
  els.spTime.textContent = slides[current].dataset.time || '—';
  els.spNotes.textContent = slides[current].dataset.notes || '(sem notas)';
}
function toggleSpeaker() {
  els.speaker.hidden = !els.speaker.hidden;
  if (!els.speaker.hidden) syncSpeaker();
}

/* ── Help ────────────────────────────────────────────────────────── */
function toggleHelp() { els.helpModal.hidden = !els.helpModal.hidden; }
function closeHelp() {
  els.helpModal.hidden = true;
  try { localStorage.setItem('deck-seen-help', '1'); } catch (_) {}
}

/* ── Cursor auto-hide in fullscreen ──────────────────────────────── */
let cursorTimer;
function resetCursor() {
  document.body.classList.remove('cursor-hidden');
  document.body.style.cursor = '';
  clearTimeout(cursorTimer);
  if (document.fullscreenElement) {
    cursorTimer = setTimeout(() => {
      document.body.classList.add('cursor-hidden');
      document.body.style.cursor = 'none';
    }, 2500);
  }
}
window.addEventListener('mousemove', resetCursor);
document.addEventListener('fullscreenchange', resetCursor);

/* ── Hash deep-link ──────────────────────────────────────────────── */
function fromHash() {
  const m = location.hash.match(/^#(\d+)$/);
  if (m) {
    const n = parseInt(m[1], 10) - 1;
    if (n >= 0 && n < total) return n;
  }
  return 0;
}
window.addEventListener('hashchange', () => show(fromHash(), { silent: true }));

/* ── Prevent context menu (clean stage) ──────────────────────────── */
// (Removed — keep right-click for designers/devs)

/* ── Mobile menu toggle ──────────────────────────────────────────── */
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('mobile-menu-open');
    mobileMenuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

/* ── Init ────────────────────────────────────────────────────────── */
show(fromHash(), { silent: true });

// Onboarding: show shortcuts modal on first visit
try {
  if (!localStorage.getItem('deck-seen-help')) {
    els.helpModal.hidden = false;
  }
} catch (_) { /* localStorage blocked */ }
