export type LogoColor = 'primary' | 'secondary';
export type LogoSize = 's' | 'm' | 'l' | 'xl';

export type LogoClassesReturn = {
  size: Record<LogoSize, string>;
  color: Record<LogoColor, string>;
};
