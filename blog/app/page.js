import { getPosts, getPostBlocks } from '@/lib/notion';
import { getReadingTime } from '@/lib/utils';
import styles from './Index.module.css';
import BlogList from './_components/BlogList';

export const revalidate = 60;

export const metadata = {
  title: 'Blog | Bruno Queirós',
  openGraph: { title: 'Blog | Bruno Queirós' },
};

export default async function BlogPage() {
  const posts = await getPosts();
  const postsWithTime = await Promise.all(
    posts.map(async (p) => ({
      ...p,
      readingTime: getReadingTime(await getPostBlocks(p.id)),
    }))
  );

  const totalMin = postsWithTime.reduce((sum, p) => sum + p.readingTime, 0);
  const totalCats = new Set(postsWithTime.map((p) => p.category).filter(Boolean)).size;

  return (
    <main>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Ideias que<br /><em>valem seu tempo.</em>
        </h1>
        <p className={styles.heroSub}>
          Escrevo sobre o que aprendo fazendo. Design, Produto, IA, Freelance, Carreira e tudo que orbita o trabalho criativo na minha visão.
        </p>
        <div className={styles.heroStats}>
          <div className={styles.stat}>
            <span className={styles.statNum}>{postsWithTime.length}</span>
            <span className={styles.statLabel}>Publicações</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{totalMin}</span>
            <span className={styles.statLabel}>min de leitura</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{totalCats}</span>
            <span className={styles.statLabel}>Categorias</span>
          </div>
        </div>
      </section>

      {postsWithTime.length === 0 ? (
        <p className={styles.empty}>Nenhum post publicado ainda.</p>
      ) : (
        <BlogList posts={postsWithTime} />
      )}
    </main>
  );
}
