export type LoaderColor = 'primary' | 'secondary';
export type LoaderSize = 'small' | 'medium' | 'large';

export type LoaderClassesReturn = {
  color: Record<LoaderColor, string>;
  size: Record<LoaderSize, string>;
};
