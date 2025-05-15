import type { ToastType } from '@/hooks/useToasts';

export type CustomToastClasses = {
  variant: Record<ToastType, string>;
  icon: Record<ToastType, string>;
};
