import React from "react";
import { GetStaticPaths } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import ErrorPage from "next/error";

import { Post, CommitLog } from "../../types";
import { getSlugs, getPostBySlug } from "../../lib/api";

import { Layout, TableOfContent } from "../../components";
import PostHeader from "../../components/post/header";
import styles from "./slug.module.scss";

type Props = {
 post: Post;
}

const Page: React.FC<Props> = ({ post }: Props) => {
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
          <div className={styles.commit_logs} role="log">
            <Logs logs={post.commits} />
          </div>
        </div>
        <aside className={styles.sidebar_container}>
          <TableOfContent />
        </aside>
      </div>
    </Layout>
  );
};

type LogProps = {
  logs: CommitLog[];
}

export const Logs: React.FC<LogProps> = ({ logs }: LogProps) => {
  return (
    <>
      <h2>Commits</h2>
      {logs.map((log) => {
        return (
          <details key={log.hash}>
            <summary>{log.title} | {log.hash} | {log.date}</summary>
            <p dangerouslySetInnerHTML={{__html: log.diff}} />
          </details>
        );
      })}
    </>
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
