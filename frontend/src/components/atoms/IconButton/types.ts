export type IconButtonColor = 'primary' | 'secondary' | 'danger' | 'white' | 'darker';
export type IconButtonSize = 'small' | 'medium' | 'large';

export type IconButtonClassesReturn = {
  color: Record<IconButtonColor, string>;
  size: Record<IconButtonSize, string>;
};
