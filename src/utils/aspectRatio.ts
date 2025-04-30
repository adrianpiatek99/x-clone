/**
 * Calculates the aspect ratio and scaled dimensions of an image
 * @param width - Original width of the image
 * @param height - Original height of the image
 * @returns Object containing aspect ratio and scaled dimensions
 */
export const calcAspectRatio = (
  width: number,
  height: number
): {
  aspectRatio: number;
  ratioWidth: number;
  ratioHeight: number;
} => {
  if (width === 0)
    return {
      aspectRatio: 0,
      ratioWidth: 0,
      ratioHeight: 0,
    };

  const aspectRatio = Number(((Math.round(height) / Math.round(width)) * 100).toFixed(2));

  const scale = 0.52;
  const ratioWidth = width * scale;
  const ratioHeight = height * scale;

  return {
    aspectRatio,
    ratioWidth,
    ratioHeight,
  };
};
