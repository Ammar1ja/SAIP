import { getApiUrl } from '@/lib/drupal/config';

export interface ArticleComment {
  id: string;
  author: string;
  publicationDate: string;
  content: string;
}

function formatDate(timestamp?: number): string {
  if (!timestamp) return '';
  const date = new Date(timestamp * 1000);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export async function getArticleComments(
  articleId: string,
  locale?: string,
): Promise<ArticleComment[]> {
  try {
    const baseUrl = getApiUrl().replace('/jsonapi', '');
    const params = new URLSearchParams({ article_id: articleId });
    const endpoint = `${baseUrl}/api/article-comments?${params.toString()}`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        ...(locale && { 'Accept-Language': locale }),
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to load article comments (${response.status})`);
    }

    const payload = await response.json();
    const items = payload?.data || [];

    return items.map((item: any) => ({
      id: String(item.id || ''),
      author: item.author || '',
      publicationDate: formatDate(item.created),
      content: item.content || '',
    }));
  } catch (error) {
    console.error('Failed to fetch article comments:', error);
    return [];
  }
}
