import { useEffect, useMemo } from 'react';

import type { User } from '@/db/schema';
import { useUpdateProfileMutation } from '@/hooks/api/profile/useUpdateProfileMutation';
import { useAppForm } from '@/hooks/useFormHook';
import type { ProfileValues } from '@/schema';
import { profileSchema } from '@/schema';
import { useEditProfileStore } from '@/stores/editProfile';
import { useStore } from '@tanstack/react-form';
import { useTranslations } from 'next-intl';
import { useShallow } from 'zustand/react/shallow';

type Props = {
  user: User;
  isOpen: boolean;
  onClose: () => void;
};

export const useEditProfileForm = ({ user, isOpen, onClose }: Props) => {
  const t = useTranslations();
  const { avatar, banner, updateInitialState, resetStore } = useEditProfileStore(
    useShallow((state) => ({
      avatar: state.avatar,
      banner: state.banner,
      updateInitialState: state.updateInitialState,
      resetStore: state.resetStore,
    }))
  );
  const { profileImageUrl, profileBannerUrl } = user;

  const { updateProfileMutate, isPending } = useUpdateProfileMutation({
    onSuccess: () => {
      onClose();
    },
  });

  const { AppField, handleSubmit, store, reset } = useAppForm({
    defaultValues: {
      name: user.name,
      description: user.description,
      url: user.url ?? '',
    } satisfies ProfileValues,
    validators: {
      // eslint-disable-next-line
      // @ts-ignore
      onChange: profileSchema(t),
    },
    onSubmit: async ({ value }) => {
      if (isPending || !isChanged) return;

      updateProfileMutate({
        ...value,
        url: value.url ?? '',
        profileImage: avatar.file,
        profileBanner: banner.file,
        removeBanner: !banner.url,
      });
    },
  });
  const formValues = useStore(store, (state) => state.values);

  const isChanged = useMemo(() => {
    const isEntriesChanged = !Object.entries(formValues).every(
      ([key, value]) => value === user[key as keyof typeof user]
    );
    const isAvatarChanged = user.profileImageUrl !== avatar.url;
    const isBannerChanged = user.profileBannerUrl !== banner.url;

    return isEntriesChanged || isAvatarChanged || isBannerChanged;
  }, [user, formValues, avatar.url, banner.url]);

  useEffect(() => {
    if (isOpen) {
      resetStore();
      reset();
      updateInitialState(profileImageUrl, profileBannerUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, profileBannerUrl, profileImageUrl]);

  return { AppField, handleSubmit, reset, isPending, isChanged };
};
