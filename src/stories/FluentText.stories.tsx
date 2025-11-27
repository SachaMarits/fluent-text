import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

import FluentText from '../FluentText';
import { fn } from 'storybook/test';
import { defaultValue } from './FlutentText.defaultvalue';
import { useArgs } from 'storybook/internal/preview-api';
import { FluentEditorFile } from '../types/File';
import templates from './FluentText.templates';

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

export const InputWithLinkOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Input field with only link options. <br /> <span style="font-size: 14px; opacity: 0.7;"> You can choose the text options you want to display, in this case only link is displayed. <br /> This is not exclusive for the input field, you can use it for the whole editor.</span>',
      },
    },
  },
  args: {
    input: true,
    height: 130,
    responsive: true,
    options: ['text'],
    textOptions: ['link'],
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

export const Attachments: Story = {
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
  render: args => {
    const [{ attachments }, updateArgs] = useArgs();

    const setAttachments = (newAttachments: React.SetStateAction<FluentEditorFile[]>) => {
      updateArgs({ attachments: newAttachments });
    };

    return <FluentText {...args} attachments={attachments} setAttachments={setAttachments} />;
  },
  parameters: {
    docs: {
      description: {
        story:
          "Attachments are displayed in the editor. <br /> <span style='font-size: 14px; opacity: 0.7;'> You can add attachments in the editor's toolbar and remove in the floating area located on the bottom left.</span>",
      },
    },
  },
};

export const Templates: Story = {
  args: {
    height: 500,
    templates,
    onContentChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'FluentText editor with templates.',
      },
    },
  },
};

export const Variables: Story = {
  args: {
    height: 500,
    templates,
    options: ['text'],
    onContentChange: fn(),
    variables: [
      {
        name: 'User last name',
        value: 'XXUSERLASTNAMEXX',
      },
      {
        name: 'User first name',
        value: 'XXUSERFIRSTNAMEXX',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Provide variables to the editor to display in the text. Then in your mailing system, you can replace the variables with the actual values.',
      },
    },
  },
};
