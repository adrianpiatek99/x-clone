import React from 'react';

import { themeOptions } from '@/constants/themes';
import { useTheme } from 'next-themes';

const ThemeSwitcherDecorator = () => {
  const { theme: selectedTheme, setTheme } = useTheme();

  return (
    <>
      <div className='flex flex-wrap gap-3'>
        <span>Themes:</span>
        {themeOptions.map(({ theme }) => (
          <div key={theme} className='inline-flex items-center'>
            <input
              type='radio'
              id={theme}
              name='theme'
              value={theme}
              checked={selectedTheme === theme}
              onChange={() => setTheme(theme)}
            />{' '}
            <label htmlFor={theme}>{theme}</label>
          </div>
        ))}
      </div>
      <br />
    </>
  );
};

export default ThemeSwitcherDecorator;
