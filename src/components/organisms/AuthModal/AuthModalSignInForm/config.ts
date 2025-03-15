import type { InputRecord } from '@/components/atoms';
import { PASSWORD_MAX_LENGTH, type SignInValues } from '@/schemas';

export const signInInputs = (t: Translation): InputRecord<SignInValues>[] => [
  {
    name: 'emailOrScreenName',
    label: t('emailOrScreenName'),
  },
  {
    type: 'password',
    name: 'password',
    label: t('password'),
    maxLength: PASSWORD_MAX_LENGTH,
  },
];
