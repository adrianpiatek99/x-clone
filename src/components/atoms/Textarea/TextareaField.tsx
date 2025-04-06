import React from 'react';

import { useFieldContext } from '@/hooks/useFormHook';
import { useStore } from '@tanstack/react-form';

import type { TextareaProps } from './Textarea';
import { Textarea } from './Textarea';

type Props = Pick<TextareaProps, 'label' | 'isLoading' | 'disabled' | 'rows' | 'maxLength'>;

const TextareaField = ({ ...props }: Props) => {
  const { name, state, store, handleChange, handleBlur } = useFieldContext<string>();
  const errors = useStore(store, (state) => state.meta.errors);
  const error = state.meta.isTouched && errors[0]?.message;

  return (
    <Textarea
      {...props}
      name={name}
      value={state.value}
      onValueChange={handleChange}
      onBlur={handleBlur}
      error={error}
    />
  );
};

export default TextareaField;
