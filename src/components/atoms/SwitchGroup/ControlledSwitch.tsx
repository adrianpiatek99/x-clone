import React from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { SwitchProps } from './Switch';
import { Switch } from './Switch';

type ControlledSwitchProps<TValues extends FieldValues> = Omit<SwitchProps, 'checked'> & {
  control: Control<TValues>;
  name: FieldPath<TValues>;
};

export const ControlledSwitch = <TValues extends FieldValues>({
  control,
  name,
  ...props
}: ControlledSwitchProps<TValues>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => <Switch {...props} {...field} checked={field.value} />}
    />
  );
};
