import type { Meta, StoryObj } from '@storybook/nextjs';
import Header from '@/components/organisms/Header';

const meta: Meta<typeof Header> = {
  title: 'Organisms/Header',
  component: Header,
  parameters: {
    a11y: {
      disable: false,
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'link-name',
            enabled: true,
          },
          {
            id: 'button-name',
            enabled: true,
          },
          {
            id: 'landmark-one-main',
            enabled: false,
          },
        ],
      },
    },
    nextjs: {
      router: {
        path: '/',
        asPath: '/',
        locale: 'en',
      },
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '812px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1280px',
            height: '800px',
          },
        },
      },
      defaultViewport: 'desktop',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Header>;

export const DesktopLTR: Story = {
  args: {
    locale: 'en',
  },
};

export const TabletLTR: Story = {
  args: {
    locale: 'en',
  },
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
};

export const MobileLTR: Story = {
  args: {
    locale: 'en',
  },
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
};

export const DesktopRTL: Story = {
  args: {
    locale: 'ar',
  },
  parameters: {
    nextjs: {
      router: {
        path: '/',
        asPath: '/',
        locale: 'ar',
      },
    },
    backgrounds: {
      default: 'white',
    },
    html: {
      dir: 'rtl',
    },
  },
};

export const MobileRTL: Story = {
  args: {
    locale: 'ar',
  },
  parameters: {
    viewport: { defaultViewport: 'mobile' },
    nextjs: {
      router: {
        path: '/',
        asPath: '/',
        locale: 'ar',
      },
    },
    html: {
      dir: 'rtl',
    },
  },
};
