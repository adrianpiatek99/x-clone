'use client';

import React from 'react';

type Params = {
  screenName: string;
};

type Props = {
  params: Promise<Params>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ProfilePage({ params }: Props) {
  return (
    <div>
      <span>posts</span>
    </div>
  );
}
