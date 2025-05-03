import type { Locale } from '@/constants/locales';
import { usePathname, useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';

export const useChangeLocale = () => {
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();

  const handleChangeLocale = (locale: Locale) => router.replace(pathname, { locale });

  return { handleChangeLocale, currentLocale: locale as Locale };
};
