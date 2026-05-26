'use client';

import { useEffect, useRef } from 'react';
import styles from './Footer.module.css';

const SITE = 'https://portifolio-with-ia.vercel.app';

export default function Footer() {
  const bigRef = useRef(null);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.cta}>
        <h2 className={styles.ctaTitle}>Bora trabalhar juntos?</h2>
        <a href="mailto:bqdesigner@outlook.com" className={styles.ctaEmail}>bqdesigner@outlook.com</a>
      </div>
      <div className={styles.grid}>
        <div className={styles.col}>
          <h4>— Contato</h4>
          <p>Baseado em São Paulo, atendo remoto.</p>
        </div>
        <div className={styles.col}>
          <h4>— Social</h4>
          <ul>
            <li><a href="https://www.linkedin.com/in/itsbrunoqueiros/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            <li><a href="https://dribbble.com/itsbrunoqueiros" target="_blank" rel="noopener noreferrer">Dribbble</a></li>
            <li><a href="https://medium.com/@brunoqueiros" target="_blank" rel="noopener noreferrer">Medium</a></li>
          </ul>
        </div>
        <div className={styles.col}>
          <h4>— Navegação</h4>
          <ul>
            <li><a href={`${SITE}/#trabalhos`}>Trabalhos</a></li>
            <li><a href={`${SITE}/case-playground.html`}>Playground</a></li>
            <li><a href={SITE}>Contato</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href={`${SITE}/resume.html`}>Currículo</a></li>
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
        <div className={styles.creditText}>Design and Develop by Brunão — 2026 ©</div>
      </div>
    </footer>
  );
}
