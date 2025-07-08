import React from 'react';
import type { Preview } from '@storybook/react';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1a1a1a',
        },
        {
          name: 'neutral',
          value: '#f5f5f5',
        },
      ],
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'button-name',
            enabled: true,
          },
        ],
      },
    },
    themes: {
      default: 'light',
      list: [
        { name: 'light', class: 'light', color: '#ffffff' },
        { name: 'dark', class: 'dark', color: '#1a1a1a' },
      ],
    },
  },
  globalTypes: {
    direction: {
      description: 'Text direction',
      defaultValue: 'rtl',
      toolbar: {
        icon: 'globe',
        items: ['ltr', 'rtl'],
        title: 'Direction',
      },
    },
  },
  decorators: [
    (Story, context) => {
      const direction = context.globals.direction;
      return (
        <div
          dir={direction}
          className={`${direction === 'rtl' ? 'font-arabic' : 'font-sans'}`}
        >
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
