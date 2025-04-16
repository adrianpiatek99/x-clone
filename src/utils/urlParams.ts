/**
 * Utility functions for handling URL parameters
 */

/**
 * Converts an object of parameters to URLSearchParams
 * Automatically handles JSON.stringify for objects and arrays
 * and toString for numbers and booleans
 *
 * @param params - Object containing parameters to convert
 * @returns URLSearchParams instance
 */
export const createSearchParams = <TParams extends Record<string, unknown>>(params: TParams) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (typeof value === 'object') {
      searchParams.append(key, JSON.stringify(value));
    } else {
      searchParams.append(key, value.toString());
    }
  });

  return searchParams;
};

/**
 * Creates a URL with search parameters
 *
 * @param baseUrl - Base URL without parameters
 * @param params - Object containing parameters to convert
 * @returns Complete URL with search parameters
 */
export const createUrlWithParams = <TParams extends Record<string, unknown>>(
  baseUrl: Readonly<string>,
  params: TParams
): Readonly<string> => {
  const searchParams = createSearchParams(params);
  const searchString = searchParams.toString();

  return searchString ? (`${baseUrl}?${searchString}` as const) : baseUrl;
};
