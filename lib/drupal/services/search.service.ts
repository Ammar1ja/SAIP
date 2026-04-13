import { getProxyUrl } from '../utils';

export interface SearchResult {
  id: string;
  type: string;
  typeKey?: string;
  title: string;
  description: string;
  url: string;
  createdDate?: string;
  file?: string;
  thumbnail?: string;
  category?: string;
  categoryKey?: string;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  page?: number;
  pageSize?: number;
}

interface SearchOptions {
  page?: number;
  pageSize?: number;
  fetchAll?: boolean;
}

// Static searchable content - main pages and sections
const SEARCHABLE_CONTENT: SearchResult[] = [
  // About SAIP
  {
    id: 'about',
    type: 'about',
    title: 'About SAIP',
    description:
      'Saudi Authority for Intellectual Property - Learn about our mission, vision, and organizational structure',
    url: '/saip/about',
    category: 'SAIP',
  },
  {
    id: 'org-structure',
    type: 'page',
    title: 'Organizational Structure',
    description: 'Explore SAIP organizational structure and leadership team',
    url: '/saip/organisational-structure',
    category: 'SAIP',
  },
  {
    id: 'national-ip-strategy',
    type: 'page',
    title: 'National IP Strategy',
    description: 'National Intellectual Property Strategy for Saudi Arabia',
    url: '/saip/national-ip-strategy',
    category: 'SAIP',
  },
  {
    id: 'projects',
    type: 'page',
    title: 'Projects',
    description: 'Explore SAIP projects and initiatives',
    url: '/saip/projects',
    category: 'SAIP',
  },
  {
    id: 'careers',
    type: 'page',
    title: 'Careers',
    description: 'Join our team - explore career opportunities at SAIP',
    url: '/saip/careers',
    category: 'SAIP',
  },

  // Services
  {
    id: 'service-directory',
    type: 'service',
    title: 'Service Directory',
    description: 'Browse all SAIP services and digital platforms',
    url: '/services/service-directory',
    category: 'Services',
  },
  {
    id: 'patents',
    type: 'service',
    title: 'Patents',
    description:
      'Register and protect your inventions through the patent system. Learn about patent application process, requirements, and benefits',
    url: '/services/patents',
    category: 'Services',
  },
  {
    id: 'trademarks',
    type: 'service',
    title: 'Trademarks',
    description:
      'Protect your brand identity with trademark registration. Explore trademark services, application process, and legal protection',
    url: '/services/trademarks',
    category: 'Services',
  },
  {
    id: 'copyrights',
    type: 'service',
    title: 'Copyrights',
    description:
      'Protect your creative works with copyright registration. Learn about copyright laws, registration process, and enforcement',
    url: '/services/copyrights',
    category: 'Services',
  },
  {
    id: 'designs',
    type: 'service',
    title: 'Industrial Designs',
    description:
      'Register and protect your industrial designs. Explore design protection services and registration requirements',
    url: '/services/designs',
    category: 'Services',
  },
  {
    id: 'plant-varieties',
    type: 'service',
    title: 'Plant Varieties',
    description: 'Protection of new plant varieties and agricultural innovations',
    url: '/services/plant-varieties',
    category: 'Services',
  },
  {
    id: 'topographic-designs',
    type: 'service',
    title: 'Layout Designs of Integrated Circuits',
    description: 'Protection of topographic designs and integrated circuit layouts',
    url: '/services/layout-designs-of-integrated-circuits',
    category: 'Services',
  },
  {
    id: 'ip-infringement',
    type: 'service',
    title: 'IP Infringement',
    description: 'Report IP infringement and protect your intellectual property rights',
    url: '/services/ip-infringement',
    category: 'Services',
  },
  {
    id: 'ip-licensing',
    type: 'service',
    title: 'IP Licensing',
    description: 'License your intellectual property and manage IP contracts',
    url: '/services/ip-licensing',
    category: 'Services',
  },
  {
    id: 'ip-academy',
    type: 'service',
    title: 'IP Academy',
    description: 'Education and training programs for intellectual property professionals',
    url: '/services/ip-academy',
    category: 'Services',
  },
  {
    id: 'ip-clinics',
    type: 'service',
    title: 'IP Clinics',
    description: 'Free IP consultation and support services',
    url: '/services/ip-clinics',
    category: 'Services',
  },
  {
    id: 'ip-support-centers',
    type: 'service',
    title: 'IP Support Centers',
    description: 'Regional IP support centers across Saudi Arabia',
    url: '/services/ip-support-centers',
    category: 'Services',
  },
  {
    id: 'ip-general-secretariat',
    type: 'service',
    title: 'IP General Secretariat',
    description: 'General Secretariat for Intellectual Property services',
    url: '/services/ip-general-secretariat',
    category: 'Services',
  },

  // Resources
  {
    id: 'digital-guide',
    type: 'resource',
    title: 'Digital Guide',
    description:
      'Comprehensive digital guide for intellectual property registration and protection',
    url: '/resources/ip-information/digital-guide',
    category: 'Resources',
  },
  {
    id: 'faq',
    type: 'resource',
    title: 'Frequently Asked Questions',
    description: 'Find answers to common questions about IP services',
    url: '/resources/ip-information/faq',
    category: 'Resources',
  },
  {
    id: 'glossary',
    type: 'resource',
    title: 'IP Glossary',
    description: 'Intellectual property terms and definitions',
    url: '/resources/ip-information/ip-glossary',
    category: 'Resources',
  },
  {
    id: 'guidelines',
    type: 'resource',
    title: 'Guidelines',
    description: 'Guidelines and procedures for IP services',
    url: '/resources/ip-information/guidelines',
    category: 'Resources',
  },
  {
    id: 'laws-regulations',
    type: 'resource',
    title: 'Laws and Regulations',
    description: 'Intellectual property laws and regulations in Saudi Arabia',
    url: '/resources/lows-and-regulations/systems-and-regulations',
    category: 'Resources',
  },
  {
    id: 'international-treaties',
    type: 'resource',
    title: 'International Treaties',
    description: 'International IP treaties and agreements',
    url: '/resources/lows-and-regulations/international-treaties',
    category: 'Resources',
  },
  {
    id: 'ip-search-engine',
    type: 'resource',
    title: 'IP Search Engine',
    description: 'Search patents, trademarks, and other IP registrations',
    url: '/resources/tools-and-research/ip-search-engine',
    category: 'Resources',
  },
  {
    id: 'publications',
    type: 'resource',
    title: 'Publications',
    description: 'SAIP publications, reports, and research papers',
    url: '/resources/tools-and-research/publications',
    category: 'Resources',
  },
  {
    id: 'ip-agents',
    type: 'resource',
    title: 'IP Agents',
    description: 'Find registered IP agents and representatives',
    url: '/resources/ip-licensing/ip-agents',
    category: 'Resources',
  },

  // Media Center
  {
    id: 'media-center',
    type: 'news',
    title: 'Media Center',
    description: 'Latest news, events, and media resources from SAIP',
    url: '/media-center/media-library/media-center',
    category: 'Media',
  },
  {
    id: 'gazette',
    type: 'resource',
    title: 'IP Gazette',
    description: 'Official IP Gazette publications and announcements',
    url: '/media-center/gazette',
    category: 'Media',
  },
  {
    id: 'movables-platform',
    type: 'resource',
    title: 'Movables Platform',
    description: 'Platform for movable property registration',
    url: '/media-center/movables-platform',
    category: 'Media',
  },

  // Contact
  {
    id: 'contact',
    type: 'page',
    title: 'Contact Us',
    description: 'Get in touch with SAIP - contact information and support',
    url: '/contact-us/contact',
    category: 'Contact',
  },
  {
    id: 'entities-partners',
    type: 'page',
    title: 'Entities and Partners',
    description: 'SAIP partners and collaborating entities',
    url: '/contact-us/entities-and-partners',
    category: 'Contact',
  },
];

