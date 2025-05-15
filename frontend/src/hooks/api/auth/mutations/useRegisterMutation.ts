import { API_ENDPOINTS } from '@/constants/api';
import { useToasts } from '@/hooks/useToasts';
import type { RegisterRequest } from '@/types/auth';
import { apiRequest } from '@/utils/api';
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
      addToast('error', t('errors.auth.register'));
    },
    onSettled: () => {
      onSettled?.();
    },
  });

  const register = (data: RegisterRequest) => {
    if (isPending) return;

    mutate(data);
  };

  return { register, isPending };
};
