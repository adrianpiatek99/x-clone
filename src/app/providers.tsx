import type { FC, ReactNode } from 'react';
import React from 'react';

import { themes } from '@/constants/themes';
import { ThemeProvider } from 'next-themes';

type Props = {
  children: ReactNode;
};

const Providers: FC<Props> = ({ children }) => {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem themes={themes}>
      {children}
    </ThemeProvider>
  );
};

export default Providers;