const typeKeyRouteMap: Record<string, string> = {
  patents_page: '/services/patents',
  trademarks_page: '/services/trademarks',
  copyrights_page: '/services/copyrights',
  designs_page: '/services/designs',
  plant_varieties_page: '/services/plant-varieties',
  layout_designs_page: '/services/layout-designs-of-integrated-circuits',
  ip_licensing_page: '/services/ip-licensing',
  ip_academy_page: '/services/ip-academy',
  ip_clinics_page: '/services/ip-clinics',
  ip_infringement_page: '/services/ip-infringement',
  ip_general_secretariat_page: '/services/ip-general-secretariat',
  service_directory_page: '/services/service-directory',
  services_overview_page: '/services',
  systems_regulations_page: '/resources/lows-and-regulations/systems-and-regulations',
  international_treaties_page: '/resources/lows-and-regulations/international-treaties',
  guidelines_page: '/resources/ip-information/guidelines',
  faq_page: '/resources/ip-information/faq',
  ip_glossary_page: '/resources/ip-information/ip-glossary',
  publications_page: '/resources/tools-and-research/publications',
  gazette_page: '/resources/tools-and-research/gazette',
  projects_page: '/saip/projects',
  national_ip_strategy_page: '/saip/national-ip-strategy',
  about_saip_page: '/saip/about',
  media_center_page: '/media-center/media-library/media-center',
};

