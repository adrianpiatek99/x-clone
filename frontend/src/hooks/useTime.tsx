import 'dayjs/locale/pl';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import { useLocale } from 'next-intl';

type DateType = Date | string | number | dayjs.Dayjs;

export const useTime = () => {
  const locale = useLocale();

  dayjs.locale(locale);

  const getRelativeTime = (date: DateType) => dayjs(date).fromNow(true);

  const getFullDate = (date: DateType, format = 'MMMM D, YYYY') => dayjs(date).format(format);

  const getLocalTime = (date: Date, language = locale) =>
    new Date(date).toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' });

  return { getRelativeTime, getFullDate, getLocalTime };
};

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: '%dsec',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1M',
    MM: '%dM',
    y: '1y',
    yy: '%d years',
  },
});

dayjs.updateLocale('pl', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: '%d sec',
    m: '1 min',
    mm: '%d min',
    h: '1 g.',
    hh: '%d g.',
    d: '1d',
    dd: '%dd',
    M: '1M',
    MM: '%dM',
    y: '1y',
    yy: '%d years',
  },
});
