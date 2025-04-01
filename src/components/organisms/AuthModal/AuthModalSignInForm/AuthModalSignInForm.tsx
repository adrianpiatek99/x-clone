import React from 'react';

import { Box, Typography } from '@/components/atoms';
import { useSignInMutation } from '@/hooks/api/auth/useSignInMutation';
import { useAppForm } from '@/hooks/useFormHook';
import type { SignInValues } from '@/schema';
import { signInSchema } from '@/schema';
import { useAuthStore } from '@/stores/auth';
import { useTranslations } from 'next-intl';
import { useShallow } from 'zustand/shallow';

import { signInInputs } from './config';

const AuthModalSignInForm = () => {
  const t = useTranslations();
  const { update, resetStore } = useAuthStore(
    useShallow((state) => ({
      update: state.update,
      resetStore: state.resetStore,
    }))
  );
  const { signIn, isPending } = useSignInMutation({
    onSuccess: () => {
      reset();
      resetStore();
    },
  });
  const { AppField, AppForm, SubscribeButton, handleSubmit, reset } = useAppForm({
    defaultValues: {
      emailOrScreenName: '',
      password: '',
    } satisfies SignInValues,
    validators: { onChange: signInSchema(t) },
    onSubmit: ({ value }) => {
      if (isPending) return;

      signIn(value);
    },
  });

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
