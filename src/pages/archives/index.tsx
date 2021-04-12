import React from "react";
import { GetStaticProps } from "next";
import Link from "next/link";
import Head from "next/head";

import { Post } from "../../types";
import { getPosts } from "../../lib/api";

import { Layout } from "../../components";
import styles from "./index.module.scss";
import Tag from "../../components/post/tag";

type Props = {
  posts: Post[];
}

const Index: React.FC<Props> = ({ posts }: Props): JSX.Element => {
  return (
    <Layout>
      <Head>
        <meta key="title" property="title" content="Archives" />
        <title>Archives | /var/log/koka</title>
      </Head>
      <h2 className={styles.page_title}>Archives</h2>
      <div className={styles.posts}>
        {posts.map(post => <Article key={post.slug} post={post} />)}
      </div>
    </Layout>
  );
};

const Article: React.FC<{ post: Post }> = ({ post }: { post: Post }): JSX.Element => (
  <section className={styles.post}>
    <Link as={`/archives/${post.slug}`} href="/archives/[slug]">
      <a className={styles.post__title}>{post.title}</a>
    </Link>
    <p>{post.description}</p>
    <div className={styles.flex}>
      <div className={styles.post__tags}>
        {post.tags.map((tag) => <Tag key={tag} name={tag} />) }
      </div>
      <time
        dateTime={post.date}
        itemProp="datePublished"
        className={styles.post__date}
      >
        published: {post.date}
      </time>
    </div>
  </section>
);

export const getStaticProps: GetStaticProps = async (): Promise<{ props: Props }> => {
  const posts = await getPosts();
  return {
    props: { posts }
  };
};

export default Index;
