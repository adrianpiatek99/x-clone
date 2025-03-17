import React from 'react';

type Props = {
  params: { screenName: string };
};

export default function ProfilePage({ params }: Props) {
  return <div>ProfilePage {params.screenName}</div>;
}
