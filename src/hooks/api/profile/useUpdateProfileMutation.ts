import type { UpdateProfileRequest } from '@/app/api/profile/update/route';
import { API_ENDPOINTS } from '@/db/apiEndpoints';
import { useToasts } from '@/hooks/useToasts';
import { apiRequest } from '@/utils/api';
import { createFormData } from '@/utils/formData';
import { reloadSession } from '@/utils/session';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

type Props = {
  onSuccess?: () => void;
  onSettled?: () => void;
};

export const useUpdateProfileMutation = ({ onSuccess, onSettled }: Props = {}) => {
  const t = useTranslations();
  const { addToast } = useToasts();
  const { mutate, isPending } = useMutation<void, ApiAxiosError, UpdateProfileRequest>({
    mutationFn: ({ profileImage, profileBanner, ...data }) => {
      const formData = createFormData(data);

      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      if (profileBanner) {
        formData.append('profileBanner', profileBanner);
      }

      return apiRequest('PATCH', API_ENDPOINTS.PROFILE.UPDATE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
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
