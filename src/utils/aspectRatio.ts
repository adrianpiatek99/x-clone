export const calcAspectRatio = (width: number, height: number) => {
  const aspectRatio = Number(((Math.round(height) / Math.round(width)) * 100).toFixed(2)) ?? 0;

  return {
    aspectRatio,
    ratioWidth: width / 4,
    ratioHeight: height / 4,
  };
};
