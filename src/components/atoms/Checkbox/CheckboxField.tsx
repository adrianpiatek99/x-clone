'use client';

import React from 'react';

import { useFieldContext } from '@/hooks/useFormHook';

import { Checkbox, type CheckboxProps } from './Checkbox';

type Props = Omit<CheckboxProps, 'checked' | 'onChange' | 'name'>;

const CheckboxField = ({ ...props }: Props) => {
  const field = useFieldContext<boolean>();

  return (
    <Checkbox
      {...props}
      name={field.name}
      checked={field.state.value}
      onChange={field.handleChange}
      onBlur={field.handleBlur}
    />
  );
};

export default CheckboxField;
