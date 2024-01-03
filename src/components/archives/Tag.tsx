import React from "react";
import styles from "./Tag.module.css";

type Props = {
  name: string;
};

export const Tag = ({ name }: Props) => {
  return <p className={styles.tag}>{name}</p>;
};
