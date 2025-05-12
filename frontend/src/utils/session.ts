import { API_ENDPOINTS } from '@/constants/api';
import type { CurrentUser } from '@/types/user';

import { apiRequest } from './api';

export const reloadSession = async () => {
  try {
    const response = await apiRequest<CurrentUser>('GET', API_ENDPOINTS.AUTH.CURRENT_USER);

    const event = new CustomEvent('sessionUpdate', { detail: response });

    document.dispatchEvent(event);
  } catch {
    const event = new CustomEvent('sessionUpdate', { detail: null });

    document.dispatchEvent(event);
  }
};
