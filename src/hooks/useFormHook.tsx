import type { ButtonProps } from '@/components/atoms';
import { Button } from '@/components/atoms';
import CheckboxField from '@/components/atoms/Checkbox/CheckboxField';
import InputField from '@/components/atoms/Input/InputField';
import RadioField from '@/components/atoms/RadioGroup/RadioField';
import SwitchField from '@/components/atoms/SwitchGroup/SwitchField';
import TextareaField from '@/components/atoms/Textarea/TextareaField';
import { createFormHook, createFormHookContexts } from '@tanstack/react-form';

export const { fieldContext, formContext, useFormContext, useFieldContext } =
  createFormHookContexts();

const SubscribeButton = ({ ...props }: ButtonProps) => {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isTouched]}>
      {([canSubmit, isTouched]) => (
        <Button type='submit' disabled={!canSubmit || !isTouched} {...props} />
      )}
    </form.Subscribe>
  );
};

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    InputField,
    TextareaField,
    CheckboxField,
    SwitchField,
    RadioField,
  },
  formComponents: { SubscribeButton },
  fieldContext,
  formContext,
});
