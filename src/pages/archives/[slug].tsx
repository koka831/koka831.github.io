import React from "react";
import { GetStaticPaths } from "next";
import Head from "next/head";

import type { Post } from "../../types";
import { getSlugs, getPostBySlug } from "../../lib/api";

import { Layout, TableOfContent } from "../../components";
import { ArticleHeader, Comments, CommitLogs } from "../../components/archives";
import styles from "./slug.module.scss";

type Props = {
 post: Post;
}

const Page: React.VFC<Props> = ({ post }: Props) => {
  return (
    <Layout>
      <Head>
        <title>{post.title} | /var/log/koka</title>
        <meta key="title" property="title" content={`${post.title} | /var/log/koka`} />
        <meta key="og:title" property="og:title" content={`${post.title} | /var/log/koka`} />
        <meta key="twitter:title" property="twitter:title" content={`${post.title} | /var/log/koka`} />
        <meta key="description" property="description" content={post.description} />
        <meta key="og:description" property="og:description" content={post.description} />
        <meta key="twitter:description" property="twitter:description" content={post.description} />
        <meta key="og:image" property="og:image" content={post.image} />
      </Head>
      <div className={styles.container}>
        <div className={styles.main}>
          <article className={styles.article} role="article">
            <ArticleHeader {...post} />
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>
          <CommitLogs logs={post.commits} />
          <Comments />
        </div>
        <aside className={styles.aside}>
          <TableOfContent />
        </aside>
      </div>
    </Layout>
  );
};

type Params = {
  params: {
    slug: string;
  }
}

export const getStaticProps = async ({ params }: Params): Promise<{ props: Props }>  => {
  const post = await getPostBySlug(params.slug);
  return {
    props: {
      post,
    }
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getSlugs();

  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

export default Page;
