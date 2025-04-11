import { useSignInMutation } from '@/hooks/api/auth/useSignInMutation';
import { useSignUpMutation } from '@/hooks/api/auth/useSignUpMutation';
import { useAppForm } from '@/hooks/useFormHook';
import type { SignUpValues } from '@/schema/auth';
import { signUpSchema } from '@/schema/auth';
import { useAuthStore } from '@/stores/auth';
import { useTranslations } from 'next-intl';

export const useAuthModalSignUpForm = () => {
  const t = useTranslations();
  const resetStore = useAuthStore((state) => state.resetStore);

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
  const isPending = isSignInPending || isSignUpPending;

  return { AppField, AppForm, SubscribeButton, handleSubmit, isPending };
};
