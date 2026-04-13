import { fetchDrupal } from '../utils';
import { extractText } from '../utils';

export interface VideoFilterCategory {
  id: string;
  name: string;
}

export async function fetchVideoFilterCategories(
  locale: string = 'en',
): Promise<VideoFilterCategory[]> {
  try {
    const response = await fetchDrupal(
      `/taxonomy_term/video_filter_categories?filter[status]=1&sort=weight&filter[langcode]=${locale}`,
      {},
      locale,
    );

    const terms = Array.isArray(response.data) ? response.data : [];

    return terms
      .map((term: any) => ({
        id: term.id,
        name: extractText(term.attributes?.name) || '',
      }))
      .filter((term: VideoFilterCategory) => term.name);
  } catch (error) {
    console.error('Error fetching video filter categories:', error);
    return [];
  }
}
