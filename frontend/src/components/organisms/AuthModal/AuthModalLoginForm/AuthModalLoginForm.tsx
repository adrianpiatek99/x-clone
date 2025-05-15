import React from 'react';

import Box from '@/components/atoms/Box';
import Typography from '@/components/atoms/Typography';
import { VALIDATION } from '@/constants/validation';
import { useAuthStore } from '@/stores/auth';
import { useTranslations } from 'next-intl';

import { useAuthModalLoginForm } from './useAuthModalLoginForm';

const AuthModalLoginForm = () => {
  const t = useTranslations();
  const update = useAuthStore((state) => state.update);
  const { AppField, AppForm, SubscribeButton, handleSubmit, isPending } = useAuthModalLoginForm();

  const handleChangeTab = () => update({ currentTab: 'register' });

  return (
    <>
      <Box className='mb-[15px]'>
        <Typography as='h1' size='3xl' weight='bold'>
          {t('auth.loginTo')}
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
          <AppField name='emailOrScreenName'>
            {(field) => (
              <field.InputField
                label={t('emailOrScreenName')}
                maxLength={VALIDATION.ACCOUNT.EMAIL.MAX}
                isLoading={isPending}
              />
            )}
          </AppField>
          <AppField name='password'>
            {(field) => (
              <field.InputField
                type='password'
                label={t('password')}
                maxLength={VALIDATION.ACCOUNT.PASSWORD.MAX}
                isLoading={isPending}
              />
            )}
          </AppField>
          <AppForm>
            <SubscribeButton className='rounded-full' isLoading={isPending} size='large'>
              {t('auth.login')}
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
            {t('auth.register')}
          </Typography>
        </Typography>
      </Box>
    </>
  );
};

export default AuthModalLoginForm;
