import React from "react";
import { GetStaticProps } from "next";
import Head from "next/head";

import type { Post } from "../../types";
import { getPosts } from "../../lib/api";

import { Layout } from "../../components";
import { ArticleHeader } from "../../components/archives";
import styles from "./index.module.scss";

type Props = {
  posts: Post[];
};

const Index: React.VFC<Props> = ({ posts }: Props) => {
  return (
    <Layout>
      <Head>
        <meta key="title" property="title" content="Archives" />
        <title>Archives | /var/log/koka</title>
      </Head>
      <div className={styles.posts}>
        <div className={styles.posts__wrapper}>
          {posts.map((post) => (
            <ArticleHeader key={post.slug} {...post} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const posts = await getPosts();
  return {
    props: { posts },
  };
};

export default Index;
