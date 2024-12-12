// Represents the available languages in the application.
// IMPORTANT: When adding a new language to this enum, make sure to update the `matcher` in the middleware!
// Middleware file location: src/middleware.ts
export enum Locale {
  PL = 'pl',
  EN = 'en',
}

type LocaleOption = {
  value: Locale;
  label: string;
};

export const locales = Object.values(Locale);
export const defaultLocale = Locale.EN;

export const languageOptions: LocaleOption[] = [
  {
    label: 'locale.polish',
    value: Locale.PL,
  },
  {
    label: 'locale.english',
    value: Locale.EN,
  },
];
