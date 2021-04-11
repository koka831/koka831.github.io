import React from "react";
import Link from "next/link";
import styles from "./header.module.scss";

const Header = (): JSX.Element => (
  <nav className={styles.navigation}>
    <div className={styles.navigation__inner}>
      <Link href="/">/var/log/koka</Link>
    </div>
    <div>
      <Link href="/archives">archive</Link>
    </div>
  </nav>
);

export default Header;
