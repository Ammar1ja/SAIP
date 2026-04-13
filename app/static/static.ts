import { NewsArticle } from '@/lib/drupal/services';
import { Article } from '@/lib/drupal/services/articles.service';
import { InternationalTreatyDetail } from '@/lib/drupal/services/international-treaties-detail.service';
import { QualificationData, TrainingProgramData } from '@/lib/drupal/services/ip-academy.service';
import { PathwayData } from '@/lib/drupal/services/litigation-paths.service';
import type {
  CivilAssociation,
  ObjectiveItem,
} from '@/lib/drupal/services/supervisory-unit.service';
import { VideoFilterCategory } from '@/lib/drupal/services/video-filter-categories.service';
import { Video } from '@/lib/drupal/services/videos.service';
import { Comment } from '../[locale]/media-center/media-library/media-center/data/comments.data';
import { ServiceDirectoryData } from '@/lib/drupal/services/service-directory.service';
import { RelatedServicesSectionProps } from '@/components/organisms/RelatedServicesSection';
export const OBJECTIVES: ObjectiveItem[] = [
  {
    id: '1',
    text: 'Enhance the development and protection of intellectual property across all sectors.',
  },
  {
    id: '2',
    text: 'Support innovators, creators, and entrepreneurs in registering and managing their IP rights.',
  },
  {
    id: '3',
    text: 'Strengthen collaboration between government entities and private organizations in IP-related initiatives.',
  },
  {
    id: '4',
    text: 'Promote awareness and education about intellectual property rights within the community.',
  },
  {
    id: '5',
    text: 'Facilitate access to IP services through digital transformation and streamlined processes.',
  },
  {
    id: '6',
    text: 'Encourage research, innovation, and commercialization of intellectual assets.',
  },
];

