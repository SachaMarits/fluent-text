import type { Meta, StoryObj } from '@storybook/react-vite';

import FluentText from '../FluentText';
import { fn } from 'storybook/test';
import { defaultValue } from './FlutentText.defaultvalue';

const meta = {
  title: 'FluentText',
  component: FluentText,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {},
} satisfies Meta<typeof FluentText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Basic view of the FluentText editor with all features enabled.',
      },
    },
  },
  args: {
    height: 500,
    onContentChange: fn(),
  },
};

export const DefaultValue: Story = {
  parameters: {
    docs: {
      description: {
        story: 'FluentText editor with a default value.',
      },
    },
  },
  args: {
    height: 500,
    defaultValue,
    onContentChange: fn(),
  },
};

export const HideTitlesAndGroupNames: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Editor with titles and group names hidden for a cleaner interface.',
      },
    },
  },
  args: {
    height: 200,
    hideTitles: true,
    hideGroupNames: true,
    onContentChange: fn(),
  },
};

export const InputWithTextOptionsOnly: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Minimum configuration for an input field with only text options, optimized for forms.',
      },
    },
  },
  args: {
    input: true,
    height: 130,
    responsive: true,
    options: ['text'],
    textWidth: '100%',
    emailFormat: false,
    hideGroupNames: true,
    onContentChange: fn(),
  },
};

export const VerticalLayout: Story = {
  args: {
    height: 800,
    vertical: true,
  },

  parameters: {
    docs: {
      description: {
        story: 'Vertical layout of the FluentText editor.',
      },
    },
  },
};

export const EnableAttachments: Story = {
  args: {
    height: 500,
    showAttachments: true,
    attachments: [
      {
        id: 1,
        name: 'attachment.pdf',
        url: 'https://www.example.com/attachment.pdf',
        size: 100,
      },
    ],
    setAttachments: () => fn(),
    onContentChange: fn(),
  },

  parameters: {
    docs: {
      description: {
        story: 'Enable attachments in the FluentText editor.',
      },
    },
  },
};
