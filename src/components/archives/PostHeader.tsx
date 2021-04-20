import React from "react";
import styles from "./PostHeader.module.scss";
import { PublishDate, Tag } from ".";

type Props = {
  title: string;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
}

const PostHeader: React.VFC<Props> = ({ title, tags, publishedAt, updatedAt }: Props) => {
  return (
    <header itemScope className={styles.header__container}>
      <h1 className={styles.post__title}>{title}</h1>
      <div className={styles.flex}>
        <div>
          <div className={styles.post__tags}>
            {tags.map((tag) => <Tag key={tag} name={tag}/>) }
          </div>
        </div>
        <div className={styles.post__dates}>
          <PublishDate date={publishedAt}>published: {publishedAt}</PublishDate>
          <PublishDate date={updatedAt}>
            { updatedAt ? `update: ${updatedAt}` : "" }
          </PublishDate>
        </div>
      </div>
    </header>
  );
};

export default PostHeader;
