import { useLoginMutation, useRegisterMutation } from '@/hooks/api/auth/mutations';
import { useAppForm } from '@/hooks/useFormHook';
import type { RegisterValues } from '@/schema/auth';
import { registerSchema } from '@/schema/auth';
import { useAuthStore } from '@/stores/auth';
import { useTranslations } from 'next-intl';

export const useAuthModalRegisterForm = () => {
  const t = useTranslations();
  const resetStore = useAuthStore((state) => state.resetStore);

  const { AppField, AppForm, SubscribeButton, handleSubmit, getFieldValue, reset } = useAppForm({
    defaultValues: {
      screenName: '',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    } satisfies RegisterValues,
    validators: { onChange: registerSchema(t) },
    onSubmit: ({ value }) => {
      if (isPending) return;

      register(value);
    },
  });

  const { login, isPending: isLoginPending } = useLoginMutation({
    onSuccess: () => {
      reset();
      resetStore();
    },
  });
  const { register, isPending: isRegisterPending } = useRegisterMutation({
    onSuccess: () => {
      const email = getFieldValue('email');
      const password = getFieldValue('password');

      login({ emailOrScreenName: email, password });
    },
  });
  const isPending = isLoginPending || isRegisterPending;

  return { AppField, AppForm, SubscribeButton, handleSubmit, isPending };
};
