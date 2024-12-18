import React from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { RadioGroupItemProps } from './RadioGroupItem';
import { RadioGroupItem } from './RadioGroupItem';

type ControlledRadioGroupItemProps<TValues extends FieldValues> = Omit<
  RadioGroupItemProps,
  'checked'
> & {
  control: Control<TValues>;
  name: FieldPath<TValues>;
};

export const ControlledRadioGroupItem = <TValues extends FieldValues>({
  control,
  name,
  value,
  ...props
}: ControlledRadioGroupItemProps<TValues>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <RadioGroupItem {...props} {...field} value={value} checked={field.value === value} />
      )}
    />
  );
};
