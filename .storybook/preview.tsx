import '../src/app/globals.css';

import React from 'react';

import type { Preview } from '@storybook/react';
import { Inter } from 'next/font/google';

import enMessages from '../messages/en.json';
import Providers from '../src/app/providers';
import { Locale } from '../src/constants/locales';
import ThemeSwitcherDecorator from './decorators/ThemeSwitcherDecorator';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className={inter.variable}>
        <style>{`
          div {
            font-family: -apple-system, BlinkMacSystemFont, var(--font-inter), Helvetica, Arial,
              sans-serif;
          }
        `}</style>
        <Providers locale={Locale.EN} messages={enMessages}>
          <ThemeSwitcherDecorator />
          {Story()}
          <div id='modal' />
        </Providers>
      </div>
    ),
  ],
};

export default preview;
