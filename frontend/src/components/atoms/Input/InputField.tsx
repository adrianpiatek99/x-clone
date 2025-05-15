import React from 'react';

import { useFieldContext } from '@/hooks/useFormHook';
import { useStore } from '@tanstack/react-form';

import type { InputProps } from './Input';
import Input from './Input';

type Props = Pick<InputProps, 'label' | 'type' | 'isLoading' | 'disabled' | 'maxLength'>;

const InputField = ({ ...props }: Props) => {
  const { name, state, store, handleChange, handleBlur } = useFieldContext<string>();
  const errors = useStore(store, (state) => state.meta.errors);
  const error = state.meta.isTouched && errors[0]?.message;

  return (
    <Input
      {...props}
      name={name}
      value={state.value}
      onChange={handleChange}
      onBlur={handleBlur}
      error={error}
    />
  );
};

export default InputField;
