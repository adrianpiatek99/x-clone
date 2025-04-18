export type LoaderColor = 'primary' | 'white';
export type LoaderSize = 'small' | 'medium' | 'large';

export type LoaderClassesReturn = {
  color: Record<LoaderColor, string>;
  size: Record<LoaderSize, string>;
};
