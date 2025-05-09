import { API_ENDPOINTS } from '@/constants/api';
import { apiRequest } from '@/db/utils/api';
import { useToasts } from '@/hooks/useToasts';
import type { SignUpValues } from '@/schema/auth';
import type { RegisterRequest } from '@/types/auth';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

type Props = {
  onSuccess?: () => void;
  onSettled?: () => void;
};

export const useRegisterMutation = ({ onSuccess, onSettled }: Props = {}) => {
  const t = useTranslations();
  const { addToast } = useToasts();
  const { mutate, isPending } = useMutation<void, ApiAxiosError, RegisterRequest>({
    mutationFn: (data) => apiRequest('post', API_ENDPOINTS.AUTH.REGISTER, data),
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

  const register = (data: SignUpValues) => {
    if (isPending) return;

    mutate(data);
  };

  return { register, isPending };
};
