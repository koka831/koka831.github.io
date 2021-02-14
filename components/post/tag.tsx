import React from "react";
import styles from "./tag.module.scss";

type Props = {
  name: string;
}

const Tag: React.FC<Props> = ({ name }: Props) => {
  return (
    <>
      <p className={styles.tag}>{name}</p>
    </>
  );
};

export default Tag;
