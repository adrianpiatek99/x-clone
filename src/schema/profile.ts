import { VALIDATION } from '@/constants/validation';
import { z } from 'zod';

export type ProfileValues = z.infer<ReturnType<typeof profileSchema>>;

export const profileSchema = (t: Translation | undefined = undefined) =>
  z.object({
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
    description: z
      .string()
      .trim()
      .max(
        VALIDATION.ACCOUNT.DESCRIPTION.MAX,
        t && t('errors.validation.description.max', { max: VALIDATION.ACCOUNT.DESCRIPTION.MAX })
      ),
    url: z.union([
      z
        .string()
        .max(
          VALIDATION.ACCOUNT.WEBSITE.MAX,
          t && t('errors.validation.website.max', { max: VALIDATION.ACCOUNT.WEBSITE.MAX })
        )
        .url({ message: t && t('errors.validation.website.invalid') })
        .nullish(),
      z.literal(''),
    ]),
  });
