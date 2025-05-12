import { useLoginMutation } from '@/hooks/api/auth/mutations';
import { useAppForm } from '@/hooks/useFormHook';
import type { LoginValues } from '@/schema/auth';
import { loginSchema } from '@/schema/auth';
import { useAuthStore } from '@/stores/auth';
import { useTranslations } from 'next-intl';

export const useAuthModalLoginForm = () => {
  const t = useTranslations();
  const resetStore = useAuthStore((state) => state.resetStore);

  const { AppField, AppForm, SubscribeButton, handleSubmit, reset } = useAppForm({
    defaultValues: {
      emailOrScreenName: '',
      password: '',
    } satisfies LoginValues,
    validators: { onChange: loginSchema(t) },
    onSubmit: ({ value }) => {
      if (isPending) return;

      login(value);
    },
  });

  const { login, isPending } = useLoginMutation({
    onSuccess: () => {
      reset();
      resetStore();
    },
  });

  return { AppField, AppForm, SubscribeButton, handleSubmit, isPending };
};
