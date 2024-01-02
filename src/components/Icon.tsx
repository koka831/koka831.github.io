import React from "react";
import styles from "./Icon.module.css";

const Icon: React.VFC = () => {
  return (
    <div className={styles.icon__container}>
      <ul className={styles.icon}>
        <li className={styles.green} />
        <li />
        <li />
        <li />
        <li className={styles.green} />
      </ul>
      <ul className={styles.icon}>
        <li />
        <li className={styles.green} />
        <li className={styles.green} />
        <li className={styles.green} />
        <li />
      </ul>
      <ul className={styles.icon}>
        <li className={styles.green} />
        <li />
        <li />
        <li />
        <li className={styles.green} />
      </ul>
      <ul className={styles.icon}>
        <li className={styles.green} />
        <li className={styles.green} />
        <li className={styles.green} />
        <li className={styles.green} />
        <li className={styles.green} />
      </ul>
      <ul className={styles.icon}>
        <li />
        <li className={styles.green} />
        <li className={styles.green} />
        <li className={styles.green} />
        <li />
      </ul>
    </div>
  );
};

export default Icon;
