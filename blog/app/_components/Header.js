'use client';

import { useEffect, useState } from 'react';
import styles from './Header.module.css';

const SITE = 'https://brunoqueiros.com';

const NAV = [
  { label: 'Trabalhos', href: `${SITE}/#trabalhos` },
  { label: 'Playground', href: `${SITE}/case-playground` },
  { label: 'Contato', href: `${SITE}/#contato` },
  { label: 'Blog', href: '/blog', active: true },
  { label: 'Manda freelas', href: '#', tag: 'Breve' },
];

function Logo({ href = SITE }) {
  return (
    <a href={href} className={styles.logo} aria-label="Bruno Queirós — Voltar ao início">
      <svg className={styles.logoB} viewBox="0 0 8.51421 11.9647" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.51403 8.52916C8.51907 9.00678 8.415 9.47924 8.20976 9.91054C8.01294 10.324 7.73639 10.6946 7.39598 11.0009C7.05221 11.3079 6.65456 11.5486 6.22316 11.7107C5.77728 11.8805 5.30393 11.9666 4.82683 11.9646L0 11.9497V0.000188676H4.30183C4.79179 -0.00437287 5.27902 0.0738079 5.74296 0.231435C6.1698 0.376208 6.56346 0.604726 6.90085 0.903595C7.23249 1.20175 7.49495 1.5688 7.66982 1.97905C7.85969 2.43039 7.95388 2.91621 7.94643 3.4058C7.94603 3.85595 7.84391 4.30018 7.64769 4.70531C7.4592 5.10929 7.18975 5.47025 6.85604 5.76583C7.11168 5.89306 7.34592 6.05936 7.55033 6.25875C7.75309 6.45602 7.92888 6.67925 8.07312 6.92261C8.2169 7.16487 8.32742 7.42538 8.40173 7.69712C8.47627 7.96818 8.51405 8.24803 8.51403 8.52916ZM5.66108 3.45061C5.66738 3.19187 5.6104 2.9355 5.49512 2.70377C5.38846 2.49866 5.23723 2.32003 5.05254 2.18098C4.86187 2.03836 4.64659 1.93204 4.41745 1.8673C4.17474 1.7971 3.92326 1.76189 3.6706 1.76274H2.31522V5.04886C2.56417 5.05882 2.78822 5.0638 2.98738 5.0638H3.67337C3.92505 5.06467 4.17589 5.03457 4.42022 4.97418C4.64765 4.91969 4.863 4.82346 5.05531 4.69038C5.24009 4.56169 5.39175 4.39107 5.49789 4.19248C5.61319 3.96263 5.66929 3.70763 5.66108 3.45061ZM6.10919 8.39473C6.11169 8.15814 6.06319 7.9238 5.96701 7.70763C5.87754 7.50502 5.74545 7.32407 5.57976 7.17709C5.4128 7.03123 5.22039 6.9174 5.01216 6.84129C4.78941 6.76006 4.55385 6.71958 4.31676 6.72179C3.97819 6.71184 3.6446 6.70944 3.31599 6.7146C2.98738 6.71977 2.65379 6.72216 2.31522 6.72179V10.0228H4.0479C4.29951 10.0225 4.5502 9.99245 4.79474 9.93323C5.03221 9.87838 5.25735 9.77969 5.45861 9.64223C5.65109 9.50976 5.81186 9.33633 5.9294 9.13438C6.05408 8.90829 6.11562 8.6528 6.10753 8.39473Z" fill="#191819" />
      </svg>
      <svg className={styles.logoSlash} viewBox="0 0 1.599 26.207" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="1.599" height="26.207" rx="0.8" fill="#191819" />
      </svg>
      <svg className={styles.logoQ} viewBox="0 0 12.5921 12.5012" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.592 6.19784C12.5952 6.88184 12.4808 7.5613 12.2539 8.20658C12.0316 8.83611 11.7061 9.42427 11.2908 9.94701L12.4857 11.127L11.1132 12.5012L9.88839 11.2615C9.37283 11.6138 8.80947 11.8904 8.21546 12.083C7.59316 12.2845 6.94269 12.3853 6.2886 12.3817C5.44955 12.3874 4.61814 12.2221 3.84503 11.896C3.10054 11.5837 2.42194 11.1332 1.84515 10.5683C1.27285 10.0063 0.81384 9.33953 0.493084 8.60434C0.161886 7.8456 -0.00605326 7.0257 0.000166666 6.19784C-0.00534679 5.36809 0.162545 4.54634 0.493084 3.78526C0.81244 3.04701 1.27156 2.37749 1.84515 1.81358C2.42244 1.2485 3.10161 0.797977 3.84669 0.485859C4.61946 0.159907 5.45047 -0.00535558 6.28915 0.000132327C7.1301 -0.00483984 7.96337 0.160384 8.7388 0.485859C9.4869 0.796628 10.1689 1.24726 10.7481 1.81358C11.3217 2.3775 11.7808 3.04701 12.1002 3.78526C12.4303 4.54643 12.5978 5.36817 12.592 6.19784ZM10.3365 6.19784C10.3393 5.66329 10.23 5.1341 10.0156 4.6444C9.80835 4.16655 9.51465 3.73107 9.14929 3.35983C8.78146 2.98851 8.34525 2.69188 7.86472 2.4863C7.36724 2.27133 6.83052 2.16207 6.2886 2.16543C5.74913 2.1616 5.21485 2.27091 4.72022 2.4863C4.24105 2.69435 3.80528 2.99068 3.43565 3.35983C3.06709 3.72844 2.77295 4.16457 2.56931 4.6444C2.35959 5.13531 2.25283 5.66402 2.25564 6.19784C2.25283 6.73166 2.35959 7.26038 2.56931 7.75128C2.77187 8.22942 3.0662 8.66321 3.43565 9.02811C3.80689 9.39347 4.24237 9.68717 4.72022 9.89445C5.21485 10.1098 5.74913 10.2191 6.2886 10.2153C6.65491 10.217 7.01961 10.1667 7.3718 10.0659C7.71388 9.96706 8.04254 9.8266 8.35044 9.64771L7.22962 8.55787L8.60271 7.18368L9.70914 8.31888C10.1223 7.68893 10.3405 6.95116 10.3365 6.19784Z" fill="#191819" />
      </svg>
    </a>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    setTheme(document.documentElement.getAttribute('data-theme') || 'light');
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  function applyTheme(next) {
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch {}
  }

  // Decora href pra carregar tema atual em outra origin (dev). Em prod mesmo domínio,
  // localStorage já é compartilhado — o ?theme= vira ruído removido pelo bootstrap do alvo.
  function withTheme(href) {
    if (!href || !href.startsWith(SITE)) return href;
    try {
      const u = new URL(href);
      u.searchParams.set('theme', theme);
      return u.toString();
    } catch {
      return href;
    }
  }

  return (
    <>
      <header className={styles.header}>
        <Logo href={withTheme(SITE)} />

        <button
          className={`${styles.menuTrigger} ${menuOpen ? styles.menuTriggerOpen : ''}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
        >
          <svg className={styles.menuTriggerIcon} viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="2" y1="6.5" x2="18" y2="6.5" />
            <line x1="2" y1="13.5" x2="18" y2="13.5" />
          </svg>
        </button>
      </header>

      <div className={`${styles.mobileOverlay} ${menuOpen ? styles.mobileOverlayOpen : ''}`} role="dialog" aria-modal="true" aria-label="Menu de navegação">
        <Logo href={withTheme(SITE)} />
        <div className={styles.mobileLinks}>
          {NAV.map((item) => (
            <a key={item.label} href={withTheme(item.href)} onClick={(e) => { if (item.tag) e.preventDefault(); setMenuOpen(false); }} className={item.tag ? styles.navItemWrapper : ''}>
              {item.tag ? (
                <>
                  <span>{item.label}</span>
                  <span className={styles.navTag}>{item.tag}</span>
                </>
              ) : item.label}
            </a>
          ))}
        </div>

        <div className={styles.menuOverlayControls}>
          <button
            type="button"
            className={theme === 'light' ? styles.controlActive : ''}
            onClick={() => applyTheme('light')}
            aria-label="Modo claro"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20"><circle cx="10" cy="10" r="4" fill="#F59E0B"/><g stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"><line x1="10" y1="1" x2="10" y2="3"/><line x1="10" y1="17" x2="10" y2="19"/><line x1="1" y1="10" x2="3" y2="10"/><line x1="17" y1="10" x2="19" y2="10"/><line x1="3.34" y1="3.34" x2="4.75" y2="4.75"/><line x1="15.25" y1="15.25" x2="16.66" y2="16.66"/><line x1="3.34" y1="16.66" x2="4.75" y2="15.25"/><line x1="15.25" y1="4.75" x2="16.66" y2="3.34"/></g></svg>
          </button>
          <span className={styles.controlsDivider} aria-hidden="true">/</span>
          <button
            type="button"
            className={theme === 'dark' ? styles.controlActive : ''}
            onClick={() => applyTheme('dark')}
            aria-label="Modo escuro"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.003 8.003 0 1010.586 10.586z" fill="#6366F1"/></svg>
          </button>
        </div>

        <div className={styles.mobileEmail}>
          Tem um projeto? <a href="mailto:bqdesigner@outlook.com">bqdesigner@outlook.com</a>
        </div>
      </div>
    </>
  );
}
