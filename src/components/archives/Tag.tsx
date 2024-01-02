import React from "react";
import styles from "./Tag.module.css";

type Props = {
  name: string;
};

export const Tag: React.VFC<Props> = ({ name }: Props) => {
  return <p className={styles.tag}>{name}</p>;
};

export default Tag;
