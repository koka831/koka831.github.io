import React from "react";
import { GetStaticPaths } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import ErrorPage from "next/error";

import type { Post } from "../../types";
import { getSlugs, getPostBySlug } from "../../lib/api";

import { Layout, TableOfContent } from "../../components";
import { PostHeader, CommitLogs } from "../../components/archives";
import styles from "./slug.module.scss";

type Props = {
 post: Post;
}

const Page: React.VFC<Props> = ({ post }: Props) => {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Layout>
      <Head>
        <title>{post.title} | /var/log/koka</title>
        <meta key="title" property="title" content={post.title} />
        <meta key="og:title" property="og:title" content={post.title} />
      </Head>
      <div className={styles.container}>
        <div className={styles.article_container}>
          <article className={styles.article} role="article">
            <PostHeader
              title={post.title}
              tags={post.tags}
              published_at={post.date}
            />
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>
          <CommitLogs logs={post.commits} />
        </div>
        <aside className={styles.sidebar_container}>
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