import React from 'react';

import Box from '@/components/atoms/Box';
import Icon from '@/components/atoms/Icon';
import Typography from '@/components/atoms/Typography';
import { VERTICAL_BAR } from '@/constants/strings';

const GITHUB_LINK = 'https://github.com/adrianpiatek99';
const LINKEDIN_LINK = 'https://www.linkedin.com/in/adrian-pi%C4%85tek-942204209';

const Footer = () => {
  return (
    <div>
      <Box className='flex-row flex-wrap items-center gap-2'>
        <Typography
          className='flex flex-row gap-1'
          title={GITHUB_LINK}
          size='xs'
          color='secondary'
          href={GITHUB_LINK}
          linkProps={{
            target: '_blank',
            rel: 'noopener noreferrer',
          }}
        >
          <Icon name='GithubIcon' className='size-4' />
          GitHub
        </Typography>
        <Typography className='mt-[-5px] font-extralight' size='l' color='secondary'>
          {VERTICAL_BAR}
        </Typography>
        <Typography
          className='flex flex-row gap-1'
          title={LINKEDIN_LINK}
          size='xs'
          color='secondary'
          href={LINKEDIN_LINK}
          linkProps={{
            target: '_blank',
            rel: 'noopener noreferrer',
          }}
        >
          <Icon name='LinkedinIcon' className='size-4' />
          LinkedIn
        </Typography>
      </Box>
    </div>
  );
};

export default Footer;
