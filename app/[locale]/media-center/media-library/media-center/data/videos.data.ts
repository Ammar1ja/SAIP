export interface Video {
  id: number;
  title: string;
  publishData: string;
  thumbnail: string;
  videoUrl: string;
  categories: Array<{ id: string; name: string }>;
  section: 'latest' | 'events';
}

export const videos: Video[] = [
  {
    id: 1,
    title: 'Saudi Arabia Chairs the Diplomatic Conference on Design Law Treaty',
    publishData: '10.11.2024',
    thumbnail: '/images/photo-container.png',
    videoUrl: '/videos/homepage.mp4',
    categories: [
      { id: '1', name: 'The latest from SAIP' },
      { id: '2', name: 'General' },
    ],
    section: 'latest',
  },
  {
    id: 2,
    title: 'IP Academy Training Program Launch',
    publishData: '08.11.2024',
    thumbnail: '/images/photo-container.png',
    videoUrl: '/videos/homepage.mp4',
    categories: [
      { id: '3', name: 'The latest from SAIP' },
      { id: '4', name: 'Education' },
    ],
    section: 'latest',
  },
  {
    id: 3,
    title: 'New IP Regulations Implementation',
    publishData: '05.11.2024',
    thumbnail: '/images/photo-container.png',
    videoUrl: '/videos/homepage.mp4',
    categories: [
      { id: '5', name: 'The latest from SAIP' },
      { id: '6', name: 'Regulations' },
    ],
    section: 'latest',
  },
  {
    id: 4,
    title: 'International IP Conference 2024',
    publishData: '12.11.2024',
    thumbnail: '/images/photo-container.png',
    videoUrl: '/videos/homepage.mp4',
    categories: [
      { id: '7', name: 'Events & Conferences' },
      { id: '8', name: 'Conferences' },
    ],
    section: 'events',
  },
  {
    id: 5,
    title: 'IP Protection Workshop Series',
    publishData: '15.11.2024',
    thumbnail: '/images/photo-container.png',
    videoUrl: '/videos/homepage.mp4',
    categories: [
      { id: '9', name: 'Events & Conferences' },
      { id: '10', name: 'Workshops' },
    ],
    section: 'events',
  },
  {
    id: 6,
    title: 'Trademark Registration Seminar',
    publishData: '18.11.2024',
    thumbnail: '/images/photo-container.png',
    videoUrl: '/videos/homepage.mp4',
    categories: [
      { id: '11', name: 'Events & Conferences' },
      { id: '12', name: 'Trademarks' },
    ],
    section: 'events',
  },
  {
    id: 7,
    title: 'IP Innovation Summit 2024',
    publishData: '20.11.2024',
    thumbnail: '/images/photo-container.png',
    videoUrl: '/videos/homepage.mp4',
    categories: [
      { id: '13', name: 'The latest from SAIP' },
      { id: '14', name: 'Innovation' },
    ],
    section: 'latest',
  },
  {
    id: 8,
    title: 'Patent Application Workshop',
    publishData: '22.11.2024',
    thumbnail: '/images/photo-container.png',
    videoUrl: '/videos/homepage.mp4',
    categories: [
      { id: '15', name: 'Events & Conferences' },
      { id: '16', name: 'Patents' },
    ],
    section: 'events',
  },
];
