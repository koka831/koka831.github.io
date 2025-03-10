import { Header, Footer } from ".";

import styles from "./Layout.module.css";

type Props = {
  children: React.ReactNode;
};

export const Layout = ({ children }: Props) => (
  <>
    <Header />
    <main className={styles.container}>{children}</main>
    <Footer />
  </>
);
