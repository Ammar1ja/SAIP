import defaultTheme from 'tailwindcss/defaultTheme';
import scrollbar from 'tailwind-scrollbar';

import { spacing } from './styles/tokens/spacing';
import { width, maxWidth } from './styles/tokens/width';
import { padding } from './styles/tokens/padding';
import { colors } from './styles/tokens/colors';
import { fontSize } from './styles/tokens/typography';
import { borderRadius } from './styles/tokens/radius';
import { letterSpacing } from './styles/tokens/letterSpacing';

const config = {
  darkMode: ['class', '[class~="high-contrast"]'],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      spacing,
      borderRadius,
      maxWidth,
      width,
      padding,
      colors: {
        ...colors,
        // Override Tailwind's default green with our brand colors (success palette)
        green: {
          50: colors.success[50],
          100: colors.success[100],
          200: colors.success[200],
          300: colors.success[300],
          400: colors.success[400],
          500: colors.success[500],
          600: colors.success[600],
          700: colors.success[700],
          800: colors.success[800],
          900: colors.success[900],
          950: colors.success[950],
        },
        'background-default': 'var(--background-default)',
        'text-default': 'var(--text-default)',
        text: {
          default: '#161616',
          natural: '#1F2A37',
          'primary-paragraph': '#384250',
          'secondary-paragraph': '#6C737F',
        },
        neutral: {
          50: '#F9FAFB',
          light: '#F9FAFB',
          secondary: '#E5E7EB',
        },
        border: {
          natural: {
            primary: '#D2D6DB',
            secondary: '#E5E7EB',
          },
        },
        icon: {
          default: {
            400: '#9DA4AE',
            500: '#161616',
          },
        },
        button: {
          background: {
            primary: {
              default: '#1B8354', // Primary button color requested by designers (primary-600)
              hover: '#166A45', // Darker shade for hover (primary-700)
            },
            secondary: {
              default: '#1B8354', // Secondary/Accent color from Figma (primary-600)
              hover: '#166A45', // Darker shade for hover (primary-700)
            },
            natural: {
              default: '#F3F4F6',
              hover: '#E5E7EB',
            },
            disabled: '#E5E7EB',
          },
        },
      },
      fontSize,
      letterSpacing,
      fontFamily: {
        body: ['IBM Plex Sans Arabic', ...defaultTheme.fontFamily.sans],
        sans: ['IBM Plex Sans Arabic', ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(45deg, #074D31 0%, #1B8354 100%)', // Primary to Secondary gradient
      },
      boxShadow: {
        card: '0px 4px 8px -2px rgba(16, 24, 40, 0.10), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)',
      },
      minHeight: {
        ...defaultTheme.height,
      },
      minWidth: {
        ...defaultTheme.width,
      },
    },
  },
  plugins: [scrollbar({ nocompatible: true })],
  future: {
    hoverOnlyWhenSupported: true,
  },
};

export default config;
