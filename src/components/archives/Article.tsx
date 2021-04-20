import React from "react";
import Link from "next/link";

import type { Post } from "../../types";
import styles from "./Article.module.scss";
import { PublishDate, Tag } from ".";

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
      <PublishDate date={post.publishedAt}>
        published: {post.publishedAt}
      </PublishDate>
    </div>
  </section>
);

export default Article;
