import { useState } from 'react';

import type { SignInValues } from '@/schemas';
import { signIn as nextSignIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';

type Props = {
  onSuccess?: () => void;
  onError?: (error: string) => void;
};

export const useSignInMutation = ({ onSuccess, onError }: Props = {}) => {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorMessage = t('errors.auth.signIn');

  const signIn = async ({ emailOrScreenName, password }: SignInValues) => {
    try {
      setIsLoading(true);
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
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { signIn, isLoading, error };
};
