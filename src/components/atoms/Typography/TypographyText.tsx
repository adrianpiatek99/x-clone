import type { FC } from 'react';
import { cloneElement, isValidElement, useMemo } from 'react';

import type { TypographyProps } from './Typography';

type TypographyTextProps = Pick<TypographyProps, 'children'> & {
  truncate: TypographyProps['truncate'];
};

export const TypographyText: FC<TypographyTextProps> = ({ children, truncate }) => {
  const text = useMemo(() => {
    if (Array.isArray(children)) {
      return children.join('');
    }

    return String(children);
  }, [children]);

  if (!truncate) return children;

  if (typeof truncate === 'boolean') {
    return text;
  }

  const { maxLength, textAfter } = truncate;

  if (!maxLength) return children;

  const isLongText = text.length > maxLength;
  const isLastCharacterSpace = isLongText && text.charAt(maxLength - 1) === ' ';
  const modifiedMaxLength = isLastCharacterSpace ? maxLength - 1 : maxLength!;
  const isTextTruncateElement = isValidElement(textAfter);

  return isLongText ? (
    <>
      {text.slice(0, modifiedMaxLength)}
      <span>...</span>
      {!!textAfter && <span>&nbsp;</span>}
      {!!textAfter && isTextTruncateElement ? cloneElement(textAfter) : textAfter}
    </>
  ) : (
    children
  );
};
