import React from "react";
import styles from "./PublishDate.module.scss";

type Props = {
  date?: string;
  children: React.ReactNode;
}

export const PublishDate: React.VFC<Props> = ({ date, children }: Props) => {
  return (
    <time
      dateTime={date}
      itemProp="datePublished"
      className={styles.post__date}
    >
      {children}
    </time>
  );
};

export default PublishDate;
