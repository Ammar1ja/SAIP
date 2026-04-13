import type { Meta, StoryObj } from '@storybook/nextjs';
import LanguageSwitcher from '@/components/molecules/LanguageSwitcher';

const meta: Meta<typeof LanguageSwitcher> = {
  title: 'Molecules/LanguageSwitcher',
  component: LanguageSwitcher,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
      nagiation: {
        pathname: '/',
      },
    },
  },
  argTypes: {
    locale: {
      control: {
        type: 'select',
        options: ['en', 'ar'],
      },
    },
  },
  args: {
    locale: 'en',
  },
};

export default meta;
type Story = StoryObj<typeof LanguageSwitcher>;

const longLocales = {
  en: 'English',
  ar: 'العربية',
  tr: 'Türkçe',
  pl: 'Polski',
  it: 'Italiano',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  ru: 'Русский',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
  pt: 'Português',
  nl: 'Nederlands',
  sv: 'Svenska',
  no: 'Norsk',
  da: 'Dansk',
  fi: 'Suomi',
};

export const Default: Story = {};

export const RTL: Story = {
  args: {
    locale: 'ar',
  },
  parameters: {
    direction: 'rtl',
    nextjs: {
      router: {
        path: '/',
        asPath: '/',
        locale: 'ar',
      },
    },
  },
};

export const Mobile: Story = {
  args: {
    locale: 'en',
  },
  globals: {
    viewport: {
      value: 'mobile1',
    },
  },
};

export const MobileRTL: Story = {
  args: {
    locale: 'ar',
  },
  parameters: {
    direction: 'rtl',
    nextjs: {
      router: {
        path: '/',
        asPath: '/',
        locale: 'ar',
      },
    },
  },
  globals: {
    viewport: {
      value: 'mobile1',
    },
  },
};

export const LongList: Story = {
  args: {
    locale: 'en',
    locales: longLocales,
  },
};

export const LongListMobile: Story = {
  args: {
    locale: 'en',
    locales: longLocales,
  },
  globals: {
    viewport: {
      value: 'mobile1',
    },
  },
};
