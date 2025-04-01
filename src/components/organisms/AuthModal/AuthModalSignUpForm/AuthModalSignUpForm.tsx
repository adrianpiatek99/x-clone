import React from 'react';

import { Box, Typography } from '@/components/atoms';
import { useSignInMutation } from '@/hooks/api/auth/useSignInMutation';
import { useSignUpMutation } from '@/hooks/api/auth/useSignUpMutation';
import { useAppForm } from '@/hooks/useFormHook';
import type { SignUpValues } from '@/schema';
import { signUpSchema } from '@/schema';
import { useAuthStore } from '@/stores/auth';
import { useTranslations } from 'next-intl';
import { useShallow } from 'zustand/shallow';

import { signUpInputs } from './config';

const AuthModalSignUpForm = () => {
  const t = useTranslations();
  const { update, resetStore } = useAuthStore(
    useShallow((state) => ({
      update: state.update,
      resetStore: state.resetStore,
    }))
  );
  const { signIn, isPending: isSignInPending } = useSignInMutation({
    onSuccess: () => {
      reset();
      resetStore();
    },
  });
  const { signUpMutate, isPending: isSignUpPending } = useSignUpMutation({
    onSuccess: () => {
      const email = getFieldValue('email');
      const password = getFieldValue('password');

      signIn({ emailOrScreenName: email, password });
    },
  });
  const { AppField, AppForm, SubscribeButton, handleSubmit, getFieldValue, reset } = useAppForm({
    defaultValues: {
      screenName: '',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    } satisfies SignUpValues,
    validators: { onChange: signUpSchema(t) },
    onSubmit: ({ value }) => {
      if (isPending) return;

      signUpMutate(value);
    },
  });
  const isPending = isSignInPending || isSignUpPending;

  const handleChangeTab = () => update({ currentTab: 'signIn' });

  return (
    <>
      <Box className='mb-[15px]'>
        <Typography as='h1' size='3xl' weight='bold'>
          {t('auth.createAccount')}
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
          {signUpInputs(t).map(({ name, ...props }) => (
            <AppField key={name} name={name}>
              {(field) => <field.InputField isLoading={isPending} {...props} />}
            </AppField>
          ))}
          <AppForm>
            <SubscribeButton className='rounded-full' isLoading={isPending} size='large'>
              {t('auth.signUp')}
            </SubscribeButton>
          </AppForm>
        </Box>
      </form>
      <Box className='mt-[30px]'>
        <Typography color='secondary'>
          {t('auth.haveAccount')}{' '}
          <Typography
            tabIndex={0}
            color='link'
            className='cursor-pointer outline-none hover:underline focus-visible:underline'
            onClick={handleChangeTab}
            onKeyDown={(e) => e.key === 'Enter' && handleChangeTab()}
          >
            {t('auth.signIn')}
          </Typography>
        </Typography>
      </Box>
    </>
  );
};

export default AuthModalSignUpForm;
