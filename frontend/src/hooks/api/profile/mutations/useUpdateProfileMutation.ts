import { API_ENDPOINTS } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { apiRequest } from '@/db/utils/api';
import { useAppSession } from '@/hooks/useAppSession';
import { useToasts } from '@/hooks/useToasts';
import type { UpdateProfileRequest } from '@/types/user';
import { createFormData } from '@/utils/formData';
import { reloadSession } from '@/utils/session';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

type Props = {
  onSuccess?: () => void;
  onSettled?: () => void;
};

export const useUpdateProfileMutation = ({ onSuccess, onSettled }: Props = {}) => {
  const t = useTranslations();
  const { addToast } = useToasts();
  const queryClient = useQueryClient();
  const { user } = useAppSession();

  const { mutate, isPending } = useMutation<void, ApiAxiosError, UpdateProfileRequest>({
    mutationFn: ({ avatarFile, bannerFile, ...data }) => {
      const formData = createFormData(data);

      if (avatarFile) {
        formData.append('avatarFile', avatarFile);
      }

      if (bannerFile) {
        formData.append('bannerFile', bannerFile);
      }

      return apiRequest('PATCH', API_ENDPOINTS.PROFILE.UPDATE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.PROFILE.USER_BY_SCREEN_NAME(user.screenName),
        });
      }

      reloadSession();

      onSuccess?.();
    },
    onError: () => {
      addToast('error', t('errors.api.somethingWentWrong'), { duration: 6000 });
    },
    onSettled: () => {
      onSettled?.();
    },
  });

  const updateProfileMutate = (data: UpdateProfileRequest) => {
    if (isPending) return;

    mutate(data);
  };

  return { updateProfileMutate, isPending };
};
