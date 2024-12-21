export type AvatarSize = 'small' | 'medium' | 'large' | 'extraLarge' | 'profile';

export type AvatarClasses = {
  size: Record<AvatarSize, string>;
};
