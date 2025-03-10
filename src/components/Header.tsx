import Link from "next/link";
import styles from "./Header.module.css";

export const Header = () => (
  <nav className={styles.navigation__container}>
    <div className={styles.navigation}>
      <Link href="/">/var/log/koka</Link>
    </div>
    <div>
      <Link href="/archives">archive</Link>
    </div>
  </nav>
);
