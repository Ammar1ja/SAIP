/**
 * Service for fetching and transforming Video content from Drupal
 */

import { fetchDrupal } from '../utils';
import { getRelated, extractText } from '../utils';
import { getApiUrl } from '../config';

export interface Video {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  videoUrl: string;
  videoType: 'local' | 'remote';
  image: string;
  imageAlt: string;
  publishDate: string;
  categories: { id: string; name: string }[];
  ipCategories: { id: string; name: string }[];
  videoCategories: { id: string; name: string }[];
  videoFilterCategories: { id: string; name: string }[];
}

/**
 * Transform Drupal video node to Video interface
 */
export function transformVideoNode(node: any, included: any[] = [], locale: string = 'en'): Video {
  const attrs = node.attributes || {};
  const relationships = node.relationships || {};

  // Extract basic text fields safely
  const title = extractText(attrs.title) || 'Untitled Video';
  const slug = extractText(attrs.field_slug) || node.id;
  const excerpt = extractText(attrs.field_excerpt) || '';
  const body = extractText(attrs.body) || excerpt;

  // Get video media entity
  let videoUrl = '';
  let videoType: 'local' | 'remote' = 'local';

  const videoRel = getRelated(relationships, 'field_video', included);
  if (videoRel && !Array.isArray(videoRel)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const videoAttrs = (videoRel.attributes as any) || {};
    const videoRelationships = videoRel.relationships || {};

    if (videoRel.type === 'media--remote_video') {
      videoType = 'remote';
      videoUrl = extractText(videoAttrs.field_media_oembed_video) || '';
    } else if (videoRel.type === 'media--video') {
      videoType = 'local';
      const fileRel = getRelated(videoRelationships, 'field_media_video_file', included);
      if (fileRel && !Array.isArray(fileRel)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fileAttrs = (fileRel.attributes as any) || {};
        const fileUri = fileAttrs.uri?.url || '';
        videoUrl = fileUri.startsWith('/') ? `${getApiUrl()}${fileUri}` : fileUri;
      }
    }
  }

  // Get thumbnail image
  let image = '/images/photo-container.png';
  let imageAlt = title;

  const imageRel = getRelated(relationships, 'field_image', included);
  if (imageRel && !Array.isArray(imageRel)) {
    const imageRelationships = imageRel.relationships || {};
    const imageFileRel = getRelated(imageRelationships, 'field_media_image', included);
    if (imageFileRel && !Array.isArray(imageFileRel)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const imageAttrs = (imageFileRel.attributes as any) || {};
      const imageUri = imageAttrs.uri?.url || '';
      image = imageUri.startsWith('/') ? `${getApiUrl()}${imageUri}` : imageUri;
      imageAlt = extractText(imageAttrs.alt) || title;
    }
  }

  // Get publication date and format to DD.MM.YYYY
  let publishDate = '';
  const dateValue = extractText(attrs.field_date) || extractText(attrs.created);
  if (dateValue) {
    try {
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        publishDate = `${day}.${month}.${year}`;
      }
    } catch {
      publishDate = dateValue;
    }
  }

  // Get IP categories
  const ipCategories: { id: string; name: string }[] = [];
  if (relationships.field_ip_categories?.data) {
    const catData = Array.isArray(relationships.field_ip_categories.data)
      ? relationships.field_ip_categories.data
      : [relationships.field_ip_categories.data];

    catData.forEach((catRef: any) => {
      const catEntity = included?.find((inc: any) => inc.id === catRef.id);
      if (catEntity) {
        ipCategories.push({
          id: catEntity.id,
          name: extractText(catEntity.attributes?.name) || 'Uncategorized',
        });
      }
    });
  }

  const videoCategories: { id: string; name: string }[] = [];
  if (relationships.field_video_categories?.data) {
    const catData = Array.isArray(relationships.field_video_categories.data)
      ? relationships.field_video_categories.data
      : [relationships.field_video_categories.data];

    catData.forEach((catRef: any) => {
      const catEntity = included?.find((inc: any) => inc.id === catRef.id);
      if (catEntity) {
        videoCategories.push({
          id: catEntity.id,
          name: extractText(catEntity.attributes?.name) || 'Uncategorized',
        });
      }
    });
  }

  const videoFilterCategories: { id: string; name: string }[] = [];
  if (relationships.field_video_filter_categories?.data) {
    const catData = Array.isArray(relationships.field_video_filter_categories.data)
      ? relationships.field_video_filter_categories.data
      : [relationships.field_video_filter_categories.data];

    catData.forEach((catRef: any) => {
      const catEntity = included?.find((inc: any) => inc.id === catRef.id);
      if (catEntity) {
        videoFilterCategories.push({
          id: catEntity.id,
          name: extractText(catEntity.attributes?.name) || 'Uncategorized',
        });
      }
    });
  }

  const categories = [...videoCategories, ...ipCategories];

  return {
    id: node.id,
    title,
    slug,
    excerpt,
    body,
    videoUrl,
    videoType,
    image,
    imageAlt,
    publishDate,
    categories,
    ipCategories,
    videoCategories,
    videoFilterCategories,
  };
}