export const CIVIL_ASSOCIATIONS: CivilAssociation[] = [
  {
    id: '1',
    title: 'Saudi Intellectual Property Association',
    classification: 'Non-Profit Organization',
    email: 'info@sipa.sa',
    location: 'Riyadh, Saudi Arabia',
    website: 'https://www.sipa.sa',
  },
  {
    id: '2',
    title: 'Digital Innovation Society',
    classification: 'Professional Association',
    email: 'contact@dis.org.sa',
    location: 'Jeddah, Saudi Arabia',
    website: 'https://www.dis.org.sa',
  },
  {
    id: '3',
    title: 'Creative Industries Council',
    classification: 'Government-Linked Entity',
    email: 'support@cic.sa',
    location: 'Dammam, Saudi Arabia',
    website: 'https://www.cic.sa',
  },
  {
    id: '4',
    title: 'Tech Entrepreneurs Network',
    classification: 'Industry Network',
    email: 'hello@ten.sa',
    location: 'Riyadh, Saudi Arabia',
    website: 'https://www.ten.sa',
  },
  {
    id: '5',
    title: 'Open Knowledge Foundation Saudi',
    classification: 'Non-Profit Organization',
    email: 'info@okfsa.org',
    location: 'Makkah, Saudi Arabia',
    website: 'https://www.okfsa.org',
  },
  {
    id: '6',
    title: 'National Digital Transformation Alliance',
    classification: 'Strategic Alliance',
    email: 'contact@ndta.sa',
    location: 'Riyadh, Saudi Arabia',
    website: 'https://www.ndta.sa',
  },
];
export const STATIC_PROGRAM: TrainingProgramData = {
  id: '1',
  title: 'IP Fundamentals Training Program',
  description:
    'A comprehensive training program designed to introduce participants to intellectual property fundamentals and practical applications.',
  details:
    'This program provides deep insight into IP systems, protection strategies, and real-world case studies across industries.',
  forWhom:
    'Suitable for students, entrepreneurs, professionals, and government employees interested in intellectual property.',
  whatYouWillLearn: [
    'Understanding intellectual property basics',
    'Types of intellectual property rights',
    'IP protection strategies',
    'Real-world IP case studies',
  ],
  startDate: '2026-05-01',
  duration: '5 Days',
  fees: 'Free',
  language: 'English',
  category: 'IP Awareness',
  hosts: 'SAIP Academy',
  location: 'Riyadh, Saudi Arabia',
  faqHref: '/faq',
  registerHref: '/services/ip-academy/register/1',
  registerNote: 'Register early to secure your spot in this exclusive training program.',
  courseFormat:
    'Lecture: Interactive sessions\nWorkshop: Hands-on exercises\nDiscussion: Group case studies',
  courseMaterials: '- Presentation slides\n- Case studies\n- Worksheets\n- Reference guides',
  courseMaterialsHref: '/materials/ip-fundamentals',

  relatedServicesTitle: 'Related Training Programs',
  relatedServicesDescription:
    'Explore more IP Academy training programs designed to enhance your knowledge.',

  programme: [
    {
      id: '1',
      title: 'Module 1',
      subtitle: 'Introduction to Intellectual Property',
      description: 'Overview of IP concepts, importance, and global frameworks.',
    },
    {
      id: '2',
      title: 'Module 2',
      subtitle: 'IP Protection Strategies',
      description: 'Learn how to protect patents, trademarks, and copyrights effectively.',
    },
    {
      id: '3',
      title: 'Module 3',
      subtitle: 'Practical Case Studies',
      description: 'Real-world examples of intellectual property applications in industry.',
    },
  ],
};
export const STATIC_RELATED_PROGRAMS = [
  {
    id: '2',
    title: 'Advanced IP Strategy Program',
    date: '12.06.2026',
    time: '10:00 AM',
    category: 'IP Strategy',
    duration: '3 Days',
    fees: 'Free',
    location: 'Riyadh, Saudi Arabia',
    host: 'SAIP Academy',
    registerHref: '/services/ip-academy/register/2',
  },
  {
    id: '3',
    title: 'Trademark Protection Workshop',
    date: '20.06.2026',
    time: '02:00 PM',
    category: 'Trademarks',
    duration: '2 Days',
    fees: 'Free',
    location: 'Jeddah, Saudi Arabia',
    host: 'SAIP Academy',
    registerHref: '/services/ip-academy/register/3',
  },
  {
    id: '4',
    title: 'Copyright Fundamentals Training',
    date: '28.06.2026',
    time: '09:00 AM',
    category: 'Copyright',
    duration: '4 Days',
    fees: 'Free',
    location: 'Dammam, Saudi Arabia',
    host: 'SAIP Academy',
    registerHref: '/services/ip-academy/register/4',
  },
];
export const STATIC_QUALIFICATION: QualificationData = {
  id: '1',
  title: 'Professional IP Qualification Program',
  description:
    'A structured STATIC_QUALIFICATION program designed to build strong expertise in intellectual property fundamentals and practices.',
  details:
    'This STATIC_QUALIFICATION prepares candidates for advanced understanding of IP systems, legal frameworks, and real-world application scenarios.',

  category: 'IP Certification',

  forWhom: [
    'Law students and graduates',
    'IP professionals',
    'Entrepreneurs and innovators',
    'Government employees',
  ],

  requirements: [
    'Bachelor degree or equivalent',
    'Basic understanding of legal concepts',
    'English proficiency',
  ],

  studyMaterialLabel: 'Download Study Material',
  studyMaterialHref: '/files/ip-STATIC_QUALIFICATION-material.pdf',

  examPrograms: [
    {
      id: '1',
      title: 'IP Law Basics',
      description: 'Introduction to intellectual property legal frameworks.',
      date: '2026-06-01',
      link: '/exam/ip-law-basics',
    },
    {
      id: '2',
      title: 'Trademark & Patent Law',
      description: 'Advanced concepts in trademarks and patents.',
      date: '2026-06-15',
      link: '/exam/trademark-patent',
    },
  ],

  chapters: [
    {
      id: '1',
      title: 'Chapter 1',
      subtitle: 'Introduction to IP',
      description: 'Basic concepts and definitions of intellectual property.',
    },
    {
      id: '2',
      title: 'Chapter 2',
      subtitle: 'IP Protection',
      description: 'Methods and strategies for protecting intellectual property.',
    },
    {
      id: '3',
      title: 'Chapter 3',
      subtitle: 'Enforcement',
      description: 'How IP rights are enforced globally.',
    },
  ],

  startDate: '2026-05-10',
  duration: '6 Months',
  fees: 'Free',
  language: 'English',
  testType: 'Online Exam',
  passingScore: '70%',
  location: 'Riyadh, Saudi Arabia',
  faqHref: '/faq',
  registerHref: '/services/ip-academy/register/qual-1',

  studyMaterialHref: '/files/ip-STATIC_QUALIFICATION-material.pdf',
};
export const STATIC_RELATED_QUALIFICATION = [
  {
    id: 'qualification-1',
    title: 'Project Management Professional (PMP)',
    description:
      'Learn essential project management skills, methodologies, and best practices to successfully lead projects.',
    category: 'Management',
  },
  {
    id: 'qualification-2',
    title: 'Certified Data Analyst',
    description:
      'Gain practical skills in data analysis, visualization, and decision-making using modern tools.',
    category: 'Data',
  },
  {
    id: 'qualification-3',
    title: 'Full Stack Web Development',
    description:
      'Master front-end and back-end development technologies to build complete web applications.',
    category: 'Development',
  },
  {
    id: 'qualification-4',
    title: 'Digital Marketing Specialist',
    description:
      'Understand SEO, social media marketing, and online advertising strategies to grow businesses.',
    category: 'Marketing',
  },
  {
    id: 'qualification-5',
    title: 'Cybersecurity Fundamentals',
    description:
      'Learn how to protect systems, networks, and data from cyber threats and vulnerabilities.',
    category: 'Security',
  },
  {
    id: 'qualification-6',
    title: 'UI/UX Design Professional',
    description:
      'Design intuitive and engaging user experiences using modern UI/UX principles and tools.',
    category: 'Design',
  },
];
export const STATIC_LITIGATION_PATHS_DATA: {
  section: {
    heading: string;
    description: string;
  };
  pathways: PathwayData[];
} = {
  section: {
    heading: 'Litigation Pathways',
    description:
      'Explore the different litigation pathways depending on the case type and legal process. Each pathway represents a structured journey from investigation to final judgment.',
  },

  pathways: [
    {
      type: 'investigation-prosecution',
      title: 'Investigation & Prosecution',
      nodes: {
        // These keys MUST match your structure.nodes ids
        'investigation-prosecution': {
          id: 'investigation-prosecution',
          label: 'Investigation & Prosecution',
          note: 'Authorities investigate the case and prepare legal documentation.',
          image: {
            src: '/images/investigation-prosecution.png',
            alt: 'Investigation',
          },
        },

        'public-prosecution': {
          id: 'public-prosecution',
          label: 'Public Prosecution',
          note: 'The prosecution reviews evidence and proceeds with charges.',
        },

        'case-registration': {
          id: 'case-registration',
          label: 'Case Registration',
          note: 'The case is officially registered in the legal system.',
        },

        'court-review': {
          id: 'court-review',
          label: 'Court Review',
          note: 'Judges examine arguments and submitted evidence.',
        },

        hearing: {
          id: 'hearing',
          label: 'Hearing',
          note: 'Both parties present their arguments before the court.',
        },

        judgment: {
          id: 'judgment',
          label: 'Judgment',
          note: 'Final ruling is issued based on the case evaluation.',
          button: {
            label: 'Read more',
            href: '/services/litigation/investigation',
          },
        },
      },
    },

    {
      type: 'public-prosecution-pat',
      title: 'Public Prosecution (Patent)',
      nodes: {
        'public-prosecution-pat': {
          id: 'public-prosecution-pat',
          label: 'Public Prosecution',
          note: 'Initial prosecution phase begins.',
          image: {
            src: '/images/public-prosecution.png',
            alt: 'Public Prosecution',
          },
        },

        'patent-filing': {
          id: 'patent-filing',
          label: 'Patent Filing Review',
          note: 'Patent documentation is reviewed for compliance.',
        },

        'technical-evaluation': {
          id: 'technical-evaluation',
          label: 'Technical Evaluation',
          note: 'Experts assess the technical aspects of the case.',
        },

        'legal-review': {
          id: 'legal-review',
          label: 'Legal Review',
          note: 'Legal framework and precedents are examined.',
        },

        appeal: {
          id: 'appeal',
          label: 'Appeal مرحلة الاستئناف',
          note: 'The decision may be challenged in a higher authority.',
        },

        'final-decision': {
          id: 'final-decision',
          label: 'Final Decision',
          note: 'The case is concluded with a binding judgment.',
          button: {
            label: 'View details',
            href: '/services/litigation/prosecution',
          },
        },
      },
    },
  ],
};
export const STATIC_INTERNATIONAL_TREATIES_DATA = {
  hero: {
    title: 'International Treaties & Agreements',
    description:
      'Explore key international treaties and agreements that shape global cooperation, trade, and legal frameworks.',
    backgroundImage: '/images/international-treaties/hero.jpg',
  },

  treaties: [
    {
      id: 'treaty-1',
      title: 'Paris Climate Agreement',
      shortName: 'Paris Agreement',
      description:
        'An international treaty focused on reducing global warming and climate change impact through emissions control.',
      organization: 'United Nations',
      status: 'Active',
    },
    {
      id: 'treaty-2',
      title: 'Vienna Convention on Diplomatic Relations',
      shortName: 'Vienna Convention',
      description: 'Defines a framework for diplomatic relations between independent countries.',
      organization: 'United Nations',
      status: 'Active',
    },
    {
      id: 'treaty-3',
      title: 'United Nations Charter',
      shortName: 'UN Charter',
      description:
        'Foundational treaty that established the United Nations and its core principles.',
      organization: 'United Nations',
      status: 'Active',
    },
    {
      id: 'treaty-4',
      title: 'North American Free Trade Agreement',
      shortName: 'NAFTA',
      description:
        'Trade agreement that reduced barriers between the United States, Canada, and Mexico.',
      organization: 'Trilateral Commission',
      status: 'Replaced',
    },
    {
      id: 'treaty-5',
      title: 'Geneva Conventions',
      shortName: 'Geneva Conventions',
      description:
        'A set of treaties defining humanitarian treatment during war and armed conflicts.',
      organization: 'International Committee of the Red Cross',
      status: 'Active',
    },
  ],
};
export const STATIC_TREATIES = {
  'paris-agreement': {
    id: 'paris-agreement',
    title: 'Paris Climate Agreement',
    description: 'Global climate treaty...',
    image: '/images/international-treaties/hero.jpg',
  },

  'vienna-convention': {
    id: 'vienna-convention',
    title: 'Vienna Convention',
    description: 'Diplomatic relations framework...',
    image: '/images/vienna.jpg',
  },
};
export const STATIC_TREATY_DETAIL: InternationalTreatyDetail = {
  id: 'paris-agreement',
  title: 'Paris Climate Agreement',
  shortName: 'Paris Agreement',
  description:
    'An international treaty focused on limiting global warming and reducing greenhouse gas emissions.',
  content: `
    The Paris Agreement is a landmark international treaty on climate change adopted in 2015.

    It aims to strengthen global response to climate change by keeping global temperature rise well below 2°C.
  `,
  organization: 'United Nations Framework Convention on Climate Change (UNFCCC)',
  status: 'Active',
  signedDate: '2015-12-12',
  effectiveDate: '2016-11-04',
  publicationDate: '2016-01-22',
  image: '/images/international-treaties/hero.jpg',
};
export const STATIC_MEDIA_CENTER = {
  newsArticles: [
    {
      id: 'news-1',
      title: 'New IP Regulations Announced',
      excerpt: 'The government introduces updated IP protection laws.',
      publishDate: '2025-01-10',
      image: '/images/news/news-1.jpg',
      imageAlt: 'IP regulations update',
      categories: [{ id: 'legal', name: 'Legal' }],
      href: '/media/news/news-1',
    },
  ] satisfies NewsArticle[],

  newsCategories: [
    { id: 'legal', name: 'Legal' },
    { id: 'policy', name: 'Policy' },
  ],

  articles: [
    {
      id: 'article-1',
      title: 'Understanding Intellectual Property',
      excerpt: 'A deep dive into IP rights and enforcement.',
      publishDate: '2025-02-01',
      image: '/images/articles/article-1.jpg',
      imageAlt: 'IP article',
      categories: [{ id: 'education', name: 'Education' }],
      href: '/media/articles/article-1',
      content: 'Full article content...',
      author: 'SAIP Team',
    },
  ] satisfies Article[],

  videos: [
    {
      id: 'video-1',
      title: 'IP Awareness Video',
      slug: 'ip-awareness',
      excerpt: 'Learn about intellectual property basics.',
      body: 'Video description content...',
      videoUrl: 'https://example.com/video.mp4',
      videoType: 'remote',
      image: '/images/videos/video-1.jpg',
      imageAlt: 'IP video',
      publishDate: '2025-03-01',
      categories: [{ id: 'education', name: 'Education' }],
      ipCategories: [{ id: 'copyright', name: 'Copyright' }],
      videoCategories: [{ id: 'awareness', name: 'Awareness' }],
      videoFilterCategories: [{ id: 'all', name: 'All' }],
    },
  ] satisfies Video[],

  videoFilterCategories: [
    { id: 'all', name: 'All' },
    { id: 'education', name: 'Education' },
  ] satisfies VideoFilterCategory[],
};
export const STATIC_ARTICLE: Article = {
  id: 'article-1',
  title: 'Understanding Intellectual Property',
  excerpt: 'A deep dive into IP rights and enforcement.',
  publishDate: '2025-01-10',
  image: '/images/photo-container.png',
  imageAlt: 'Article image',
  categories: [{ id: 'ip', name: 'Intellectual Property' }],
  href: '/media/article/article-1',
  content: `<p>This is static article content.</p>`,
  author: 'SAIP',
};
export const STATIC_COMMENTS: Comment[] = [
  {
    id: 'c1',
    author: 'Ahmed Ali',
    content: 'Great article, very informative!',
    publicationDate: '2025-01-12',
  },
  {
    id: 'c2',
    author: 'Sara Mohammed',
    content: 'This helped me understand IP better.',
    publicationDate: '2025-01-13',
  },
];
export const STATIC_ARTICLE_STRINGS = {
  backLabel: 'Go back to Articles',
  publicationDate: 'Publication Date',
  commentsTitle: 'Comments',
  addCommentTitle: 'Add comment',
  seeMore: 'See more',
  authorFallback: 'Anonymous',

  form: {
    fullName: 'Full name',
    fullNamePlaceholder: 'Type your full name',
    email: 'Email',
    emailPlaceholder: 'Type your email',
    phoneNumber: 'Phone number',
    phoneNumberPlaceholder: 'Type your phone number',
    comment: 'Comment',
    commentPlaceholder: 'Type your message',
    submit: 'Send request',
    submitting: 'Sending...',
    success: 'Your comment has been submitted.',
    error: 'Failed to submit comment. Please try again.',
  },
};
export const mockServiceDirectoryData: ServiceDirectoryData = {
  heroHeading: 'Service Directory',
  heroSubheading: 'Browse all available services easily',

  heroImage: {
    url: '/images/hero.jpg',
    alt: 'Service directory hero',
  },

  services: [
    {
      id: '1',
      title: 'Business Registration',
      description: 'Register your business quickly and easily',
      href: '/services/business-registration',
      category: 'Business',
      serviceType: 'Online',
      serviceCategoryIds: ['business'],
      ipCategoryIds: ['ip1'],
      targetGroupIds: ['individuals'],
    },
    {
      id: '2',
      title: 'Trademark Filing',
      description: 'Protect your brand with trademark registration',
      href: '/services/trademark',
      category: 'IP',
      serviceType: 'In-person',
      serviceCategoryIds: ['ip'],
      ipCategoryIds: ['ip2'],
      targetGroupIds: ['companies'],
    },
    {
      id: '3',
      title: 'Patent Search',
      description: 'Search existing patents easily',
      href: '/services/patent-search',
      category: 'IP',
      serviceType: 'Online',
      serviceCategoryIds: ['ip'],
      ipCategoryIds: ['ip3'],
      targetGroupIds: ['researchers'],
    },
  ],

  categories: ['Business', 'IP'],
  serviceCategories: ['business', 'ip'],
  serviceTypes: ['Online', 'In-person'],
  targetGroups: ['individuals', 'companies', 'researchers'],

  categoryOptions: [
    { label: 'Business', value: 'Business' },
    { label: 'IP', value: 'IP' },
  ],

  serviceTypeOptions: [
    { label: 'Online', value: 'Online' },
    { label: 'In-person', value: 'In-person' },
  ],

  targetGroupOptions: [
    { label: 'Individuals', value: 'individuals' },
    { label: 'Companies', value: 'companies' },
    { label: 'Researchers', value: 'researchers' },
  ],
};
export const mockCopyrightsData = {
  heroHeading: 'Copyrights Protection',
  heroSubheading: 'Protect your creative works and intellectual property',

  heroImage: {
    src: '/images/copyrights-hero.jpg',
  },

  overview: {
    header: {
      title: 'About Copyrights',
      description: 'Learn about protecting your creative works.',
      videoSrc: 'https://example.com/video.mp4',
      videoPoster: '/images/video-poster.jpg',
    },

    guide: {
      guideTitle: 'How to register',
      guideCards: [
        {
          title: 'Step 1',
          description: 'Submit application',
        },
        {
          title: 'Step 2',
          description: 'Review process',
        },
      ],
      ctaLabel: 'Learn more',
      ctaHref: '/guide',
    },

    statistics: {
      statisticsTitle: 'Statistics',
      statistics: [
        { label: 'Applications', value: '1200' },
        { label: 'Approvals', value: '900' },
      ],
      statisticsCtaLabel: 'View all',
      statisticsCtaHref: '/stats',
    },
  },

  relatedPages: {
    title: 'Related Pages',
    items: [
      { label: 'Trademarks', href: '/trademarks' },
      { label: 'Patents', href: '/patents' },
    ],
  },

  journey: {
    tocAriaLabel: 'Table of contents',
  },

  services: {
    title: 'Services',
    services: [
      {
        id: '1',
        title: 'Copyright Registration',
        description: 'Register your copyright',
        href: '/services/copyright',
        serviceTypeIds: ['online'],
        targetGroupIds: ['individuals'],
      },
    ],
    serviceTypeOptions: [
      { label: 'Online', value: 'online' },
      { label: 'In-person', value: 'in-person' },
    ],
    targetGroupOptions: [
      { label: 'Individuals', value: 'individuals' },
      { label: 'Companies', value: 'companies' },
    ],
  },

  media: {
    heroImage: '/images/media-hero.jpg',
    tabs: [
      { id: 'news', label: 'News' },
      { id: 'articles', label: 'Articles' },
      { id: 'videos', label: 'Videos' },
    ],
    filterFields: [],
  },

  dataSource: 'mock',
};
export const mockMediaItems = {
  news: [
    { id: 1, title: 'Copyright Law Updated', description: 'New updates released' },
    { id: 2, title: 'IP Awareness Campaign', description: 'Nationwide campaign launched' },
  ],
  articles: [{ id: 1, title: 'How Copyright Works', description: 'Guide article' }],
  videos: [{ id: 1, title: 'Copyright Basics', description: 'Intro video' }],
};
export const mockRelatedServices: RelatedServicesSectionProps = {
  title: 'Related Services',
  description: 'Explore other services related to this topic',

  cardWidth: 410,

  services: [
    {
      id: '1',
      title: 'Copyright Registration',
      description: 'Register your creative work and protect ownership',
      labels: ['IP', 'Online'],
      variant: 'services',
    },
    {
      id: '2',
      title: 'Trademark Search',
      description: 'Search existing trademarks before filing',
      href: '/services/trademark-search',
      labels: ['IP', 'Search'],
      variant: 'services',
    },
    {
      id: '3',
      title: 'Patent Filing',
      description: 'Apply for patent protection for your invention',
      href: '/services/patent-filing',
      labels: ['IP', 'Innovation'],
      variant: 'services',
    },
  ],
};
// import { mockRelatedServices } from '../../../../../static/static';