const typeKeyCategoryMap: Record<string, string> = {
  patents_page: 'patents',
  trademarks_page: 'trademarks',
  copyrights_page: 'copyrights',
  designs_page: 'designs',
  plant_varieties_page: 'plantVarieties',
  layout_designs_page: 'layoutDesigns',
  ip_licensing_page: 'ipLicensing',
  ip_academy_page: 'ipAcademy',
  ip_clinics_page: 'ipClinics',
  ip_infringement_page: 'ipInfringement',
  ip_general_secretariat_page: 'ipDisputeResolution',
};

const resolveResultUrl = (item: { id: string; typeKey?: string; file?: string }): string => {
  if (item.file) {
    return getProxyUrl(item.file, 'view');
  }

  if (item.typeKey && typeKeyRouteMap[item.typeKey]) {
    return typeKeyRouteMap[item.typeKey];
  }

  if (item.typeKey === 'news') {
    return `/media-center/media-library/media-center/${item.id}`;
  }

  if (item.typeKey === 'article') {
    return `/media-center/media-library/media-center/articles/${item.id}`;
  }

  return '#';
};

const stripHtml = (value: string): string => {
  if (!value) return '';
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim();
};

const filterStaticResults = (searchKey: string): SearchResult[] => {
  const searchTerm = searchKey.toLowerCase();
  return SEARCHABLE_CONTENT.filter((item) => {
    const titleMatch = item.title.toLowerCase().includes(searchTerm);
    const descriptionMatch = item.description.toLowerCase().includes(searchTerm);
    const categoryMatch = item.category?.toLowerCase().includes(searchTerm);
    return titleMatch || descriptionMatch || categoryMatch;
  });
};

interface DrupalSearchItem {
  id?: string;
  title?: string;
  body?: string;
  createdDate?: string;
  type?: string;
  typeKey?: string;
  file?: string;
  url?: string;
}

interface DrupalSearchApiResponse {
  data?: {
    items?: DrupalSearchItem[];
    totalCount?: number;
  };
}

const MAX_FETCHED_RESULTS = 2000;

