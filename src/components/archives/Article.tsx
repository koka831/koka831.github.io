import React from "react";
import Link from "next/link";

import type { Post } from "../../types";

import { Tag } from ".";
import styles from "./Article.module.scss";

type Props = {
  post: Post;
}

const Article: React.VFC<Props> = ({ post }: Props) => (
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

export default Article;
