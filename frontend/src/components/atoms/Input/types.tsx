export type InputType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';

export type InputRecord<TValues> = {
  name: keyof TValues;
  label: string;
  type?: InputType;
  maxLength?: number;
};
