import type { InputRecord } from '@/components/atoms/Input';
import { VALIDATION } from '@/constants/validation';
import type { SignInValues } from '@/schema/auth';

export const signInInputs = (t: Translation): InputRecord<SignInValues>[] => [
  {
    name: 'emailOrScreenName',
    label: t('emailOrScreenName'),
    maxLength: VALIDATION.ACCOUNT.EMAIL.MAX,
  },
  {
    type: 'password',
    name: 'password',
    label: t('password'),
    maxLength: VALIDATION.ACCOUNT.PASSWORD.MAX,
  },
];
