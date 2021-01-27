import React from "react";
import { Post, getPosts } from "../server/api";

type Props = {
  posts: Post[];
}

export default function Index({ posts }: Props): JSX.Element {
  const post = posts[0];

  return (
    <>
      <article dangerouslySetInnerHTML={{ __html: post.text }} />
    </>
  );
}

export const getStaticProps = async(): Promise<{ props: Props }> => {
  const posts = await getPosts();
  return {
    props: { posts }
  };
};
