import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import { Box, Button, ControlledInput, Typography } from '@/components/atoms';
import { useSignInMutation } from '@/hooks/api/auth/useSignInMutation';
import type { SignInValues } from '@/schemas';
import { signInSchema } from '@/schemas';
import { useAuthStore } from '@/stores/auth';
import { zodResolver } from '@hookform/resolvers/zod';
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
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema(t as Translation)),
    mode: 'onChange',
  });
  const { signIn, isPending } = useSignInMutation({
    onSuccess: () => {
      reset();
      resetStore();
    },
  });

  const onSubmit: SubmitHandler<SignInValues> = (data) => signIn(data);

  const handleChangeTab = () => update({ currentTab: 'signUp' });

  return (
    <>
      <Box className='mb-[15px]'>
        <Typography as='h1' size='3xl' weight='bold'>
          {t('auth.signInTo')}
        </Typography>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className='gap-4'>
          {signInInputs(t as Translation).map(({ name, ...props }) => (
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
            {t('auth.signIn')}
          </Button>
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