const fetchSearchPage = async (
  searchKey: string,
  locale: string | undefined,
  page: number,
  pageSize: number,
) => {
  const params = new URLSearchParams();
  params.set('searchKey', searchKey);
  params.set('items_per_page', String(pageSize));
  params.set('page', String(page));
  if (locale === 'en' || locale === 'ar') {
    params.set('lang', locale);
  }

  const url = `/api/search?${params.toString()}`;
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Search API error: ${response.status} ${response.statusText}`);
  }

  const json = (await response.json()) as DrupalSearchApiResponse;
  return {
    items: (json?.data?.items || []) as DrupalSearchItem[],
    total: Number(json?.data?.totalCount ?? 0),
  };
};

const getResultRelevanceScore = (item: SearchResult, query: string): number => {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return 0;

  const title = item.title.toLowerCase();
  const description = item.description.toLowerCase();
  const type = (item.type || '').toLowerCase();
  const category = (item.category || '').toLowerCase();

  let score = 0;
  if (title === normalizedQuery) score += 200;
  if (title.startsWith(normalizedQuery)) score += 120;
  if (title.includes(normalizedQuery)) score += 80;
  if (type.includes(normalizedQuery)) score += 40;
  if (category.includes(normalizedQuery)) score += 35;
  if (description.startsWith(normalizedQuery)) score += 25;
  if (description.includes(normalizedQuery)) score += 15;

  return score;
};

const dedupeAndSortResults = (results: SearchResult[], query: string): SearchResult[] => {
  const deduped = new Map<string, SearchResult>();

  for (const result of results) {
    const dedupeKey = `${result.url}|${result.title.toLowerCase()}|${result.typeKey || result.type}`;
    if (!deduped.has(dedupeKey)) {
      deduped.set(dedupeKey, result);
    }
  }

  const withScore = Array.from(deduped.values()).map((result) => ({
    result,
    score: getResultRelevanceScore(result, query),
    createdAt: Date.parse(result.createdDate || '') || 0,
  }));

  withScore.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.createdAt - a.createdAt;
  });

  return withScore.map((entry) => entry.result);
};

export async function searchContent(
  query: string,
  locale?: string,
  options?: SearchOptions,
): Promise<SearchResponse> {
  const searchKey = query?.trim() || '';
  if (searchKey.length < 2) {
    return {
      results: [],
      total: 0,
      query,
      page: options?.page,
      pageSize: options?.pageSize,
    };
  }

  try {
    const requestedPageSize = options?.pageSize || 100;
    const firstPage = options?.page && options.page > 0 ? options.page - 1 : 0;

    let items: DrupalSearchItem[] = [];
    let total = 0;

    if (options?.fetchAll) {
      const first = await fetchSearchPage(searchKey, locale, 0, requestedPageSize);
      items = [...first.items];
      total = first.total;

      const maxResults = Math.min(total, MAX_FETCHED_RESULTS);
      const totalPages = Math.ceil(maxResults / requestedPageSize);
      for (let pageIndex = 1; pageIndex < totalPages; pageIndex += 1) {
        const next = await fetchSearchPage(searchKey, locale, pageIndex, requestedPageSize);
        items.push(...next.items);
        if (items.length >= MAX_FETCHED_RESULTS) {
          break;
        }
      }
      items = items.slice(0, MAX_FETCHED_RESULTS);
    } else {
      const pageResponse = await fetchSearchPage(searchKey, locale, firstPage, requestedPageSize);
      items = pageResponse.items;
      total = pageResponse.total;
    }

    const results: SearchResult[] = items.map((item) => {
      const typeKey = item.typeKey || '';
      const categoryKey = typeKeyCategoryMap[typeKey];
      const description = stripHtml(item.body || '');

      return {
        id: String(item.id || ''),
        type: item.type || '',
        typeKey,
        title: item.title || '',
        description,
        createdDate: item.createdDate || '',
        file: item.file || '',
        url:
          (item.url && item.url.trim()) ||
          resolveResultUrl({ id: String(item.id || ''), typeKey, file: item.file || '' }),
        categoryKey,
      };
    });

    const fallbackResults = filterStaticResults(searchKey);
    const mergedResults = [...results, ...fallbackResults];
    const rankedResults = dedupeAndSortResults(mergedResults, searchKey);

    if (rankedResults.length === 0) {
      return {
        results: [],
        total: 0,
        query,
        page: options?.page,
        pageSize: options?.pageSize,
      };
    }

    return {
      results: rankedResults,
      total: rankedResults.length,
      query,
      page: options?.page,
      pageSize: options?.pageSize,
    };
  } catch (error) {
    console.error('Search API error:', error);
    const fallbackResults = filterStaticResults(searchKey);
    return {
      results: fallbackResults,
      total: fallbackResults.length,
      query,
      page: options?.page,
      pageSize: options?.pageSize,
    };
  }
}
