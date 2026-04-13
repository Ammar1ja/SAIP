import type { Meta, StoryObj } from '@storybook/nextjs';
import FilterableCardsSection from '@/components/organisms/FilterableCardsSection';
import ServiceCard from '@/components/molecules/ServiceCard';
import { ServiceCardProps } from '@/components/molecules/ServiceCard/ServiceCard';
import { FilterableItem } from '@/components/organisms/FilterableCardsSection/FilterableCardsSection.types';
import { Eye, Calendar, MapPin, Users } from 'lucide-react';

// Create compatible types for FilterableCardsSection
type ServiceCardWithFilterable = ServiceCardProps & {
  [key: string]: unknown;
};

// Training program type compatible with FilterableItem
interface TrainingProgram {
  id: string;
  title: string;
  date: string;
  category: string;
  duration: string;
  fees: string;
  location: string;
  host: string;
  description?: string;
  labels?: string[];
  [key: string]: unknown;
}

const meta: Meta<typeof FilterableCardsSection> = {
  title: 'Organisms/FilterableCardsSection',
  component: FilterableCardsSection,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockServices: ServiceCardWithFilterable[] = [
  {
    title: 'Patent Application Service',
    labels: ['Protection', 'Patents'],
    description: 'Complete service for patent application filing and processing.',
    primaryButtonLabel: 'Apply Now',
    primaryButtonHref: '#',
    secondaryButtonLabel: 'Learn More',
    secondaryButtonHref: '#',
  },
  {
    title: 'Trademark Registration',
    labels: ['Protection', 'Trademarks'],
    description: 'Comprehensive trademark registration service for brand protection.',
    primaryButtonLabel: 'Register',
    primaryButtonHref: '#',
    titleBg: 'green',
  },
  {
    title: 'Copyright Protection',
    labels: ['Protection', 'Copyrights'],
    description: 'Protect your creative works with our copyright services.',
    publicationDate: '15.01.2024',
    publicationNumber: 'CP-2024-001',
    primaryButtonLabel: 'View Details',
    primaryButtonHref: '#',
  },
  {
    title: 'Design Registration',
    labels: ['Registration', 'Designs'],
    description: 'Register your industrial designs for legal protection.',
    durationDate: '01.01.2024 - 31.12.2024',
    primaryButtonLabel: 'Get Started',
    primaryButtonHref: '#',
  },
];

const mockTrainingPrograms: TrainingProgram[] = [
  {
    id: '1',
    title: 'IP Law Fundamentals',
    date: '15.03.2024',
    category: 'Legal',
    duration: '3 days',
    fees: 'SAR 1,500',
    location: 'Riyadh',
    host: 'SAIP Academy',
    description: 'Comprehensive training on intellectual property law fundamentals',
    labels: ['Legal'],
  },
  {
    id: '2',
    title: 'Patent Filing Workshop',
    date: '22.03.2024',
    category: 'Patents',
    duration: '2 days',
    fees: 'SAR 1,200',
    location: 'Jeddah',
    host: 'IP Expert Center',
    description: 'Hands-on workshop for patent filing procedures',
    labels: ['Patents'],
  },
];

const serviceFilterFields = [
  {
    id: 'search',
    label: 'Search',
    type: 'search' as const,
    placeholder: 'Search services...',
  },
  {
    id: 'serviceType',
    label: 'Service Type',
    type: 'select' as const,
    options: [
      { value: '', label: 'All' },
      { value: 'protection', label: 'Protection' },
      { value: 'registration', label: 'Registration' },
    ],
    multiselect: true,
  },
  {
    id: 'category',
    label: 'Category',
    type: 'select' as const,
    options: [
      { value: '', label: 'All' },
      { value: 'patents', label: 'Patents' },
      { value: 'trademarks', label: 'Trademarks' },
      { value: 'copyrights', label: 'Copyrights' },
    ],
    multiselect: true,
  },
];

const trainingFilterFields = [
  {
    id: 'search',
    label: 'Search',
    type: 'search' as const,
    placeholder: 'Search programs...',
  },
  {
    id: 'category',
    label: 'Category',
    type: 'select' as const,
    options: [
      { value: '', label: 'All' },
      { value: 'Legal', label: 'Legal' },
      { value: 'Patents', label: 'Patents' },
    ],
  },
];

// Card renderers
const serviceCardRenderer = (item: FilterableItem, index: number) => {
  // Type assertion since we know the structure from mockServices
  const serviceItem = item as ServiceCardWithFilterable;
  return <ServiceCard key={`service-${index}`} {...serviceItem} />;
};

const trainingCardRenderer = (item: FilterableItem, index: number) => {
  // Type assertion since we know the structure from mockTrainingPrograms
  const program = item as TrainingProgram;
  return (
    <ServiceCard
      key={`training-${index}`}
      title={program.title}
      variant="detailed"
      details={[
        {
          icon: <Calendar className="w-4 h-4" />,
          label: 'Date',
          value: program.date,
        },
        {
          icon: <Eye className="w-4 h-4" />,
          label: 'Category',
          value: program.category,
        },
        {
          icon: <MapPin className="w-4 h-4" />,
          label: 'Location',
          value: program.location,
        },
        {
          icon: <Users className="w-4 h-4" />,
          label: 'Host',
          value: program.host,
        },
      ]}
      labels={program.labels || []}
      description={program.description || ''}
      primaryButtonLabel="Register"
      primaryButtonHref={`#/training/${program.id}`}
      secondaryButtonLabel="Details"
    />
  );
};

export const DefaultServices: Story = {
  args: {
    title: 'IP Services Directory',
    items: mockServices,
    filterFields: serviceFilterFields,
    cardRenderer: serviceCardRenderer,
    filterColumns: 3,
    gridColumns: {
      base: 1,
      sm: 2,
      lg: 3,
    },
    showTotalCount: true,
    totalCountLabel: 'Available services',
  },
};

export const TrainingPrograms: Story = {
  args: {
    title: 'Training Programs',
    items: mockTrainingPrograms,
    filterFields: trainingFilterFields,
    cardRenderer: trainingCardRenderer,
    filterColumns: 2,
    gridColumns: {
      base: 1,
      md: 2,
    },
    gridGap: 'gap-x-10 gap-y-12',
    showTotalCount: true,
    totalCountLabel: 'Total programs',
  },
};

export const WithSeparateFilters: Story = {
  args: {
    ...DefaultServices.args,
    filtersInSeparateSection: true,
    filtersBackground: 'primary-50',
    cardsBackground: 'white',
  },
};

export const WithPagination: Story = {
  args: {
    ...DefaultServices.args,
    items: [...mockServices, ...mockServices, ...mockServices], // 12 items
    pagination: {
      enabled: true,
      pageSize: 4,
    },
  },
};

export const Loading: Story = {
  args: {
    ...DefaultServices.args,
    isLoading: true,
  },
};

export const EmptyState: Story = {
  args: {
    ...DefaultServices.args,
    items: [],
    emptyStateContent: (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold mb-2">No services found</h3>
        <p className="text-neutral-600">Try adjusting your search filters</p>
      </div>
    ),
  },
};

export const CompactGrid: Story = {
  args: {
    ...DefaultServices.args,
    title: 'Compact Services View',
    gridColumns: {
      base: 1,
      sm: 2,
      lg: 3,
      xl: 4,
    },
    gridGap: 'gap-4',
    containerClassName: 'max-w-6xl mx-auto',
  },
};

export const WithHeaderActions: Story = {
  args: {
    ...DefaultServices.args,
    headerActions: (
      <div className="flex gap-3">
        <button className="px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition">
          Add Service
        </button>
        <button className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition">
          Export
        </button>
      </div>
    ),
  },
};
