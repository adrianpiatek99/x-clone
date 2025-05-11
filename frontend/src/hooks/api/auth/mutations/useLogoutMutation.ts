import { useAuth } from '@/components/context/AuthContext';
import { API_ENDPOINTS } from '@/constants/api';
import { useToasts } from '@/hooks/useToasts';
import { apiRequest } from '@/utils/api';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

export const useLogoutMutation = () => {
  const t = useTranslations();
  const { setUser } = useAuth();
  const { addToast } = useToasts();
  const { mutate, isPending } = useMutation({
    mutationFn: () => apiRequest('post', API_ENDPOINTS.AUTH.LOGOUT),
    onSuccess: () => {
      setUser(undefined);
    },
    onError: () => {
      addToast('error', t('errors.auth.logout'));
    },
  });

  const logout = () => {
    if (isPending) return;

    mutate();
  };

  return { logout, isPending };
};
