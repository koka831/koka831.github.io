import styles from "./PublishDate.module.css";

type Props = {
  date?: string;
  children: React.ReactNode;
};

export const PublishDate = ({ date, children }: Props) => {
  return (
    <time dateTime={date} itemProp="datePublished" className={styles.post__date}>
      {children}
    </time>
  );
};
