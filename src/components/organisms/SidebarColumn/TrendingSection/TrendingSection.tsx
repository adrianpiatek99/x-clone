'use client';

import React from 'react';

import Box from '@/components/atoms/Box';
import Button from '@/components/atoms/Button';
import Typography from '@/components/atoms/Typography';
import ArticleCard from '@/components/molecules/ArticleCard';
import { ROUTES } from '@/constants/routes';
import { formatNumber } from '@/utils/formatNumber';
import { useTranslations } from 'next-intl';

const mockData = [
  {
    title: '#Debata',
    count: 44052,
  },
  {
    title: 'Test1',
    count: 2324,
  },
  {
    title: 'Test2',
    count: 123,
  },
  {
    title: 'Test3',
    count: 123,
  },
];

const TrendingSection = () => {
  const t = useTranslations();

  return (
    <Box as='section' className='grow rounded-xl border border-border-1'>
      <Typography className='px-4 pt-3' size='xl' weight='semibold'>
        {t('trending')}
      </Typography>
      <Box className='gap-0'>
        {mockData.map(({ count, title }) => (
          <ArticleCard key={title}>
            <Box className='relative flex-row items-start justify-between'>
              <Box className='gap-1'>
                <Typography className='break-all' weight='semibold'>
                  {title}
                </Typography>
                <Typography size='xs' color='secondary'>
                  {formatNumber(count)} posts
                </Typography>
              </Box>
            </Box>
          </ArticleCard>
        ))}
        <Button className='justify-start p-4' href={ROUTES.EXPLORE} variant='plain' fullWidth>
          {t('actions.showMore')}
        </Button>
      </Box>
    </Box>
  );
};

export default TrendingSection;
