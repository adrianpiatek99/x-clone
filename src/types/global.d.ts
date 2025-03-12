import type { ApiError } from '@/utils/api';
import type { AxiosError } from 'axios';

import type en from '../../messages/en.json';
import type pl from '../../messages/pl.json';

type Messages = typeof en;

type NestedKeys<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? `${Prefix}${K}` | NestedKeys<T[K], `${Prefix}${K}.`>
        : never;
    }[keyof T]
  : '';

export type TranslationKeys = NestedKeys<typeof pl> | NestedKeys<typeof en>;

declare global {
  type Translation = (
    messageKey: TranslationKeys,
    nestedKey?: Record<string, string | number>
  ) => string;
  type IntlMessages = Messages;
  type ApiAxiosError = AxiosError<ApiError>;
}

export {};
