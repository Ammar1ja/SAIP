/**
 * National IP Strategy Integration
 * Integrates Drupal data with existing fallback data for National IP Strategy page
 */

import { getNationalIPStrategyData } from './services/national-ip-strategy.service';
import { allArticles } from '../dummyCms/allArticles';

export async function getNationalIPStrategyPageData(locale?: string) {
  try {
    // Attempt to fetch from Drupal
    const drupalData = await getNationalIPStrategyData(locale);

    // Merge with fallback news articles ONLY if empty
    // (This allows Drupal-managed news to be displayed if configured)
    if (drupalData.news.articles.length === 0) {
      drupalData.news.articles = allArticles;
    }

    return drupalData;
  } catch (error) {
    // Failed to fetch National IP Strategy data from Drupal, using fallback
    console.error('NATIONAL IP STRATEGY: Using fallback data', error);

    const fallbackData = {
      hero: {
        heading: 'National IP Strategy',
        subheading:
          'The National IP Strategy is a comprehensive plan that aims to foster innovation, creativity, and economic growth through the effective use and protection of intellectual property rights in Saudi Arabia.',
        backgroundImage: '/images/national-ip-strategy/about-nipst.jpg',
      },
      about: {
        heading: 'About NIPST',
        description:
          'In line with Vision 2030 directions, the entity seeks to adopt an integrated system for measuring beneficiary experience, enabling the identification of challenges and the improvement of service quality in a manner that enhances trust and efficiency.',
        image: {
          src: '/images/national-ip-strategy/about-nipst.jpg',
          alt: 'About NIPST',
        },
      },
      objectives: {
        heading: 'National strategy objectives',
        text: '',
        items: [
          {
            id: '1',
            description: 'Develop creative individuals based on imagination and challenge',
            icon: '/icons/objectives/creativity.svg',
          },
          {
            id: '2',
            description: 'Development establishments based on intellectual property',
            icon: '/icons/objectives/development.svg',
          },
          {
            id: '3',
            description: 'Achieving society based on respect for creative efforts',
            icon: '/icons/objectives/innovation.svg',
          },
        ],
      },
      pillars: {
        heading: 'National pillars',
        text: '',
        items: [
          {
            id: 'ip-generation',
            title: 'IP generation',
            description:
              'Proceeding from the importance of generating IP and based on what the Kingdom possesses of creative minds and young talents that innovate in various fields and other competitive advantages. High economic and social value.',
            image: {
              src: '/images/national-ip-strategy/photo-container.jpg',
              alt: 'IP generation illustration',
            },
          },
          {
            id: 'ip-respect',
            title: 'IP respect',
            description:
              'Enhancing respect for intellectual property rights and raising awareness of their importance in supporting creativity and innovation, which contributes to achieving development goals.',
            image: {
              src: '/images/national-ip-strategy/photo-container.jpg',
              alt: 'IP respect illustration',
            },
          },
          {
            id: 'commercial-investment',
            title: 'Commercial investment',
            description:
              'Supporting the commercial investment of intellectual property and facilitating access to it, which enhances the contribution of intellectual property to economic growth.',
            image: {
              src: '/images/national-ip-strategy/photo-container.jpg',
              alt: 'Commercial investment illustration',
            },
          },
          {
            id: 'ip-administration',
            title: 'IP administration',
            description:
              'Developing the administration of intellectual property and enhancing coordination between relevant authorities to ensure the effectiveness of the intellectual property system.',
            image: {
              src: '/images/national-ip-strategy/photo-container.jpg',
              alt: 'IP administration illustration',
            },
          },
        ],
      },
      document: {
        heading: 'National IP strategy document',
        description: '',
        image: {
          src: '/images/national-ip-strategy/ip-document.jpg',
          alt: 'National IP Strategy document',
        },
        buttons: [
          {
            label: 'Show file',
            href: '#view',
            ariaLabel: 'View National IP Strategy document',
            icon: '/icons/eye.svg',
            intent: 'secondary' as const,
          },
          {
            label: 'Download file',
            href: '#download',
            ariaLabel: 'Download National IP Strategy document',
            icon: '/icons/download.svg',
            intent: 'primary' as const,
          },
        ],
      },
      news: {
        heading: 'Latest news',
        text: 'Stay informed with the latest updates from the SAIP including key announcements, policy changes, initiatives, and developments in the IP sector.',
        articles: allArticles,
      },
    };

    return fallbackData;
  }
}
