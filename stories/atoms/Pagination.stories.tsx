import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import Pagination from '@/components/atoms/Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Atoms/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    a11y: {
      disable: false,
      config: {
        rules: [
          {
            id: 'button-name',
            enabled: true,
          },
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'focus-order-semantics',
            enabled: true,
          },
        ],
      },
    },
  },
  argTypes: {
    currentPage: {
      control: 'number',
      description: 'Currently active page number (1-based)',
    },
    totalPages: {
      control: 'number',
      description: 'Total number of pages available',
    },
    onPageChange: {
      action: 'pageChanged',
      description: 'Callback function called when user changes page',
    },
    siblingCount: {
      control: 'number',
      description: 'Number of page buttons to show on each side of current page',
    },
    showFirstLast: {
      control: 'boolean',
      description: 'Whether to show first and last page navigation buttons',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the entire pagination component is disabled',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for styling the pagination container',
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for the pagination navigation for screen readers',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Pagination>;

interface PaginationStoryProps {
  totalPages: number;
  siblingCount?: number;
  showFirstLast?: boolean;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

const PaginationStory = ({
  totalPages,
  siblingCount,
  showFirstLast,
  disabled,
  className,
  ariaLabel,
}: PaginationStoryProps) => {
  const [page, setPage] = useState(1);
  return (
    <Pagination
      currentPage={page}
      totalPages={totalPages}
      onPageChange={setPage}
      siblingCount={siblingCount}
      showFirstLast={showFirstLast}
      disabled={disabled}
      className={className}
      ariaLabel={ariaLabel}
    />
  );
};

export const Default: Story = {
  render: (args) => <PaginationStory {...args} />,
  args: {
    totalPages: 10,
  },
};

export const WithSiblingCount: Story = {
  render: (args) => <PaginationStory {...args} />,
  args: {
    totalPages: 20,
    siblingCount: 2,
  },
};

export const WithFirstLastButtons: Story = {
  render: (args) => <PaginationStory {...args} />,
  args: {
    totalPages: 15,
    showFirstLast: true,
  },
};

export const Disabled: Story = {
  render: (args) => <PaginationStory {...args} />,
  args: {
    totalPages: 5,
    disabled: true,
  },
};

export const ManyPages: Story = {
  render: (args) => <PaginationStory {...args} />,
  args: {
    totalPages: 50,
    siblingCount: 1,
    showFirstLast: true,
  },
};

export const FewPages: Story = {
  render: (args) => <PaginationStory {...args} />,
  args: {
    totalPages: 3,
    siblingCount: 1,
  },
};

export const WithCustomAriaLabel: Story = {
  render: (args) => <PaginationStory {...args} />,
  args: {
    totalPages: 10,
    ariaLabel: 'Blog posts pagination',
  },
};
