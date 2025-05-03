import Box from '@/components/atoms/Box';
import Typography from '@/components/atoms/Typography';
import { useRandomEmoji } from '@/hooks/useRandomEmoji';
import { useTranslations } from 'next-intl';

type Props = {
  title: string;
  description?: string;
};

const Empty = ({ title }: Props) => {
  const t = useTranslations();
  const { randomEmptyStateEmoji } = useRandomEmoji();

  return (
    <Box className='items-center gap-5 p-5'>
      <Typography className='leading-[1.2] [font-size:50px]' center>
        {randomEmptyStateEmoji}
      </Typography>
      <Typography color='secondary' center>
        {title ?? t('noData')}
      </Typography>
    </Box>
  );
};

export default Empty;
