import React from "react";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags } from "@fortawesome/free-solid-svg-icons";

import styles from "./ArticleHeader.module.css";
import { PublishDate, Tag } from ".";

type Props = {
  title: string;
  description: string;
  slug: string;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
};

const PostHeader: React.VFC<Props> = ({
  title,
  description,
  slug,
  tags,
  publishedAt,
  updatedAt,
}: Props) => {
  return (
    <div itemScope className={styles.header__container}>
      <Link
        as={`/archives/${slug}`}
        className={styles.post__title}
        href="/archives/[slug]"
      >
        {title}
      </Link>
      <p>{description}</p>
      <div className={styles.flex}>
        <div className={styles.post__tags}>
          <FontAwesomeIcon icon={faTags} className={styles.tags__icon} />
          {tags.map((tag) => (
            <Tag key={tag} name={tag} />
          ))}
        </div>
        <div className={styles.post__dates}>
          <PublishDate date={publishedAt}>published: {publishedAt}</PublishDate>
          <PublishDate date={updatedAt}>
            {updatedAt !== "-" && updatedAt !== publishedAt
              ? `updated: ${updatedAt}`
              : ""}
          </PublishDate>
        </div>
      </div>
    </div>
  );
};

export default PostHeader;
