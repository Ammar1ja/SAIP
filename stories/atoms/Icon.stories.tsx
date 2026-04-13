import type { Meta, StoryObj } from '@storybook/nextjs';
import Icon from '@/components/atoms/Icon';
import {
  AimIcon,
  BrainIcon,
  ChartsIcon,
  CourtIcon,
  InternetIcon,
  LightBulbIcon,
  MegaphoneIcon,
} from '@/components/icons';

const meta: Meta<typeof Icon> = {
  title: 'Atoms/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
    a11y: {
      disable: false,
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'image-alt',
            enabled: true,
          },
        ],
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    component: {
      control: false,
      description: 'React component to render as the icon - imported from icons library',
    },
    alt: {
      control: 'text',
      description: 'Alternative text for accessibility - describes what the icon represents',
    },
    background: {
      control: 'select',
      options: ['green', 'white', 'transparent'],
      description: 'Background style variant for the icon container',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size variant controlling the icon dimensions and padding',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for custom styling of the icon container',
    },
    role: {
      control: 'text',
      description: 'ARIA role attribute for semantic meaning',
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for screen readers when alt text needs enhancement',
    },
    ariaHidden: {
      control: 'boolean',
      description: 'Whether to hide icon from screen readers (for decorative icons)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Aim: Story = {
  args: {
    component: AimIcon,
    alt: 'Aim Icon - targeting and precision',
    background: 'green',
    size: 'small',
  },
};

export const Brain: Story = {
  args: {
    component: BrainIcon,
    alt: 'Brain Icon - intelligence and thinking',
    background: 'green',
    size: 'small',
  },
};

export const Charts: Story = {
  args: {
    component: ChartsIcon,
    alt: 'Charts Icon - data visualization and analytics',
    background: 'green',
    size: 'small',
  },
};

export const Court: Story = {
  args: {
    component: CourtIcon,
    alt: 'Court Icon - legal and judicial matters',
    background: 'green',
    size: 'small',
  },
};

export const Internet: Story = {
  args: {
    component: InternetIcon,
    alt: 'Internet Icon - global connectivity and web',
    background: 'green',
    size: 'small',
  },
};

export const LightBulb: Story = {
  args: {
    component: LightBulbIcon,
    alt: 'Light Bulb Icon - ideas and innovation',
    background: 'green',
    size: 'small',
  },
};

export const Megaphone: Story = {
  args: {
    component: MegaphoneIcon,
    alt: 'Megaphone Icon - announcements and communication',
    background: 'green',
    size: 'small',
  },
};

export const WhiteBackground: Story = {
  args: {
    component: BrainIcon,
    alt: 'Brain Icon with white background',
    background: 'white',
    size: 'medium',
  },
};

export const TransparentBackground: Story = {
  args: {
    component: LightBulbIcon,
    alt: 'Light Bulb Icon with transparent background',
    background: 'transparent',
    size: 'large',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Icon component={AimIcon} alt="Small aim icon" background="green" size="small" />
      <Icon component={AimIcon} alt="Medium aim icon" background="green" size="medium" />
      <Icon component={AimIcon} alt="Large aim icon" background="green" size="large" />
    </div>
  ),
};

export const AllBackgrounds: Story = {
  render: () => (
    <div className="flex items-center gap-4 p-4 bg-gray-100">
      <Icon
        component={ChartsIcon}
        alt="Charts icon with green background"
        background="green"
        size="medium"
      />
      <Icon
        component={ChartsIcon}
        alt="Charts icon with white background"
        background="white"
        size="medium"
      />
      <Icon
        component={ChartsIcon}
        alt="Charts icon with transparent background"
        background="transparent"
        size="medium"
      />
    </div>
  ),
};

export const DecorativeIcon: Story = {
  args: {
    component: MegaphoneIcon,
    alt: '',
    ariaHidden: true,
    background: 'green',
    size: 'medium',
  },
};
