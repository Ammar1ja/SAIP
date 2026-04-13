export const MEDIA_TABS = [
  { id: 'news', label: 'News' },
  { id: 'videos', label: 'Videos' },
  { id: 'articles', label: 'Articles' },
];

export const MEDIA_CONTENT = {
  news: {
    title: 'News',
    description: 'Get the latest information on patents in Saudi Arabia thanks to news from SAIP.',
  },
  videos: {
    title: 'Videos',
    description:
      'Explore the latest updates on the IP in Saudi Arabia through our video collection about patents.',
  },
  articles: {
    title: 'Articles',
    description:
      'Discover the latest articles from SAIP. Explore expert insights, key developments, and detailed analyses to stay ahead in the world of intellectual property. Stay informed with expert insights, industry trends, and key developments shaping IP today.',
  },
};

export const FILTER_FIELDS = [
  { id: 'search', label: 'Search', type: 'search' as const, placeholder: 'Search' },
  { id: 'date', label: 'Date', type: 'date' as const, placeholder: 'dd.mm.rrrr' },
];
