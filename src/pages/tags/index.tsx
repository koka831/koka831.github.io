import React from "react";
import { GetStaticProps } from "next";

import { getPosts } from "../../lib/api";

import { Layout } from "../../components";

type Props = {
  tags: string[];
};

const Index: React.FC<Props> = ({ tags }: Props): JSX.Element => {
  return (
    <Layout>
      {tags.map((t) => (
        <p key={t}>{t}</p>
      ))}
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getPosts();
  return {
    props: {
      tags: posts.map((p) => p.tags).flat(),
    },
  };
};

export default Index;
