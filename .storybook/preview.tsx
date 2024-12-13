import '../src/app/globals.css';
import React from 'react';

import type { Preview } from '@storybook/react';
import Providers from '../src/app/providers';
import { Locale } from '../src/constants/locales';
import enMessages from '../messages/en.json';
import { Inter } from 'next/font/google';

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
          {Story()}
          <div id='modal' />
        </Providers>
      </div>
    ),
  ],
};

export default preview;
