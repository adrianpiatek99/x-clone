import { VALIDATION } from '@/constants/validation';
import type { LoginRequest, RegisterRequest } from '@/types/auth';
import { z } from 'zod';

export type LoginValues = z.infer<ReturnType<typeof loginSchema>>;
export type RegisterValues = z.infer<ReturnType<typeof registerSchema>>;

export const loginSchema = (t: Translation | undefined = undefined) =>
  z.object({
    emailOrScreenName: z
      .string({ required_error: t && t('errors.validation.emailOrScreenName.required') })
      .trim(),
    password: z
      .string({ required_error: t && t('errors.validation.password.required') })
      .min(
        VALIDATION.ACCOUNT.PASSWORD.MIN,
        t && t('errors.validation.password.min', { min: VALIDATION.ACCOUNT.PASSWORD.MIN })
      )
      .max(
        VALIDATION.ACCOUNT.PASSWORD.MAX,
        t && t('errors.validation.password.max', { max: VALIDATION.ACCOUNT.PASSWORD.MAX })
      ),
  }) satisfies z.ZodType<LoginRequest>;

export const registerSchema = (t: Translation | undefined = undefined) =>
  z
    .object({
      screenName: z
        .string({ required_error: t && t('errors.validation.screenName.required') })
        .min(
          VALIDATION.ACCOUNT.SCREEN_NAME.MIN,
          t &&
            t('errors.validation.screenName.min', {
              min: VALIDATION.ACCOUNT.SCREEN_NAME.MIN,
            })
        )
        .max(
          VALIDATION.ACCOUNT.SCREEN_NAME.MAX,
          t &&
            t('errors.validation.screenName.max', {
              max: VALIDATION.ACCOUNT.SCREEN_NAME.MAX,
            })
        )
        .trim()
        .refine(
          (value) => /^[a-zA-Z0-9][a-zA-Z0-9_]*$/g.test(value),
          t && t('errors.validation.screenName.invalid')
        ),
      email: z
        .string({ required_error: t && t('errors.validation.email.required') })
        .toLowerCase()
        .email(t && t('errors.validation.email.incorrect'))
        .max(
          VALIDATION.ACCOUNT.EMAIL.MAX,
          t && t('errors.validation.email.max', { max: VALIDATION.ACCOUNT.EMAIL.MAX })
        )
        .trim(),
      name: z
        .string({ required_error: t && t('errors.validation.name.required') })
        .min(
          VALIDATION.ACCOUNT.NAME.MIN,
          t && t('errors.validation.name.min', { min: VALIDATION.ACCOUNT.NAME.MIN })
        )
        .max(
          VALIDATION.ACCOUNT.NAME.MAX,
          t && t('errors.validation.name.max', { max: VALIDATION.ACCOUNT.NAME.MAX })
        )
        .trim()
        .refine(
          (value) => /^[\p{L}0-9]+(?:[\s-][\p{L}0-9]+)*$/u.test(value),
          t && t('errors.validation.name.invalid')
        ),
      password: z
        .string({ required_error: t && t('errors.validation.password.required') })
        .min(
          VALIDATION.ACCOUNT.PASSWORD.MIN,
          t && t('errors.validation.password.min', { min: VALIDATION.ACCOUNT.PASSWORD.MIN })
        )
        .max(
          VALIDATION.ACCOUNT.PASSWORD.MAX,
          t && t('errors.validation.password.max', { max: VALIDATION.ACCOUNT.PASSWORD.MAX })
        ),
      confirmPassword: z
        .string({ required_error: t && t('errors.validation.password.required') })
        .min(
          VALIDATION.ACCOUNT.PASSWORD.MIN,
          t && t('errors.validation.password.min', { min: VALIDATION.ACCOUNT.PASSWORD.MIN })
        )
        .max(
          VALIDATION.ACCOUNT.PASSWORD.MAX,
          t && t('errors.validation.password.max', { max: VALIDATION.ACCOUNT.PASSWORD.MAX })
        ),
    })
    .refine(({ password, confirmPassword }) => password === confirmPassword, {
      message: t && t('errors.validation.password.notMatch'),
      path: ['confirmPassword'],
    }) satisfies z.ZodType<RegisterRequest>;
