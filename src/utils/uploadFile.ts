type UploadFileOutput = {
  url: string;
  width: number;
  height: number;
};

const API_CLOUDINARY_KEY = 'dyvjyekzy';
const API_CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${API_CLOUDINARY_KEY}/image/upload`;
const UPLOAD_PRESET = 'maf4fhgi';

export const uploadFile = async (file: File): Promise<UploadFileOutput> => {
  const formData = new FormData();

  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const response = await fetch(API_CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    const { secure_url, width, height } = data;

    if (data?.error) throw data?.error?.message as Error;

    return {
      url: secure_url,
      width,
      height,
    };
  } catch (error) {
    throw error as Error;
  }
};
