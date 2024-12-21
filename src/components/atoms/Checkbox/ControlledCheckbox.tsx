import React from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { Checkbox, type CheckboxProps } from './Checkbox';

type ControlledCheckboxProps<TValues extends FieldValues> = Omit<CheckboxProps, 'checked'> & {
  control: Control<TValues>;
  name: FieldPath<TValues>;
};

export const ControlledCheckbox = <TValues extends FieldValues>({
  control,
  name,
  ...props
}: ControlledCheckboxProps<TValues>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => <Checkbox {...props} {...field} checked={field.value} />}
    />
  );
};
