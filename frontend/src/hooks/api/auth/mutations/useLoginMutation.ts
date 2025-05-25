import { useAuth } from '@/components/context/AuthContext';
import { API_ENDPOINTS } from '@/constants/api';
import { useToasts } from '@/hooks/useToasts';
import type { LoginRequest, LoginResponse } from '@/types/auth';
import { apiRequest } from '@/utils/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

type Props = {
  onSuccess?: () => void;
  onError?: () => void;
  onSettled?: () => void;
};

export const useLoginMutation = ({ onSuccess, onError, onSettled }: Props = {}) => {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const { setUser } = useAuth();
  const { addToast } = useToasts();

  const { mutate, isPending } = useMutation<LoginResponse, ApiAxiosError, LoginRequest>({
    mutationFn: (data) => apiRequest('post', API_ENDPOINTS.AUTH.LOGIN, data),
    onSuccess: (data) => {
      setUser(data);
      queryClient.invalidateQueries();
      onSuccess?.();
    },
    onError: () => {
      addToast('error', t('errors.auth.login'));
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
