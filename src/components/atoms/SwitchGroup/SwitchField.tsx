'use client';

import React from 'react';

import { useFieldContext } from '@/hooks/useFormHook';

import type { SwitchProps } from './Switch';
import { Switch } from './Switch';

type Props = Omit<SwitchProps, 'checked' | 'name'>;

const SwitchField = ({ ...props }: Props) => {
  const { name, state, handleChange } = useFieldContext<boolean>();

  return <Switch {...props} name={name} onChange={handleChange} checked={state.value} />;
};

export default SwitchField;
