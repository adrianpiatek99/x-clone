import React from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { InputProps } from './Input';
import { Input } from './Input';

type ControlledInputProps<TValues extends FieldValues> = Omit<InputProps, 'checked'> & {
  control: Control<TValues>;
  name: FieldPath<TValues>;
};

export const ControlledInput = <TValues extends FieldValues>({
  control,
  name,
  ...props
}: ControlledInputProps<TValues>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => <Input {...props} {...field} />}
    />
  );
};
