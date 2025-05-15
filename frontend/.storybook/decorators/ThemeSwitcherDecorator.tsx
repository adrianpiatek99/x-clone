import React from 'react';

import { themeOptions } from '@/constants/themes';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

const ThemeSwitcherDecorator = () => {
  const t = useTranslations();
  const { theme: selectedTheme, setTheme } = useTheme();

  return (
    <>
      <div className='flex flex-wrap gap-3'>
        <span>Themes:</span>
        {themeOptions(t).map(({ theme, label }) => (
          <div key={theme} className='inline-flex items-center'>
            <input
              type='radio'
              id={theme}
              name='theme'
              value={theme}
              checked={selectedTheme === theme}
              onChange={() => setTheme(theme)}
            />{' '}
            <label htmlFor={theme}>{label}</label>
          </div>
        ))}
      </div>
      <br />
    </>
  );
};

export default ThemeSwitcherDecorator;
