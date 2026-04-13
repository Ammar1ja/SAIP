import type { Preview } from '@storybook/nextjs';
import { IntlDecorator } from './decorators/intl';
import { DirectionDecorator } from './decorators/direction';
import '@storybook/addon-a11y';
import '../styles/globals.css';

const preview: Preview = {
  decorators: [IntlDecorator, DirectionDecorator],
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    direction: 'ltr',
    options: {
      storySort: {
        order: ['Atoms', 'Molecules', 'Organisms'],
      },
    },
    nextjs: {
      router: {
        path: '/',
        asPath: '/',
        locale: 'en',
      },
    },
    // Global a11y configuration
    a11y: {
      disable: false,
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'heading-order',
            enabled: true,
          },
          {
            id: 'image-alt',
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
        ],
      },
      options: {
        checks: { 'color-contrast': { options: { noScroll: true } } },
        restoreScroll: true,
      },
      manual: false,
    },
  },
};

export default preview;
