import type { Meta, StoryObj } from '@storybook/react/*';
import { ProjectCard } from '@/components/molecules/ProjectCard';

const meta: Meta<typeof ProjectCard> = {
  title: 'Molecules/ProjectCard',
  component: ProjectCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof ProjectCard>;

export const Default: Story = {
  args: {
    title: 'Main Text',
    reference: '123-456',
    tenderStage: 'Open',
    mainActivity: 'Government Infrastructure',
    tenderType: 'Open Tender',
    tenderFees: '$200',
    publicationDate: '2025-04-15',
    announcementVendor: 'GovTender Portal',
    bidSubmissionDeadline: '2025-07-15',
  },
};

export const DefaultRTL: Story = {
  args: {
    title: 'Main Text',
    reference: '123-456',
    tenderStage: 'Open',
    mainActivity: 'Government Infrastructure',
    tenderType: 'Open Tender',
    tenderFees: '$200',
    publicationDate: '2025-04-15',
    announcementVendor: 'GovTender Portal',
    bidSubmissionDeadline: '2025-07-15',
  },
  parameters: {
    direction: 'rtl',
  },
};

export const TenderClosed: Story = {
  args: {
    title: 'Main Text',
    reference: '123-456',
    tenderStage: 'Closed',
    mainActivity: 'Government Infrastructure',
    tenderType: 'Closed Tender',
    tenderFees: '$200',
    publicationDate: '2025-04-15',
    announcementVendor: 'GovTender Portal',
    bidSubmissionDeadline: '2025-07-15',
  },
};

export const TenderAwarded: Story = {
  args: {
    title: 'Main Text',
    reference: '123-456',
    tenderStage: 'Awarded',
    mainActivity: 'Government Infrastructure',
    tenderType: 'Restricted Tender',
    tenderFees: '$200',
    publicationDate: '2025-04-15',
    announcementVendor: 'GovTender Portal',
    bidSubmissionDeadline: '2025-07-15',
  },
};

export const WithLongText: Story = {
  args: {
    title:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    reference: '123-456',
    tenderStage: 'Open',
    mainActivity: 'Government Infrastructure',
    tenderType: 'Open Tender',
    tenderFees: '$200',
    publicationDate: '2025-04-15',
    announcementVendor: 'GovTender Portal',
    bidSubmissionDeadline: '2025-07-15',
  },
};
