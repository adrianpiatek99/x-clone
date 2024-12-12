import type { FC, ReactNode } from 'react';
import React from 'react';

import { themes } from '@/constants/themes';
import type { AbstractIntlMessages } from 'next-intl';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';

type Props = {
  children: ReactNode;
  messages: AbstractIntlMessages;
};

const Providers: FC<Props> = ({ children, messages }) => {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem themes={themes}>
      <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
    </ThemeProvider>
  );
};

export default Providers;
