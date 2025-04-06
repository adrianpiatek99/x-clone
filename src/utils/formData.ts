export const appendToFormData = (formData: FormData, key: string, value: unknown) => {
  if (value === undefined || value === null) {
    formData.append(key, '');

    return;
  }

  if (typeof value === 'boolean') {
    formData.append(key, value ? 'true' : 'false');

    return;
  }

  formData.append(key, String(value));
};

export const createFormData = <T extends Record<string, unknown>>(data: T): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      // Handle array of files
      value.forEach((item, index) => {
        if (item instanceof File) {
          formData.append(`${key}[${index}]`, item);
        } else {
          appendToFormData(formData, `${key}[${index}]`, item);
        }
      });
    } else if (value instanceof Blob) {
      formData.append(key, value);
    } else if (typeof value === 'object' && value !== null) {
      // Handle nested objects
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        const fullKey = `${key}[${nestedKey}]`;

        if (nestedValue instanceof File) {
          formData.append(fullKey, nestedValue);
        } else {
          appendToFormData(formData, fullKey, nestedValue);
        }
      });
    } else {
      appendToFormData(formData, key, value);
    }
  });

  return formData;
};
