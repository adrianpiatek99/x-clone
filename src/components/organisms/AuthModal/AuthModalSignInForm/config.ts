import type { InputRecord } from '@/components/atoms/Input';
import type { SignInValues } from '@/schema';
import { PASSWORD_MAX_LENGTH } from '@/schema';

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
