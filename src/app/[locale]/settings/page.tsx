'use client';

import Box from '@/components/atoms/Box';
import RadioGroup, { Radio } from '@/components/atoms/RadioGroup';
import type { Locale } from '@/constants/locales';
import { languageOptions } from '@/constants/locales';
import { themeOptions } from '@/constants/themes';
import { useChangeLocale } from '@/hooks/useChangeLocale';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const t = useTranslations();
  const { resolvedTheme, setTheme } = useTheme();
  const { currentLocale, handleChangeLocale } = useChangeLocale();

  return (
    <Box className='px-4 py-3'>
      <Box>
        <RadioGroup>
          {themeOptions(t).map(({ theme, label }) => (
            <Radio
              key={theme}
              name='radioGroup'
              value={theme}
              label={label}
              checked={resolvedTheme === theme}
              onChange={() => setTheme(theme)}
            />
          ))}
        </RadioGroup>
      </Box>
      <Box>
        <select
          value={currentLocale}
          name='locale'
          className='w-full rounded-md border border-gray-300 bg-white p-2 text-black'
          onChange={(e) => handleChangeLocale(e.target.value as Locale)}
        >
          {languageOptions(t).map(({ label, value }) => (
            <option key={value} value={value} className='text-black'>
              {label}
            </option>
          ))}
        </select>
      </Box>
    </Box>
  );
}
