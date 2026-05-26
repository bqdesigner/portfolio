'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './BlogList.module.css';

const PALETTE = ['#1DA1F2', '#C4A8FF', '#6BA6FF', '#8DD5A6', '#FFB347'];

function catColor(name) {
  if (!name) return PALETTE[0];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h + name.charCodeAt(i)) | 0;
  return PALETTE[Math.abs(h) % PALETTE.length];
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).replace(/\.$/, '');
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  );
}

export function PostCard({ post, featured }) {
  const color = catColor(post.category);
  const badgeStyle = {
    color,
    borderColor: `color-mix(in srgb, ${color} 30%, transparent)`,
    background: `color-mix(in srgb, ${color} 8%, transparent)`,
  };
  return (
    <article className={`${styles.postCard} ${featured ? styles.postFeatured : ''}`} style={{ '--cat-color': color }}>
      <Link href={`/${post.slug}`} className={styles.postLink}>
        <div className={styles.postTop}>
          {post.category && <span className={styles.postCat} style={badgeStyle}>{post.category}</span>}
          {post.publishedAt && <span className={styles.postDate}>{formatDate(post.publishedAt)}</span>}
        </div>
        <h2 className={styles.postTitle}>{post.title}</h2>
        <div className={styles.postReadMeta}>
          <span>Leitura</span>
          <span className={styles.postMetaDot} />
          <span>{post.readingTime} min</span>
        </div>
        {post.excerpt && <p className={styles.postPreview}>{post.excerpt}</p>}
        {post.tags.length > 0 && (
          <div className={styles.postTags}>
            {post.tags.map((t) => <span key={t} className={styles.postTag}>{t}</span>)}
          </div>
        )}
        <div className={styles.postArrow}><ArrowIcon /></div>
      </Link>
    </article>
  );
}

function Newsletter() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (email) setSent(true);
  }

  return (
    <section className={styles.newsletter}>
      <div>
        <div className={styles.newsletterLabel}>— Newsletter</div>
        <h2 className={styles.newsletterTitle}>Novos textos<br />na sua caixa de entrada.</h2>
        <p className={styles.newsletterSub}>Sem spam. Só quando vale a pena.</p>
      </div>
      {sent ? (
        <p className={styles.newsletterDone}>Cadastro confirmado — até o próximo texto.</p>
      ) : (
        <form className={styles.newsletterForm} onSubmit={handleSubmit}>
          <input
            className={styles.newsletterInput}
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className={styles.newsletterBtn} type="submit">Assinar</button>
        </form>
      )}
    </section>
  );
}

export default function BlogList({ posts }) {
  const categories = ['Todos', ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))];
  const [active, setActive] = useState('Todos');
  const filtered = active === 'Todos' ? posts : posts.filter((p) => p.category === active);
  const isFiltered = active !== 'Todos';

  return (
    <>
      <div className={styles.filters}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`${styles.filterBtn} ${active === cat ? styles.filterBtnActive : ''}`}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <section className={styles.gridSection}>
        <div className={styles.grid}>
          {filtered.length === 0 ? (
            <div className={styles.gridEmpty}>Nenhum post encontrado nesta categoria.</div>
          ) : (
            filtered.map((post, i) => (
              <PostCard key={post.id} post={post} featured={i === 0 && !isFiltered} />
            ))
          )}
        </div>
      </section>
      {/* <Newsletter /> */}
    </>
  );
}
