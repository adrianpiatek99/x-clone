/**
 * Backend has been rewritten to Rust.
 * See: https://github.com/adrianpiatek99/x-clone/issues/67
 */

// import { ApiError } from './api';

// type Options = {
//   fieldName: string;
//   maxSizeMb: number;
//   accept: readonly string[];
//   limit?: number;
// };

// export const validateFile = (file: File | null | undefined, options: Options) => {
//   if (!file) return;

//   const { maxSizeMb, accept, fieldName } = options;
//   const maxSize = maxSizeMb * 1024 * 1024;

//   if (!accept.includes(file.type) || file.size > maxSize) {
//     throw new ApiError(
//       `Invalid ${fieldName} format or size. File must be ${accept.join(', ')} and under ${
//         maxSize / 1024 / 1024
//       }MB`,
//       400
//     );
//   }
// };
