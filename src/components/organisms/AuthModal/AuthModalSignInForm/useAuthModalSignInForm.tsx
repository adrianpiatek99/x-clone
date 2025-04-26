import { useSignInMutation } from '@/hooks/api/auth/mutations';
import { useAppForm } from '@/hooks/useFormHook';
import type { SignInValues } from '@/schema/auth';
import { signInSchema } from '@/schema/auth';
import { useAuthStore } from '@/stores/auth';
import { useTranslations } from 'next-intl';

export const useAuthModalSignInForm = () => {
  const t = useTranslations();
  const resetStore = useAuthStore((state) => state.resetStore);

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

  const { signIn, isPending } = useSignInMutation({
    onSuccess: () => {
      reset();
      resetStore();
    },
  });

  return { AppField, AppForm, SubscribeButton, handleSubmit, isPending };
};
