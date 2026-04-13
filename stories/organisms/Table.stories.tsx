import type { Meta, StoryObj } from '@storybook/react';
import { Table } from '../../components/organisms/Table';

const meta: Meta<typeof Table> = {
  title: 'Organisms/Table',
  component: Table,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    className: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const ipServicesData = [
  {
    classification: 'Food',
    applications: '0000',
  },
  {
    classification: 'Clothing and accessories',
    applications: '0000',
  },
  {
    classification: 'Luggage, bags, umbrellas and canes',
    applications: '0000',
  },
  {
    classification: 'Home furnishings',
    applications: '0000',
  },
  {
    classification: 'Textile goods, including bed covers and upholstery',
    applications: '0000',
  },
  {
    classification: 'Ropes, small ropes, nets, and tents',
    applications: '0000',
  },
  {
    classification: 'Paper and paper products, including stationery',
    applications: '0000',
  },
  {
    classification: 'Household tools and appliances',
    applications: '0000',
  },
  {
    classification: 'Sanitary, heating, and cooling equipment',
    applications: '0000',
  },
  {
    classification: 'Watches and measuring instruments',
    applications: '0000',
  },
];

const ipServicesColumns = [
  {
    key: 'classification' as const,
    header: 'Classification name',
    align: 'left' as const,
  },
  {
    key: 'applications' as const,
    header: 'Number of application or registration certificate',
    align: 'center' as const,
  },
];

export const Default: Story = {
  args: {
    columns: ipServicesColumns,
    data: ipServicesData,
  },
};

export const IPServicesExample: Story = {
  args: {
    columns: ipServicesColumns,
    data: ipServicesData,
    className: 'max-w-4xl',
  },
};

/** Matches Figma: 50/50 columns (~640px at 1280px), center vertical rule on header row only, 48px header, no outer side frame. */
export const IPServicesHorizontalRules: Story = {
  args: {
    columns: [
      { ...ipServicesColumns[0], width: 'min-w-0 w-1/2' },
      { ...ipServicesColumns[1], width: 'min-w-0 w-1/2', align: 'right' as const },
    ],
    data: ipServicesData,
    rules: 'horizontal',
    className: 'min-w-full max-w-[1280px] bg-white',
  },
};

const acronymsData = [
  {
    acronym: 'WIPO',
    englishName: 'World Intellectual Property Organization',
    arabicName: 'المنظمة العالمية للملكية الفكرية',
  },
  {
    acronym: 'WCT',
    englishName: 'World Copyright Treaty',
    arabicName: 'المعاهدة العالمية لحقوق المؤلف',
  },
];

const acronymsColumns = [
  {
    key: 'acronym' as const,
    header: 'Acronym',
    align: 'left' as const,
  },
  {
    key: 'englishName' as const,
    header: 'English Name',
    align: 'left' as const,
  },
  {
    key: 'arabicName' as const,
    header: 'Arabic Name',
    align: 'right' as const,
  },
];

export const AcronymsExample: Story = {
  args: {
    columns: acronymsColumns,
    data: acronymsData,
  },
};

const glossaryData = [
  {
    english: 'Patent',
    arabic: 'براءة اختراع',
    description: 'A legal document granting exclusive rights to an invention',
  },
  {
    english: 'Trademark',
    arabic: 'علامة تجارية',
    description: 'A symbol, word, or phrase used to identify a company',
  },
];

const glossaryColumns = [
  {
    key: 'english' as const,
    header: 'English',
    align: 'left' as const,
  },
  {
    key: 'arabic' as const,
    header: 'Arabic',
    align: 'right' as const,
  },
  {
    key: 'description' as const,
    header: 'Description',
    align: 'left' as const,
  },
];

export const GlossaryExample: Story = {
  args: {
    columns: glossaryColumns,
    data: glossaryData,
  },
};
