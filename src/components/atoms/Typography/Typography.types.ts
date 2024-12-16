export type TypographyAs = 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
export type TypographySize = 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl' | '3xl' | '4xl';
export type TypographyWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
export type TypographyColor = 'primary' | 'secondary' | 'danger';

export type TypographyClasses = {
  size: Record<TypographySize, string>;
  color: Record<TypographyColor, string>;
  weight: Record<TypographyWeight, string>;
};
