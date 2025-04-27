import '../src/app/globals.css';

import React from 'react';

import Providers from '@/app/[locale]/providers';
import type { Preview } from '@storybook/react';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider } from 'next-intl';

import enMessages from '../messages/en.json';
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
        <SessionProvider>
          <NextIntlClientProvider locale={Locale.EN} messages={enMessages}>
            <Providers locale={Locale.EN} messages={enMessages}>
              <ThemeSwitcherDecorator />
              {Story()}
            </Providers>
          </NextIntlClientProvider>
        </SessionProvider>
      </div>
    ),
  ],
};

export default preview;
