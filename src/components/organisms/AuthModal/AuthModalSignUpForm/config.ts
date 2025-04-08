import type { InputRecord } from '@/components/atoms/Input';
import {
  EMAIL_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PROFILE_NAME_MAX_LENGTH,
  PROFILE_SCREEN_NAME_MAX_LENGTH,
  type SignUpValues,
} from '@/schema';

export const signUpInputs = (t: Translation): InputRecord<SignUpValues>[] => [
  {
    name: 'name',
    label: t('name'),
    maxLength: PROFILE_NAME_MAX_LENGTH,
  },
  {
    name: 'email',
    label: t('email'),
    maxLength: EMAIL_MAX_LENGTH,
  },
  {
    name: 'screenName',
    label: t('username'),
    maxLength: PROFILE_SCREEN_NAME_MAX_LENGTH,
  },
  {
    type: 'password',
    name: 'password',
    label: t('password'),
    maxLength: PASSWORD_MAX_LENGTH,
  },
  {
    type: 'password',
    name: 'confirmPassword',
    label: t('confirmPassword'),
    maxLength: PASSWORD_MAX_LENGTH,
  },
];
