import React from 'react';

type Props = {
  params: { screenName: string; id: string };
};

const PostPage = ({ params }: Props) => {
  return <div>PostPage {params.id}</div>;
};

export default PostPage;
