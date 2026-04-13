export type ArticleCmsProps = {
  id: string;
  image: string;
  title: string;
  publishData: string;
  excerpt: string;
  categories: { id: string; name: string }[];
};

export const allArticles: ArticleCmsProps[] = [
  {
    id: '1',
    image: '/images/photo-container.png',
    title: 'Saudi Arabia Chairs the Diplomatic Conference on Design Law Treaty',
    publishData: 'Publication date: 24.11.2024',
    excerpt:
      "Demonstrating confidence in Saudi Arabia's international standing and effectiveness in the field of intellectual property, Dr. Abdulaziz bin Mohammed Al-Swailem has been elected to chair the Diplomatic.",
    categories: [{ id: '1', name: 'Service category' }],
  },
  {
    id: '2',
    image: '/images/photo-container.png',
    title: 'Saudi Arabia Chairs',
    publishData: 'Publication date: 25.11.2024',
    excerpt: "Demonstrating confidence in Saudi Arabia's international standing and effectiveness",
    categories: [
      { id: '1', name: 'Category 1' },
      { id: '2', name: 'Category 2' },
      { id: '3', name: 'Category 3' },
      { id: '4', name: 'Category 4' },
      { id: '5', name: 'Category 5' },
    ],
  },
  {
    id: '3',
    image: '/images/photo-container.png',
    title: '3 Saudi Arabia Chairs the Diplomatic Conference on Design Law Treaty',
    publishData: 'Publication date: 26.11.2024',
    excerpt:
      "Demonstrating confidence in Saudi Arabia's international standing and effectiveness in the field of intellectual property, Dr. Abdulaziz bin Mohammed Al-Swailem has been elected to chair the Diplomatic.",
    categories: [{ id: '1', name: 'Service category' }],
  },
  {
    id: '4',
    image: '/images/photo-container.png',
    title: '4 Saudi Arabia Chairs the Diplomatic Conference on Design Law Treaty',
    publishData: 'Publication date: 27.11.2024',
    excerpt:
      "Demonstrating confidence in Saudi Arabia's international standing and effectiveness in the field of intellectual property, Dr. Abdulaziz bin Mohammed Al-Swailem has been elected to chair the Diplomatic. Demonstrating confidence in Saudi Arabia's international standing and effectiveness in the field of intellectual property, Dr. Abdulaziz bin Mohammed Al-Swailem has been elected to chair the Diplomatic.",
    categories: [{ id: '1', name: 'Service category' }],
  },
];
