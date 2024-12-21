import React from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { RadioProps } from './Radio';
import { Radio } from './Radio';

type ControlledRadioProps<TValues extends FieldValues> = Omit<RadioProps, 'checked'> & {
  control: Control<TValues>;
  name: FieldPath<TValues>;
};

export const ControlledRadio = <TValues extends FieldValues>({
  control,
  name,
  value,
  ...props
}: ControlledRadioProps<TValues>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Radio {...props} {...field} value={value} checked={field.value === value} />
      )}
    />
  );
};
