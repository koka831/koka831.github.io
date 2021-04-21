import React from "react";
import Link from "next/link";
import styles from "./Header.module.scss";

const Header: React.VFC = () => (
  <nav className={styles.navigation__container}>
    <div className={styles.navigation}>
      <Link href="/">/var/log/koka</Link>
    </div>
    <div>
      <Link href="/archives">archive</Link>
    </div>
  </nav>
);

export default Header;
