import { FilterField } from '@/components/molecules/Filters/Filters.types';

export const tabs = [
  { id: 'news', label: 'News' },
  { id: 'videos', label: 'Videos' },
  { id: 'articles', label: 'Articles' },
];

export const newsArticles = [
  {
    id: 1,
    title:
      'In a Historic Step Toward Supporting Global Creativity: Adoption of the Riyadh Treaty on Design Law',
    publishData: '10.11.2024',
    excerpt:
      'In a Historic Step Toward Supporting Global Creativity: Adoption of the Riyadh Treaty on Design Law',
    categories: [
      { id: '1', name: 'General' },
      { id: '2', name: 'Designs' },
    ],
    image: '/images/photo-container.png',
  },
  {
    id: 2,
    title: 'The Kingdom of Saudi Arabia Hosts 193 Countries at the Diplomatic',
    publishData: '10.11.2024',
    excerpt: 'The Kingdom of Saudi Arabia Hosts 193 Countries at the Diplomatic',
    categories: [
      { id: '3', name: 'General' },
      { id: '4', name: 'Conferences' },
    ],
    image: '/images/photo-container.png',
  },
  {
    id: 3,
    title: 'Saudi Arabia Chairs the Diplomatic Conference on Design Law Treaty',
    publishData: '10.11.2024',
    excerpt:
      "Demonstrating confidence in Saudi Arabia's international standing and effectiveness in the field of intellectual property, Dr. Abdulaziz bin Mohammed Al-Swailem has been elected to chair the Diplomatic.",
    categories: [
      { id: '5', name: 'Intellectual property' },
      { id: '6', name: 'Conferences' },
    ],
    image: '/images/photo-container.png',
  },
  {
    id: 4,
    title: 'New IP Regulations Strengthen Protection Framework',
    publishData: '08.11.2024',
    excerpt:
      'The Saudi Authority for Intellectual Property announces comprehensive new regulations to strengthen IP protection across the kingdom.',
    categories: [
      { id: '7', name: 'Regulations' },
      { id: '8', name: 'IP Protection' },
    ],
    image: '/images/photo-container.png',
  },
  {
    id: 5,
    title: 'IP Academy Launches Advanced Training Program',
    publishData: '05.11.2024',
    excerpt:
      'A comprehensive training program designed to enhance IP knowledge among professionals and businesses across various sectors.',
    categories: [
      { id: '9', name: 'Education' },
      { id: '10', name: 'Training' },
    ],
    image: '/images/photo-container.png',
  },
  {
    id: 6,
    title: 'Trademark Registration Process Streamlined',
    publishData: '03.11.2024',
    excerpt:
      'New digital tools and processes make trademark registration faster and more accessible for businesses.',
    categories: [
      { id: '11', name: 'Trademarks' },
      { id: '12', name: 'Digital Services' },
    ],
    image: '/images/photo-container.png',
  },
];

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
    videoUrl: '/videos/sample-video.mp4',
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
    videoUrl: '/videos/sample-video.mp4',
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
    videoUrl: '/videos/sample-video.mp4',
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
    videoUrl: '/videos/sample-video.mp4',
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
    videoUrl: '/videos/sample-video.mp4',
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
    videoUrl: '/videos/sample-video.mp4',
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
    videoUrl: '/videos/sample-video.mp4',
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
    videoUrl: '/videos/sample-video.mp4',
    categories: [
      { id: '15', name: 'Events & Conferences' },
      { id: '16', name: 'Patents' },
    ],
    section: 'events',
  },
];

export const filterFields: FilterField[] = [
  {
    id: 'search',
    label: 'Search',
    type: 'search',
    placeholder: 'Search',
  },
  {
    id: 'date',
    label: 'Date',
    type: 'date',
    placeholder: 'Select date range',
    variant: 'range',
    restrictFutureDates: true,
  },
  {
    id: 'category',
    label: 'Category',
    type: 'select',
    placeholder: 'Select',
    multiselect: true,
    options: [
      { value: 'general', label: 'General' },
      { value: 'the latest from saip', label: 'The latest from SAIP' },
      { value: 'events & conferences', label: 'Events & Conferences' },
      { value: 'education', label: 'Education' },
      { value: 'regulations', label: 'Regulations' },
      { value: 'conferences', label: 'Conferences' },
      { value: 'workshops', label: 'Workshops' },
      { value: 'trademarks', label: 'Trademarks' },
      { value: 'patents', label: 'Patents' },
      { value: 'innovation', label: 'Innovation' },
    ],
  },
];
