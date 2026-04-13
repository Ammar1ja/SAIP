import type { Meta, StoryObj } from '@storybook/nextjs';
import IPServiceTemplate from '@/components/templates/IPServiceTemplate';
import { PatentDocIcon, PatentServicesIcon, PatentMediaIcon } from '@/components/icons/services';

const meta: Meta<typeof IPServiceTemplate> = {
  title: 'Templates/IPServiceTemplate',
  component: IPServiceTemplate,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockTabs = [
  {
    id: 'overview',
    label: 'Overview',
    icon: <PatentDocIcon className="w-5 h-5" aria-hidden="true" />,
  },
  {
    id: 'services',
    label: 'Services',
    icon: <PatentServicesIcon className="w-5 h-5" aria-hidden="true" />,
  },
  {
    id: 'media',
    label: 'Media',
    icon: <PatentMediaIcon className="w-5 h-5" aria-hidden="true" />,
  },
];

const mockBreadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'IP Service' },
];

const mockOverview = {
  hero: {
    title: 'IP Service Overview',
    description: 'This is a sample IP service overview page showcasing the template functionality.',
    backgroundImage: '/images/about/hero.jpg',
  },
  sections: <div className="p-8 text-center">Custom overview content goes here</div>,
  statistics: {
    title: 'Statistics',
    ctaLabel: 'View more statistics',
    ctaHref: '/statistics',
    stats: [],
    columns: 2,
  },
};

const mockServices = {
  title: 'Sample Services',
  services: [
    {
      title: 'Sample Service 1',
      labels: ['Protection'],
      description: 'This is a sample service description.',
      href: '#',
    },
    {
      title: 'Sample Service 2',
      labels: ['Management'],
      description: 'This is another sample service description.',
      href: '#',
    },
  ],
  serviceTypeOptions: [
    { value: 'all', label: 'All' },
    { value: 'protection', label: 'Protection' },
    { value: 'management', label: 'Management' },
  ],
  targetGroupOptions: [
    { value: 'all', label: 'All' },
    { value: 'individuals', label: 'Individuals' },
    { value: 'enterprises', label: 'Enterprises' },
  ],
};

const mockMedia = {
  heroTitle: 'Media for IP Service',
  heroDescription: 'Here you can find news related to this IP service.',
  heroImage: '/images/about/hero.jpg',
  tabs: [{ id: 'news', label: 'News' }],
  content: {
    news: {
      title: 'News',
      description: 'Get the latest information on this IP service.',
    },
  },
  filterFields: [{ id: 'search', label: 'Search', type: 'search', placeholder: 'Search' }],
  badgeLabel: 'IP Service',
};

export const Default: Story = {
  args: {
    tabs: mockTabs,
    defaultActiveTab: 'overview',
    breadcrumbs: mockBreadcrumbs,
    overview: mockOverview,
    services: mockServices,
    media: mockMedia,
  },
};

export const WithAdditionalTabs: Story = {
  args: {
    ...Default.args,
    tabs: [
      ...mockTabs,
      {
        id: 'custom',
        label: 'Custom Tab',
        icon: <PatentDocIcon className="w-5 h-5" aria-hidden="true" />,
      },
    ],
    additionalTabs: {
      custom: <div className="p-8 text-center">Custom tab content goes here</div>,
    },
  },
};
