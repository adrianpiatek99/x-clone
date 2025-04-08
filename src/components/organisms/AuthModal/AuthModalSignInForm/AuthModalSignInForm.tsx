import React from 'react';

import { Box } from '@/components/atoms/Box';
import { Typography } from '@/components/atoms/Typography';
import { useAuthStore } from '@/stores/auth';
import { useTranslations } from 'next-intl';

import { signInInputs } from './config';
import { useAuthModalSignInForm } from './useAuthModalSignInForm';

const AuthModalSignInForm = () => {
  const t = useTranslations();
  const update = useAuthStore((state) => state.update);
  const { AppField, AppForm, SubscribeButton, handleSubmit, isPending } = useAuthModalSignInForm();

  const handleChangeTab = () => update({ currentTab: 'signUp' });

  return (
    <>
      <Box className='mb-[15px]'>
        <Typography as='h1' size='3xl' weight='bold'>
          {t('auth.signInTo')}
        </Typography>
      </Box>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSubmit();
        }}
      >
        <Box className='gap-4'>
          {signInInputs(t).map(({ name, ...props }) => (
            <AppField key={name} name={name}>
              {(field) => <field.InputField isLoading={isPending} {...props} />}
            </AppField>
          ))}
          <AppForm>
            <SubscribeButton className='rounded-full' isLoading={isPending} size='large'>
              {t('auth.signIn')}
            </SubscribeButton>
          </AppForm>
        </Box>
      </form>
      <Box className='mt-[30px]'>
        <Typography color='secondary'>
          {t('auth.dontHaveAccount')}{' '}
          <Typography
            tabIndex={0}
            color='link'
            className='cursor-pointer outline-none  hover:underline focus-visible:underline'
            onClick={handleChangeTab}
            onKeyDown={(e) => e.key === 'Enter' && handleChangeTab()}
          >
            {t('auth.signUp')}
          </Typography>
        </Typography>
      </Box>
    </>
  );
};

export default AuthModalSignInForm;
