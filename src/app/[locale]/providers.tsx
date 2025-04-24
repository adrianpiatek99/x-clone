'use client';

import type { FC, ReactNode } from 'react';
import React, { useEffect, useRef } from 'react';

import type { Locale } from '@/constants/locales';
import { themes } from '@/constants/themes';
import { usePathname } from '@/i18n/routing';
import { useGlobalStore } from '@/stores/global';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AbstractIntlMessages } from 'next-intl';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';
import { useShallow } from 'zustand/shallow';

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
  const pathname = usePathname();
  const { update } = useGlobalStore(useShallow((state) => ({ update: state.update })));
  const currentPathnameRef = useRef(pathname);

  useEffect(() => {
    if (currentPathnameRef.current !== pathname) {
      update({ previousPathname: currentPathnameRef.current });
      currentPathnameRef.current = pathname;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem themes={themes}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <QueryClientProvider client={queryClient}>
          <div className='animate-initAppear'>{children}</div>
          <Modals />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
};

export default Providers;
