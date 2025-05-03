import { defaultLocale, locales } from '@/constants/locales';
import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales,
  defaultLocale,
});

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
