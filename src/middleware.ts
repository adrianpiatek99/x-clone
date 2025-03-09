import createMiddleware from 'next-intl/middleware';

export { auth } from '@/auth';

import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(pl|en)/:path*'],
};
