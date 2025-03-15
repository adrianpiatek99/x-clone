import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import { Box, Button, ControlledInput, Typography } from '@/components/atoms';
import { useSignInMutation } from '@/hooks/api/auth/useSignInMutation';
import { useSignUpMutation } from '@/hooks/api/auth/useSignUpMutation';
import type { SignUpValues } from '@/schemas';
import { signUpSchema } from '@/schemas';
import { useAuthStore } from '@/stores/auth';
import { zodResolver } from '@hookform/resolvers/zod';
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
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isValid },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema(t as Translation)),
    mode: 'onChange',
  });
  const { signIn, isPending: isSignInPending } = useSignInMutation({
    onSuccess: () => {
      reset();
      resetStore();
    },
  });
  const { signUpMutate, isPending: isSignUpPending } = useSignUpMutation({
    onSuccess: () => {
      const { email, password } = getValues();

      signIn({ emailOrScreenName: email, password });
    },
  });
  const isPending = isSignInPending || isSignUpPending;

  const onSubmit: SubmitHandler<SignUpValues> = (data) => signUpMutate(data);

  const handleChangeTab = () => update({ currentTab: 'signIn' });

  return (
    <>
      <Box className='mb-[15px]'>
        <Typography as='h1' size='3xl' weight='bold'>
          {t('auth.createAccount')}
        </Typography>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className='gap-4'>
          {signUpInputs(t as Translation).map(({ name, ...props }) => (
            <ControlledInput
              key={name}
              control={control}
              name={name}
              error={errors[name]?.message}
              isLoading={isPending}
              {...props}
            />
          ))}
          <Button
            className='rounded-full'
            type='submit'
            isLoading={isPending}
            size='large'
            disabled={!isValid}
          >
            {t('auth.signUp')}
          </Button>
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
