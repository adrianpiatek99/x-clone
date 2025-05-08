import { useEffect, useMemo } from 'react';

import { useUpdateProfileMutation } from '@/hooks/api/profile/mutations';
import { useAppForm } from '@/hooks/useFormHook';
import type { ProfileValues } from '@/schema/profile';
import { profileSchema } from '@/schema/profile';
import { useEditProfileStore } from '@/stores/editProfile';
import type { AuthUser } from '@/types/user';
import { useStore } from '@tanstack/react-form';
import { useTranslations } from 'next-intl';
import { useShallow } from 'zustand/react/shallow';

type Props = {
  user: AuthUser;
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
  const { avatarUrl, bannerUrl } = user;

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
        avatarFile: avatar.file,
        bannerFile: banner.file,
        removeBanner: !banner.url,
      });
    },
  });
  const formValues = useStore(store, (state) => state.values);

  const { updateProfileMutate, isPending } = useUpdateProfileMutation({
    onSuccess: () => {
      onClose();
    },
  });

  const isChanged = useMemo(
    () =>
      !Object.entries({
        ...formValues,
        avatarUrl: avatar.url,
        bannerUrl: banner.url,
      }).every(([key, value]) => value === user[key as keyof typeof user]),
    [user, formValues, avatar.url, banner.url]
  );

  useEffect(() => {
    if (isOpen) {
      resetStore();
      reset();
      updateInitialState(avatarUrl, bannerUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, bannerUrl, avatarUrl]);

  return { AppField, handleSubmit, reset, isPending, isChanged };
};
