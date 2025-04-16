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
export function createSearchParams(params: Record<string, unknown>): URLSearchParams {
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
}

/**
 * Creates a URL with search parameters
 *
 * @param baseUrl - Base URL without parameters
 * @param params - Object containing parameters to convert
 * @returns Complete URL with search parameters
 */
export function createUrlWithParams(baseUrl: string, params: Record<string, unknown>): string {
  const searchParams = createSearchParams(params);
  const searchString = searchParams.toString();

  return searchString ? `${baseUrl}?${searchString}` : baseUrl;
}
