import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

const myTheme = create({
  base: 'dark',
  brandTitle: 'FluentText Editor',
  brandImage: '/logo.png',
  brandTarget: '_self',
  colorPrimary: '#2596be',
});

addons.setConfig({
  theme: myTheme,
});
