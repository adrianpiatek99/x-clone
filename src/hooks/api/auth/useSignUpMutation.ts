import type { SignUpRequest } from '@/app/api/auth/signUp/route';
import { API_ENDPOINTS } from '@/db/apiEndpoints';
import { useToasts } from '@/hooks/useToasts';
import type { SignUpValues } from '@/schema';
import { apiRequest } from '@/utils/api';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

type Props = {
  onSuccess?: () => void;
  onSettled?: () => void;
};

export const useSignUpMutation = ({ onSuccess, onSettled }: Props = {}) => {
  const t = useTranslations();
  const { addToast } = useToasts();
  const { mutate, isPending } = useMutation<void, ApiAxiosError, SignUpRequest>({
    mutationFn: (data) => apiRequest('post', API_ENDPOINTS.AUTH.SIGN_UP, data),
    onSuccess: () => {
      onSuccess?.();
    },
    onError: () => {
      addToast('error', t('errors.auth.signUp'));
    },
    onSettled: () => {
      onSettled?.();
    },
  });

  const signUpMutate = (data: SignUpValues) => {
    if (isPending) return;

    mutate(data);
  };

  return { signUpMutate, isPending };
};
