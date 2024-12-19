import type { FC } from 'react';
import React, { memo } from 'react';

import { CloseCircleIcon, EyeClosedIcon, EyeOpenIcon } from '@/icons';
import { useTranslations } from 'next-intl';

import type { IconButtonColor } from '../IconButton';
import { IconButton } from '../IconButton';

type InputIconsProps = {
  isPasswordVisible: boolean;
  isPasswordIcon: boolean;
  isDisabled: boolean;
  isFilled: boolean;
  isError: boolean;
  handleTogglePasswordVisible: () => void;
  handleClearValue: () => void;
};

export const InputIcons: FC<InputIconsProps> = memo(
  ({
    isPasswordVisible,
    isPasswordIcon,
    isDisabled,
    isFilled,
    isError,
    handleTogglePasswordVisible,
    handleClearValue,
  }) => {
    const t = useTranslations();
    const allowClear = !isDisabled && isFilled;
    const color: IconButtonColor = isError ? 'danger' : 'secondary';

    return (
      <div className='absolute right-[8px] top-1/2 z-[1] flex -translate-y-1/2 gap-1'>
        {isPasswordIcon && (
          <IconButton
            title={isPasswordVisible ? t('actions.hidePassword') : t('actions.showPassword')}
            onClick={handleTogglePasswordVisible}
            color={color}
            disabled={isDisabled}
            disableFocus
          >
            {isPasswordVisible ? <EyeClosedIcon /> : <EyeOpenIcon />}
          </IconButton>
        )}
        {allowClear && (
          <IconButton
            title={t('actions.clear')}
            onClick={handleClearValue}
            color={color}
            disableFocus
          >
            <CloseCircleIcon />
          </IconButton>
        )}
      </div>
    );
  }
);
