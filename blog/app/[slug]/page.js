import { getPostBySlug, getPostBlocks, getPosts } from '@/lib/notion';
import { getReadingTime, slugify } from '@/lib/utils';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import NotionBlocks from './NotionBlocks';
import styles from './Article.module.css';
import ReadingProgress from './ReadingProgress';
import Sidebar from './Sidebar';

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.ogImage ? [{ url: post.ogImage }] : [],
    },
  };
}

function buildToc(blocks) {
  return blocks
    .filter((b) => b.type === 'heading_2')
    .map((b) => {
      const label = b.heading_2.rich_text.map((r) => r.plain_text).join('');
      return { id: slugify(label), label };
    })
    .filter((t) => t.id && t.label);
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [blocks, allPosts] = await Promise.all([
    getPostBlocks(post.id),
    getPosts(),
  ]);

  const toc = buildToc(blocks);
  const readingTime = getReadingTime(blocks);
  const related = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const dateLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric',
      })
    : null;

  return (
    <>
      <ReadingProgress />

      <div className={styles.articleHero}>
        <Link href="/" className={styles.articleBack}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Voltar
        </Link>
        <h1 className={styles.articleTitle}>{post.title}</h1>
        {post.category && <div className={styles.articleCat}>{post.category}</div>}
        <div className={styles.articleMeta}>
          {dateLabel && (
            <span className={styles.articleMetaItem}><strong>{dateLabel}</strong></span>
          )}
          {dateLabel && <span className={styles.articleMetaSep} />}
          <span className={styles.articleMetaItem}>Leitura de <strong>{readingTime} min</strong></span>
        </div>
      </div>

      <div className={styles.articleLayout}>
        <div className={styles.articleMain}>
          {toc.length > 0 && (
            <div className={styles.mobileToc}>
              <span className={styles.sidebarLabel}>— Neste artigo</span>
              <div className={styles.sidebarToc}>
                {toc.map((item) => (
                  <a key={item.id} href={`#${item.id}`} className={styles.tocItem}>
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          )}
          <article className={styles.articleBody}>
            <NotionBlocks blocks={blocks} />
          </article>
        </div>

        <Sidebar toc={toc} tags={post.tags} title={post.title} />
      </div>

      {related.length > 0 && (
        <div className={styles.articleFooter}>
          <div className={styles.articleFooterLabel}>— Continue lendo</div>
          <div className={styles.relatedGrid}>
            {related.map((r) => (
              <Link key={r.slug} href={`/${r.slug}`} className={styles.relatedCard}>
                {r.category && <span className={styles.relatedCat}>{r.category}</span>}
                <span className={styles.relatedTitle}>{r.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
