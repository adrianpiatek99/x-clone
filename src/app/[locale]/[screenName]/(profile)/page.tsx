import React from 'react';

type Params = {
  screenName: string;
};

type Props = {
  params: Promise<Params>;
};

export default function ProfilePage({ params }: Props) {
  const unwrappedParams = React.use(params);

  return <div>ProfilePage {unwrappedParams.screenName}</div>;
}