/**
 * Fetch all videos
 */
export async function fetchVideos(locale: string = 'en'): Promise<Video[]> {
  try {
    const includeFields = [
      'field_video',
      'field_video.field_media_video_file',
      'field_image',
      'field_image.field_media_image',
      'field_ip_categories',
      'field_video_categories',
      'field_video_filter_categories',
    ].join(',');

    const response = await fetchDrupal(
      `/node/video?include=${includeFields}&filter[status]=1&filter[langcode]=${locale}`,
      {},
      locale,
    );

    if (!response.data) {
      return [];
    }

    const videos = Array.isArray(response.data) ? response.data : [response.data];
    const included = response.included || [];

    return videos.map((video: any) => transformVideoNode(video, included, locale));
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
}

/**
 * Fetch video by ID
 */
export async function fetchVideoById(id: string, locale: string = 'en'): Promise<Video | null> {
  try {
    const includeFields = [
      'field_video',
      'field_video.field_media_video_file',
      'field_image',
      'field_image.field_media_image',
      'field_ip_categories',
      'field_video_categories',
      'field_video_filter_categories',
    ].join(',');

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const isNid = /^\d+$/.test(id);

    let response;

    if (isUuid) {
      response = await fetchDrupal(`/node/video/${id}?include=${includeFields}`, {}, locale);
    } else if (isNid) {
      const nidResponse = await fetchDrupal(
        `/node/video?filter[drupal_internal__nid]=${id}&filter[status]=1&include=${includeFields}`,
        {},
        'en',
      );

      if (!nidResponse.data || (Array.isArray(nidResponse.data) && nidResponse.data.length === 0)) {
        return null;
      }

      const nidNode = Array.isArray(nidResponse.data) ? nidResponse.data[0] : nidResponse.data;
      response = await fetchDrupal(
        `/node/video/${nidNode.id}?include=${includeFields}`,
        {},
        locale,
      );
    } else {
      response = await fetchDrupal(
        `/node/video?include=${includeFields}&filter[field_slug]=${id}&filter[langcode]=${locale}`,
        {},
        locale,
      );

      if (!response.data || (Array.isArray(response.data) && response.data.length === 0)) {
        return null;
      }

      const slugNode = Array.isArray(response.data) ? response.data[0] : response.data;
      response = await fetchDrupal(
        `/node/video/${slugNode.id}?include=${includeFields}`,
        {},
        locale,
      );
    }

    if (!response?.data) {
      return null;
    }

    const included = response.included || [];
    const node = Array.isArray(response.data) ? response.data[0] : response.data;
    return transformVideoNode(node, included, locale);
  } catch (error) {
    console.error(`Error fetching video ${id}:`, error);
    return null;
  }
}

/**
 * Fetch video by slug
 */
export async function fetchVideoBySlug(slug: string, locale: string = 'en'): Promise<Video | null> {
  try {
    const includeFields = [
      'field_video',
      'field_video.field_media_video_file',
      'field_image',
      'field_image.field_media_image',
      'field_ip_categories',
      'field_video_categories',
    ].join(',');

    const response = await fetchDrupal(
      `/node/video?include=${includeFields}&filter[field_slug]=${slug}&filter[langcode]=${locale}`,
      {},
      locale,
    );

    if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
      return null;
    }

    const included = response.included || [];
    return transformVideoNode(response.data[0], included, locale);
  } catch (error) {
    console.error(`Error fetching video by slug ${slug}:`, error);
    return null;
  }
}
