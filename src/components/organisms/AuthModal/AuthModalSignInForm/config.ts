import type { InputRecord } from '@/components/atoms/Input';
import { PASSWORD_MAX_LENGTH } from '@/db/constants';
import type { SignInValues } from '@/schema';

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
