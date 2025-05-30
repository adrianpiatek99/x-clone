export const formatNumber = (num: number): string => {
  const abbreviate = (value: number, divisor: number, suffix: string): string => {
    const result = value / divisor;
    const rounded = Math.floor(result * 10) / 10;

    return Number.isInteger(rounded)
      ? `${rounded.toFixed(0)}${suffix}`
      : `${rounded.toFixed(1)}${suffix}`;
  };

  if (num >= 1_000_000) {
    return abbreviate(num, 1_000_000, 'M');
  }

  if (num >= 1_000) {
    return abbreviate(num, 1_000, 'k');
  }

  return num.toString();
};
