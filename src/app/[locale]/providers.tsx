'use client';

import type { FC, ReactNode } from 'react';
import React from 'react';

import type { Locale } from '@/constants/locales';
import { themes } from '@/constants/themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import type { AbstractIntlMessages } from 'next-intl';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';

import LoadingScreen from './loadingScreen';
import Modals from './modals';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

type Props = {
  children: ReactNode;
  locale: Locale;
  messages: AbstractIntlMessages;
};

const Providers: FC<Props> = ({ children, locale, messages }) => {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem themes={themes}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <LoadingScreen>
              <div className='animate-initAppear'>{children}</div>
              <Modals />
            </LoadingScreen>
          </SessionProvider>
        </QueryClientProvider>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
};

export default Providers;
