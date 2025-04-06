import { imageFileTypes } from '@/constants/fileTypes';
import { db } from '@/db/db';
import { type User, usersTable } from '@/db/schema';
import { profileSchema } from '@/schema';
import { handleApiError } from '@/utils/api';
import { withAuth } from '@/utils/auth';
import { uploadFile } from '@/utils/uploadFile';
import { fileValidationConfigs, validateFile } from '@/utils/validateFile';
import { eq } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

export type UpdateProfileRequest = Pick<User, 'name' | 'description' | 'url'> & {
  profileImage?: File | null;
  profileBanner?: File | null;
  removeBanner?: boolean;
};

export const PATCH = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const formData = await request.formData();

    const { name, description, url } = profileSchema().parse({
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      url: formData.get('url') as string,
    });
    const profileImage = formData.get('profileImage') as File | null;
    const profileBanner = formData.get('profileBanner') as File | null;
    const removeBanner = formData.get('removeBanner') === 'true';

    validateFile(profileImage, {
      ...fileValidationConfigs.avatar,
      allowedTypes: imageFileTypes,
    });

    validateFile(profileBanner, {
      ...fileValidationConfigs.banner,
      allowedTypes: imageFileTypes,
    });

    const [profileImageResult, profileBannerResult] = await Promise.all([
      profileImage ? uploadFile(profileImage) : null,
      profileBanner ? uploadFile(profileBanner) : null,
    ]);

    const updateData = {
      name,
      description,
      url,
      ...(profileImageResult && { profileImageUrl: profileImageResult.url }),
      ...(removeBanner
        ? { profileBannerUrl: '' }
        : profileBannerResult && { profileBannerUrl: profileBannerResult.url }),
    };

    await db.update(usersTable).set(updateData).where(eq(usersTable.id, userId));

    return NextResponse.json({});
  } catch (error) {
    return handleApiError(error);
  }
});
