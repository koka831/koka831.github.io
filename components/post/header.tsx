import React from "react";
import styles from "./header.module.scss";
import Tag from "./tag";

type Props = {
  title: string;
  tags: string[];
  date: string;
}

const PostHeader = ({ title, tags, date }: Props): JSX.Element => {
  return (
    <header itemScope className={styles.header__container}>
      <h1 className={styles.post__title}>{title}</h1>
      <div className={styles.flex}>
        <div>
          <div className={styles.post__tags}>
            {tags.map((tag) => <Tag key={tag} name={tag}/>) }
          </div>
        </div>
        <time
          dateTime={date}
          itemProp="datePublished"
          className={styles.post__date}
        >
          published: {date}
        </time>
      </div>
    </header>
  );
};

export default PostHeader;
