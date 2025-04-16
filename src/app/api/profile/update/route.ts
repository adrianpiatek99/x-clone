import { db } from '@/db/db';
import { type User, usersTable } from '@/db/schema';
import { handleApiError } from '@/db/utils/api';
import { withAuth } from '@/db/utils/auth';
import { uploadFile } from '@/db/utils/uploadFile';
import { fileValidationConfigs, validateFile } from '@/db/utils/validateFile';
import { profileSchema } from '@/schema/profile';
import { eq } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

export type UpdateProfileRequest = Pick<User, 'name' | 'description' | 'url'> & {
  avatarFile?: File | null;
  bannerFile?: File | null;
  removeBanner?: boolean;
};

export const PATCH = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const formData = await request.formData();

    // Validate payload
    const { name, description, url } = profileSchema().parse({
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      url: formData.get('url') as string,
    });
    const avatarFile = formData.get('avatarFile') as File | null;
    const bannerFile = formData.get('bannerFile') as File | null;
    const removeBanner = formData.get('removeBanner') === 'true';

    validateFile(avatarFile, fileValidationConfigs.avatar);

    validateFile(bannerFile, fileValidationConfigs.banner);

    // Upload files
    const [avatarResult, bannerResult] = await Promise.all([
      avatarFile ? uploadFile(avatarFile) : null,
      bannerFile ? uploadFile(bannerFile) : null,
    ]);

    // Update user
    await db
      .update(usersTable)
      .set({
        name,
        description,
        url,
        ...(avatarResult && { avatarUrl: avatarResult.url }),
        ...(removeBanner ? { bannerUrl: '' } : bannerResult && { bannerUrl: bannerResult.url }),
      })
      .where(eq(usersTable.id, userId));

    return NextResponse.json({});
  } catch (error) {
    return handleApiError(error);
  }
});
