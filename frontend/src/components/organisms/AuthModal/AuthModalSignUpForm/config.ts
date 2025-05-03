import type { InputRecord } from '@/components/atoms/Input';
import { VALIDATION } from '@/constants/validation';
import type { SignUpValues } from '@/schema/auth';

export const signUpInputs = (t: Translation): InputRecord<SignUpValues>[] => [
  {
    name: 'name',
    label: t('name'),
    maxLength: VALIDATION.ACCOUNT.NAME.MAX,
  },
  {
    name: 'email',
    label: t('email'),
    maxLength: VALIDATION.ACCOUNT.EMAIL.MAX,
  },
  {
    name: 'screenName',
    label: t('username'),
    maxLength: VALIDATION.ACCOUNT.SCREEN_NAME.MAX,
  },
  {
    type: 'password',
    name: 'password',
    label: t('password'),
    maxLength: VALIDATION.ACCOUNT.PASSWORD.MAX,
  },
  {
    type: 'password',
    name: 'confirmPassword',
    label: t('confirmPassword'),
    maxLength: VALIDATION.ACCOUNT.PASSWORD.MAX,
  },
];
