import { useState } from 'react';

import { useToasts } from '@/hooks/useToasts';
import { signIn as nextSignIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { SignInValues } from '@/schema/auth';

type Props = {
  onSuccess?: () => void;
  onError?: (error: string) => void;
};

export const useSignInMutation = ({ onSuccess, onError }: Props = {}) => {
  const t = useTranslations();
  const { addToast } = useToasts();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorMessage = t('errors.auth.signIn');

  const signIn = async ({ emailOrScreenName, password }: SignInValues) => {
    try {
      setIsPending(true);
      setError(null);

      const response = await nextSignIn('credentials', {
        emailOrScreenName,
        password,
        redirect: false,
      });

      const error = response?.error;

      if (error) throw Error(error);

      onSuccess?.();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      onError?.(errorMessage);
      addToast('error', errorMessage);
      setError(errorMessage);
    } finally {
      setIsPending(false);
    }
  };

  return { signIn, isPending, error };
};
