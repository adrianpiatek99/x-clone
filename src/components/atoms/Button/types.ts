export type ButtonVariant = 'plain' | 'gray' | 'tinted' | 'filled';
export type ButtonColor = 'primary' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonAlign = 'left' | 'center';
export type ButtonRounded = 'full' | 'large';

export type ButtonClassesReturn = {
  variant: Record<ButtonVariant, Record<ButtonColor, string>>;
  size: Record<ButtonSize, string>;
  align: Record<ButtonAlign, string>;
  iconSize: Record<ButtonSize, string>;
  loaderSize: Record<ButtonSize, string>;
  rounded: Record<ButtonRounded, string>;
};
