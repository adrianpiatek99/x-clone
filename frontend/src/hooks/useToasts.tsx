import toast from 'react-hot-toast';

import CustomToast from '@/components/atoms/CustomToast';

export const DEFAULT_TOAST_DURATION = 4000;

type Toast = { id: string; visible: boolean };

export type ToastType = 'success' | 'information' | 'error' | 'warning';

type ToastOptions = {
  duration?: number;
};

export const useToasts = () => {
  const addToast = (
    type: ToastType,
    message: string,
    { duration = DEFAULT_TOAST_DURATION }: ToastOptions = {}
  ) => {
    toast.custom(
      ({ id, visible }: Toast) => (
        <CustomToast id={id} type={type} visible={visible} message={message} />
      ),
      { duration }
    );
  };

  const removeToast = (id: string) => toast.dismiss(id);

  return { addToast, removeToast };
};
