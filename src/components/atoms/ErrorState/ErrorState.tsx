import Box from '@/components/atoms/Box';
import Button from '@/components/atoms/Button';
import Typography from '@/components/atoms/Typography';
import { useRandomEmoji } from '@/hooks/useRandomEmoji';
import { RefreshIcon } from '@/icons';
import { useTranslations } from 'next-intl';

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
          startIcon={<RefreshIcon />}
        >
          {t('actions.retry')}
        </Button>
      )}
    </Box>
  );
};

export default ErrorState;
