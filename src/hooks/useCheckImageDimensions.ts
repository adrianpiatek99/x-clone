import { useEffect, useState } from 'react';

type ImageDimensions = {
  width: number;
  height: number;
};

export const useCheckImageDimensions = (file: File | undefined): ImageDimensions => {
  const [dimensions, setDimensions] = useState<ImageDimensions>({ width: 0, height: 0 });

  useEffect(() => {
    if (!file) {
      setDimensions({ width: 0, height: 0 });

      return;
    }

    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.src = objectUrl;

    const handleLoad = () => {
      setDimensions({ width: image.width, height: image.height });
      URL.revokeObjectURL(objectUrl);
    };

    image.addEventListener('load', handleLoad);

    return () => {
      image.removeEventListener('load', handleLoad);
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  return dimensions;
};
