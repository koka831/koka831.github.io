import React from "react";
import { GetStaticPaths } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import ErrorPage from "next/error";

import { Post, CommitLog } from "../../types";
import { getPosts, getPostBySlug } from "../../lib/api";
import getCommitLogs from "../../lib/commit-log";

import { Layout, TableOfContent } from "../../components";
import PostHeader from "../../components/post/header";
import styles from "./slug.module.scss";

type Props = {
 post: Post;
 logs: CommitLog[];
}

const Page: React.FC<Props> = ({ post, logs }: Props) => {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Layout>
      <Head>
        <meta property="title" content={post.title} />
        <meta property="og:title" content={post.title} />
      </Head>
      <div className={styles.container}>
        <div className={styles.article_container}>
          <article className={styles.article} role="article">
            <PostHeader
              title={post.title}
              tags={post.tags}
              date={post.date}
            />
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>
          <div className={styles.commit_logs} role="log">
            <Logs logs={logs} />
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

export const Logs: React.FC<LogProps> = ({ logs }: LogProps): JSX.Element => {
  return (
    <>
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
    logs: CommitLog[];
  }
}

export const getStaticProps = async ({ params }: Params): Promise<{ props: Props }>  => {
  const post = await getPostBySlug(params.slug);
  const logs = await getCommitLogs(params.slug);
  return {
    props: {
      post,
      logs
    }
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getPosts();

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
};

export default Page;
