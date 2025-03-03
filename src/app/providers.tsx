'use client';

import type { FC, ReactNode } from 'react';
import React from 'react';
import { Toaster } from 'react-hot-toast';

import type { Locale } from '@/constants/locales';
import { themes } from '@/constants/themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AbstractIntlMessages } from 'next-intl';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';

const queryClient = new QueryClient();

type Props = {
  children: ReactNode;
  locale: Locale;
  messages: AbstractIntlMessages;
};

const Providers: FC<Props> = ({ children, locale, messages }) => {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem themes={themes}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        <Toaster position='bottom-center' />
      </NextIntlClientProvider>
    </ThemeProvider>
  );
};

export default Providers;
