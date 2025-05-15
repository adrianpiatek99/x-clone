'use client';

import React from 'react';

import { useFieldContext } from '@/hooks/useFormHook';

import type { RadioProps } from './Radio';
import { Radio } from './Radio';

type Props = Omit<RadioProps, 'checked' | 'name'>;

const RadioField = ({ value, ...props }: Props) => {
  const { name, state, handleBlur, handleChange } = useFieldContext<string | number>();

  return (
    <Radio
      {...props}
      name={name}
      value={value}
      checked={state.value === value}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={handleBlur}
    />
  );
};

export default RadioField;
