export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  MIDNIGHT_BLUE = 'midnightBlue',
  TOKYO_NIGHT = 'tokyoNight',
}

type ThemeOption = {
  theme: Theme;
  label: string;
};

export const themes = Object.values(Theme);

export const themeOptions = (t: Translation) =>
  [
    {
      theme: Theme.DARK,
      label: t('theme.dark'),
    },
    {
      theme: Theme.LIGHT,
      label: t('theme.light'),
    },
    {
      theme: Theme.MIDNIGHT_BLUE,
      label: t('theme.midnightBlue'),
    },
    {
      theme: Theme.TOKYO_NIGHT,
      label: t('theme.tokyoNight'),
    },
  ] satisfies ThemeOption[];
