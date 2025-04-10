import {
  PROFILE_DESCRIPTION_MAX_LENGTH,
  PROFILE_NAME_MAX_LENGTH,
  PROFILE_NAME_MIN_LENGTH,
  PROFILE_WEBSITE_MAX_LENGTH,
} from '@/db/constants';
import { z } from 'zod';

export type ProfileValues = z.infer<ReturnType<typeof profileSchema>>;

export const profileSchema = (t: Translation | undefined = undefined) =>
  z.object({
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
    description: z
      .string()
      .trim()
      .max(
        PROFILE_DESCRIPTION_MAX_LENGTH,
        t && t('errors.validation.description.max', { max: PROFILE_DESCRIPTION_MAX_LENGTH })
      ),
    url: z.union([
      z
        .string()
        .max(
          PROFILE_WEBSITE_MAX_LENGTH,
          t && t('errors.validation.website.max', { max: PROFILE_WEBSITE_MAX_LENGTH })
        )
        .url({ message: t && t('errors.validation.website.invalid') })
        .nullish(),
      z.literal(''),
    ]),
  });
