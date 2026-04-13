import type { Meta, StoryObj } from '@storybook/nextjs';
import Grid from '@/components/atoms/Grid';
import type { ReactNode } from 'react';

interface BoxProps {
  children: ReactNode;
}

const Box = ({ children }: BoxProps) => (
  <div className="bg-blue-100 p-4 rounded-lg border border-gray-200 text-center font-medium">
    {children}
  </div>
);

const meta: Meta<typeof Grid> = {
  title: 'Atoms/Grid',
  component: Grid,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: {
      disable: false,
      config: {
        rules: [
          {
            id: 'landmark-one-main',
            enabled: false,
          },
        ],
      },
    },
  },
  argTypes: {
    gap: {
      control: 'select',
      options: ['gap-0', 'gap-2', 'gap-4', 'gap-6', 'gap-8', 'gap-12'],
      description: 'Tailwind CSS gap class for spacing between grid items',
    },
    cols: {
      control: 'object',
      description:
        'Responsive column configuration object with breakpoint keys (base, sm, md, lg, xl)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for styling the grid container',
    },
    children: {
      control: false,
      description: 'React children elements to be displayed in the grid',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Grid>;

const ExampleBoxes = () => (
  <>
    {Array.from({ length: 6 }, (_, index) => (
      <Box key={`item-${index + 1}`}>Item {index + 1}</Box>
    ))}
  </>
);

export const Default: Story = {
  args: {
    gap: 'gap-6',
    cols: { base: 1, md: 2, lg: 3 },
    children: <ExampleBoxes />,
  },
};

export const SingleColumn: Story = {
  args: {
    gap: 'gap-4',
    cols: { base: 1, md: 1 },
    children: <ExampleBoxes />,
  },
};

export const TwoColumns: Story = {
  args: {
    gap: 'gap-6',
    cols: { base: 1, md: 2 },
    children: <ExampleBoxes />,
  },
};

export const FourColumns: Story = {
  args: {
    gap: 'gap-4',
    cols: { base: 2, md: 3, lg: 4 },
    children: <ExampleBoxes />,
  },
};

export const SmallGap: Story = {
  args: {
    gap: 'gap-2',
    cols: { base: 1, md: 2, lg: 3 },
    children: <ExampleBoxes />,
  },
};

export const LargeGap: Story = {
  args: {
    gap: 'gap-12',
    cols: { base: 1, md: 2, lg: 3 },
    children: <ExampleBoxes />,
  },
};

export const NoGap: Story = {
  args: {
    gap: 'gap-0',
    cols: { base: 1, md: 2, lg: 3 },
    children: <ExampleBoxes />,
  },
};

export const ResponsiveExample: Story = {
  args: {
    gap: 'gap-4',
    cols: { base: 1, sm: 2, md: 3, lg: 4, xl: 6 },
    children: <ExampleBoxes />,
  },
};
