'use client';

import Box from '@/components/atoms/Box';
import Button from '@/components/atoms/Button';
import Typography from '@/components/atoms/Typography';
import { useRandomEmoji } from '@/hooks/useRandomEmoji';
import { useTranslations } from 'next-intl';

import Icon from '../Icon';

type Props = {
  onRetry?: () => void;
};

const ErrorState = ({ onRetry }: Props) => {
  const t = useTranslations();
  const { randomEmptyStateEmoji } = useRandomEmoji();

  return (
    <Box className='items-center gap-5 p-5'>
      <Typography className='leading-[1.2] [font-size:50px]' center>
        {randomEmptyStateEmoji}
      </Typography>
      <Typography color='secondary' center>
        {t('lostConnection')}
      </Typography>
      {onRetry && (
        <Button
          className='[&>svg]:size-5'
          onClick={onRetry}
          variant='tinted'
          startIcon={<Icon name='RefreshIcon' />}
        >
          {t('actions.retry')}
        </Button>
      )}
    </Box>
  );
};

export default ErrorState;
