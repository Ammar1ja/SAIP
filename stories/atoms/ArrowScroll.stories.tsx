// ArrowScroll.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs';
import ArrowScroll from '@/components/molecules/ArrowScroll';

const meta: Meta<typeof ArrowScroll> = {
  title: 'Atoms/ArrowScroll',
  component: ArrowScroll,
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
        ],
      },
    },
  },
  argTypes: {
    onScrollLeft: {
      action: 'scrollLeft',
      description: 'Callback function triggered when left arrow is clicked',
    },
    onScrollRight: {
      action: 'scrollRight',
      description: 'Callback function triggered when right arrow is clicked',
    },
    disabledLeft: {
      control: 'boolean',
      description: 'Whether the left arrow button is disabled',
    },
    disabledRight: {
      control: 'boolean',
      description: 'Whether the right arrow button is disabled',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for styling the component',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ArrowScroll>;

export const Default: Story = {
  args: {
    onScrollLeft: () => {
      console.log('Scroll Left');
    },
    onScrollRight: () => {
      console.log('Scroll Right');
    },
  },
};

export const WithDisabledLeft: Story = {
  args: {
    onScrollLeft: () => {
      console.log('Scroll Left - disabled');
    },
    onScrollRight: () => {
      console.log('Scroll Right');
    },
    disabledLeft: true,
  },
};

export const WithDisabledRight: Story = {
  args: {
    onScrollLeft: () => {
      console.log('Scroll Left');
    },
    onScrollRight: () => {
      console.log('Scroll Right - disabled');
    },
    disabledRight: true,
  },
};

export const BothDisabled: Story = {
  args: {
    onScrollLeft: () => {
      console.log('Scroll Left - disabled');
    },
    onScrollRight: () => {
      console.log('Scroll Right - disabled');
    },
    disabledLeft: true,
    disabledRight: true,
  },
};

export const WithCustomAriaLabel: Story = {
  args: {
    onScrollLeft: () => {
      console.log('Scroll Left');
    },
    onScrollRight: () => {
      console.log('Scroll Right');
    },
  },
};
