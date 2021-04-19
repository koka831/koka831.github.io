import React from "react";
import styles from "./PostHeader.module.scss";
import Tag from "./Tag";
import PublishDate from "./PublishDate";

type Props = {
  title: string;
  tags: string[];
  published_at: string;
  updated_at?: string;
}

const PostHeader: React.VFC<Props> = ({ title, tags, published_at, updated_at }: Props) => {
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
          <PublishDate date={published_at}>published: {published_at}</PublishDate>
          <PublishDate date={updated_at}>
            { updated_at ? `update: ${updated_at}` : "" }
          </PublishDate>
        </div>
      </div>
    </header>
  );
};

export default PostHeader;
