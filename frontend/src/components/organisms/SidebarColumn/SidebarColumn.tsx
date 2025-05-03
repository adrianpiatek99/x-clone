'use client';

import React from 'react';

import Box from '@/components/atoms/Box';
import Loader from '@/components/atoms/Loader';
import ScrollableSticky from '@/components/atoms/ScrollableSticky';
import { ROUTES } from '@/constants/routes';
import { usePathname } from '@/i18n/routing';
import dynamic from 'next/dynamic';

import Footer from '../Footer';

const LazyTrendingSection = dynamic(() => import('./TrendingSection'), {
  loading: () => (
    <Box className='grow rounded-xl border border-border-1 px-4 py-3'>
      <Loader center />
    </Box>
  ),
  ssr: false,
});

const SidebarColumn = () => {
  const pathname = usePathname();
  const showTrendingSection = !pathname.includes(ROUTES.EXPLORE);

  return (
    <ScrollableSticky className='hidden flex-1 lg:block' offsetBottom={80}>
      <Box className='grow'>
        {showTrendingSection && <LazyTrendingSection />}
        <Footer />
      </Box>
    </ScrollableSticky>
  );
};

export default SidebarColumn;
