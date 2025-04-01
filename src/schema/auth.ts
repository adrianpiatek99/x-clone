import { z } from 'zod';

export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 32;

export const PROFILE_SCREEN_NAME_MIN_LENGTH = 4;
export const PROFILE_SCREEN_NAME_MAX_LENGTH = 15;
export const EMAIL_MAX_LENGTH = 100;
export const PROFILE_NAME_MIN_LENGTH = 4;
export const PROFILE_NAME_MAX_LENGTH = 50;

export type SignInValues = z.infer<ReturnType<typeof signInSchema>>;
export type SignUpValues = z.infer<ReturnType<typeof signUpSchema>>;

export const signInSchema = (t: Translation | undefined = undefined) =>
  z.object({
    emailOrScreenName: z
      .string({ required_error: t && t('errors.validation.emailOrScreenName.required') })
      .trim(),
    password: z
      .string({ required_error: t && t('errors.validation.password.required') })
      .min(
        PASSWORD_MIN_LENGTH,
        t && t('errors.validation.password.min', { min: PASSWORD_MIN_LENGTH })
      )
      .max(
        PASSWORD_MAX_LENGTH,
        t && t('errors.validation.password.max', { max: PASSWORD_MAX_LENGTH })
      ),
  });

export const signUpSchema = (t: Translation | undefined = undefined) =>
  z
    .object({
      screenName: z
        .string({ required_error: t && t('errors.validation.screenName.required') })
        .min(
          PROFILE_SCREEN_NAME_MIN_LENGTH,
          t && t('errors.validation.screenName.min', { min: PROFILE_SCREEN_NAME_MIN_LENGTH })
        )
        .max(
          PROFILE_SCREEN_NAME_MAX_LENGTH,
          t && t('errors.validation.screenName.max', { max: PROFILE_SCREEN_NAME_MAX_LENGTH })
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
        .max(EMAIL_MAX_LENGTH, t && t('errors.validation.email.max', { max: EMAIL_MAX_LENGTH }))
        .trim(),
      name: z
        .string({ required_error: t && t('errors.validation.name.required') })
        .min(
          PROFILE_NAME_MIN_LENGTH,
          t && t('errors.validation.name.min', { min: PROFILE_NAME_MIN_LENGTH })
        )
        .max(
          PROFILE_NAME_MAX_LENGTH,
          t && t('errors.validation.name.max', { max: PROFILE_NAME_MAX_LENGTH })
        )
        .trim()
        .refine(
          (value) => /^[\p{L}0-9]+(?:[\s-][\p{L}0-9]+)*$/u.test(value),
          t && t('errors.validation.name.invalid')
        ),
      password: z
        .string({ required_error: t && t('errors.validation.password.required') })
        .min(
          PASSWORD_MIN_LENGTH,
          t && t('errors.validation.password.min', { min: PASSWORD_MIN_LENGTH })
        )
        .max(
          PASSWORD_MAX_LENGTH,
          t && t('errors.validation.password.max', { max: PASSWORD_MAX_LENGTH })
        ),
      confirmPassword: z
        .string({ required_error: t && t('errors.validation.password.required') })
        .min(
          PASSWORD_MIN_LENGTH,
          t && t('errors.validation.password.min', { min: PASSWORD_MIN_LENGTH })
        )
        .max(
          PASSWORD_MAX_LENGTH,
          t && t('errors.validation.password.max', { max: PASSWORD_MAX_LENGTH })
        ),
    })
    .refine(({ password, confirmPassword }) => password === confirmPassword, {
      message: t && t('errors.validation.password.notMatch'),
      path: ['confirmPassword'],
    });
