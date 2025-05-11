/**
 * Backend has been rewritten to Rust.
 * See: https://github.com/adrianpiatek99/x-clone/issues/67
 */

// import { db } from '@/db/db';
// import { usersTable } from '@/db/schema';
// import { handleApiError } from '@/db/utils/api';
// import { withAuth } from '@/db/utils/auth';
// import { uploadFile } from '@/db/utils/uploadFile';
// import { fileValidationConfigs, validateFile } from '@/db/utils/validateFile';
// import { profileSchema } from '@/schema/profile';
// import { eq } from 'drizzle-orm';
// import type { NextRequest } from 'next/server';
// import { NextResponse } from 'next/server';
// import { z } from 'zod';

// const schema = profileSchema().extend({
//   avatarFile: z.instanceof(File).nullish(),
//   bannerFile: z.instanceof(File).nullish(),
//   removeBanner: z.boolean().optional(),
// }) satisfies z.ZodType<
//   z.infer<ReturnType<typeof profileSchema>> & {
//     avatarFile?: File | null;
//     bannerFile?: File | null;
//     removeBanner?: boolean;
//   }
// >;

// export type UpdateProfileRequest = z.infer<typeof schema>;

// export const PATCH = withAuth(async (request: NextRequest, userId: string) => {
//   try {
//     const formData = await request.formData();

//     // Validate payload
//     const { name, description, url, avatarFile, bannerFile, removeBanner } = schema.parse({
//       name: formData.get('name') as string,
//       description: formData.get('description') as string,
//       url: formData.get('url') as string,
//       avatarFile: formData.get('avatarFile'),
//       bannerFile: formData.get('bannerFile'),
//       removeBanner: formData.get('removeBanner') === 'true',
//     });

//     validateFile(avatarFile, fileValidationConfigs.avatar);
//     validateFile(bannerFile, fileValidationConfigs.banner);

//     await db.transaction(async (tx) => {
//       // Upload files
//       const [avatarResult, bannerResult] = await Promise.all([
//         avatarFile ? uploadFile(avatarFile) : null,
//         bannerFile ? uploadFile(bannerFile) : null,
//       ]);

//       // Update user
//       await tx
//         .update(usersTable)
//         .set({
//           name,
//           description,
//           url,
//           ...(avatarResult && { avatarUrl: avatarResult.url }),
//           ...(removeBanner ? { bannerUrl: '' } : bannerResult && { bannerUrl: bannerResult.url }),
//         })
//         .where(eq(usersTable.id, userId));
//     });

//     return NextResponse.json({});
//   } catch (error) {
//     return handleApiError(error);
//   }
// });
