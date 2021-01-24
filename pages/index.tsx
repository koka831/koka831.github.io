import React from "react";
import { Post, getPosts } from "../server/api";

type Props = {
  posts: Post[];
}

export default function Index({ posts }: Props): JSX.Element {
  console.log(posts);
  const post = posts[0];

  return (
    <>
      <p>{post.text}</p>
    </>
  );
}

export const getStaticProps = async(): Promise<{ props: Props }> => {
  const posts = getPosts();
  return {
    props: { posts }
  };
};
