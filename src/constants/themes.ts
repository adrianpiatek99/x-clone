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

export const themeOptions: ThemeOption[] = [
  {
    theme: Theme.DARK,
    label: 'theme.dark',
  },
  {
    theme: Theme.LIGHT,
    label: 'theme.light',
  },
  {
    theme: Theme.MIDNIGHT_BLUE,
    label: 'theme.midnightBlue',
  },
  {
    theme: Theme.TOKYO_NIGHT,
    label: 'theme.tokyoNight',
  },
];
