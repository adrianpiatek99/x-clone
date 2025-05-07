import { useAuth } from '@/components/context/AuthContext';
import { API_ENDPOINTS } from '@/constants/api';
import { apiRequest } from '@/db/utils/api';
import { useToasts } from '@/hooks/useToasts';
import type { LoginRequest, LoginResponse } from '@/types/auth';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

type Props = {
  onSuccess?: () => void;
  onError?: () => void;
  onSettled?: () => void;
};

export const useLoginMutation = ({ onSuccess, onError, onSettled }: Props = {}) => {
  const t = useTranslations();
  const { setUser } = useAuth();
  const { addToast } = useToasts();
  const { mutate, isPending } = useMutation<LoginResponse, ApiAxiosError, LoginRequest>({
    mutationFn: (data) => apiRequest('post', API_ENDPOINTS.AUTH.LOGIN, data),
    onSuccess: (data) => {
      setUser(data);

      onSuccess?.();
    },
    onError: () => {
      addToast('error', t('errors.auth.signIn'));
      onError?.();
    },
    onSettled: () => {
      onSettled?.();
    },
  });

  const login = (data: LoginRequest) => {
    if (isPending) return;

    mutate(data);
  };

  return { login, isPending };
};
