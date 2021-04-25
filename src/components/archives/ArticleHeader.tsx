import React from "react";
import Link from "next/link";

import styles from "./ArticleHeader.module.scss";
import { PublishDate, Tag } from ".";

type Props = {
  title: string;
  description: string;
  slug: string;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
}

const PostHeader: React.VFC<Props> = ({ title, description, slug, tags, publishedAt, updatedAt }: Props) => {
  return (
    <div itemScope className={styles.header__container}>
      <Link as={`/archives/${slug}`} href="/archives/[slug]">
        <a className={styles.post__title}>{title}</a>
      </Link>
      <p>{description}</p>
      <div className={styles.flex}>
        <div className={styles.post__tags}>
          {tags.map((tag) => <Tag key={tag} name={tag}/>) }
        </div>
        <div className={styles.post__dates}>
          <PublishDate date={publishedAt}>published: {publishedAt}</PublishDate>
          <PublishDate date={updatedAt}>
            { updatedAt ? `updated: ${updatedAt}` : "" }
          </PublishDate>
        </div>
      </div>
    </div>
  );
};

export default PostHeader;
