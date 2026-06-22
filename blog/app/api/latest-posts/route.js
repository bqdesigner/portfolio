import { getPosts, getPostBlocks } from '@/lib/notion';
import { getReadingTime } from '@/lib/utils';

// Revalida a cada 60s, igual à listagem do blog (app/page.js).
export const revalidate = 60;

// Consumido pela index estática (outra origin em dev / mesmo domínio via rewrite
// em prod). Dados públicos — libera CORS pra funcionar nos dois casos.
const CORS = { 'Access-Control-Allow-Origin': '*' };

export async function GET() {
  const posts = (await getPosts()).slice(0, 3);

  const data = await Promise.all(
    posts.map(async (p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      tags: p.tags,
      publishedAt: p.publishedAt,
      readingTime: getReadingTime(await getPostBlocks(p.id)),
    }))
  );

  return Response.json(data, { headers: CORS });
}
