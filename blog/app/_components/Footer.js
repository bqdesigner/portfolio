'use client';

import { useEffect, useRef } from 'react';
import styles from './Footer.module.css';

const ArrowOut = () => (
  <svg className={styles.colArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="12" height="12" aria-hidden="true">
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
);

const CREDIT_TEXT = 'Design and Develop by Brunão — 2026 ©';

export default function Footer() {
  const bigRef = useRef(null);
  const creditRef = useRef(null);

  useEffect(() => {
    const el = creditRef.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.textContent = '';
    const words = CREDIT_TEXT.split(' ');
    const spans = words.map((word, i) => {
      const span = document.createElement('span');
      span.className = styles.fcWord;
      span.textContent = word + (i < words.length - 1 ? ' ' : '');
      el.appendChild(span);
      return span;
    });
    const cursor = document.createElement('span');
    cursor.className = styles.fcCursor;

    if (reduce) {
      spans.forEach((s) => s.classList.add(styles.fcVisible));
      return;
    }

    let started = false;
    let timers = [];
    function start() {
      if (started) return;
      started = true;
      let idx = 0;
      const interval = 80;
      function showNext() {
        if (idx >= spans.length) {
          spans[spans.length - 1].after(cursor);
          cursor.style.display = 'inline-block';
          return;
        }
        spans[idx].classList.add(styles.fcVisible);
        spans[idx].after(cursor);
        cursor.style.display = 'inline-block';
        idx++;
        timers.push(setTimeout(showNext, interval));
      }
      timers.push(setTimeout(showNext, 1000));
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          start();
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });
    observer.observe(el);

    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    const el = bigRef.current;
    if (!el) return;
    let raf;
    function fit() {
      const cs = getComputedStyle(el);
      const pad = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
      const avail = el.clientWidth - pad;
      if (avail <= 0) return;
      el.style.fontSize = '100px';
      let contentW = 0;
      for (const child of el.children) contentW += child.getBoundingClientRect().width;
      if (contentW <= 0) return;
      el.style.fontSize = Math.floor(100 * avail / contentW * 0.98) + 'px';
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fit);
    } else {
      fit();
    }
    function onResize() {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(fit);
    }
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  function scrollTop(e) {
    e.preventDefault();
    const root = document.documentElement;
    const body = document.body;
    // O blog rola pelo body (html,body{height:100%}); por isso lemos e
    // escrevemos nos três alvos possíveis.
    const start = window.scrollY || root.scrollTop || body.scrollTop || 0;
    if (start <= 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo(0, 0);
      root.scrollTop = 0;
      body.scrollTop = 0;
      return;
    }

    // Desliga o scroll-behavior:smooth global durante a animação, senão o
    // navegador re-anima a cada frame e atropela o nosso easing.
    const prevRoot = root.style.scrollBehavior;
    const prevBody = body.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    body.style.scrollBehavior = 'auto';

    const duration = Math.min(1000, Math.max(500, start * 0.6));
    const easeIn = (t) => t * t * t * t; // bem lento no início, acelera no fim
    let startTime = null;
    function step(now) {
      if (startTime === null) startTime = now;
      const p = Math.min(1, (now - startTime) / duration);
      const y = Math.round(start * (1 - easeIn(p)));
      window.scrollTo(0, y);
      root.scrollTop = y;
      body.scrollTop = y;
      if (p < 1) requestAnimationFrame(step);
      else { root.style.scrollBehavior = prevRoot; body.style.scrollBehavior = prevBody; }
    }
    requestAnimationFrame(step);
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.col}>
          <h4>— Contato</h4>
          <p>Baseado em São Paulo, atendo remoto.</p>
          <ul>
            <li><a href="mailto:bqdesigner@outlook.com">bqdesigner@outlook.com</a></li>
          </ul>
        </div>
        <div className={styles.col}>
          <h4>— Social</h4>
          <ul>
            <li><a href="https://www.linkedin.com/in/itsbrunoqueiros/" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowOut /></a></li>
            <li><a href="https://dribbble.com/itsbrunoqueiros" target="_blank" rel="noopener noreferrer">Dribbble <ArrowOut /></a></li>
            <li><a href="https://medium.com/@brunoqueiros" target="_blank" rel="noopener noreferrer">Medium <ArrowOut /></a></li>
            <li><a href="https://github.com/bqdesigner" target="_blank" rel="noopener noreferrer">GitHub <ArrowOut /></a></li>
          </ul>
        </div>
        <div className={styles.col}>
          <h4>— Navegação</h4>
          <ul>
            <li><a href="/#trabalhos">Trabalhos</a></li>
            <li><a href="/case-playground.html">Playground</a></li>
            <li><a href="/#contato">Contato</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="#"><span>Manda freelas</span> <span className={styles.navTag}>Breve</span></a></li>
            <li><a href="/resume.html">Currículo</a></li>
          </ul>
        </div>
      </div>
      <div className={styles.bigName} aria-hidden="true" ref={bigRef}>
        <span>BQDESIGNER</span><span className={styles.slash}>/</span>
      </div>
      <div className={styles.credit}>
        <a href="#" className={styles.backToTop} onClick={scrollTop} aria-label="Voltar ao topo">
          <svg width="15" height="10" viewBox="0 0 14.8333 9.5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.75 4.75H13.4167M10.0833 8.75L14.0833 4.75L10.0833 0.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
        <div className={styles.creditText} ref={creditRef}>{CREDIT_TEXT}</div>
      </div>
    </footer>
  );
}
