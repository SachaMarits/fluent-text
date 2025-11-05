import type { Preview } from '@storybook/react-vite';
import React from 'react';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;