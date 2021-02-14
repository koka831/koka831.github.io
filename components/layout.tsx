import React from "react";
import { Header, Footer } from "./";

import styles from "./layout.module.scss";

type Props = {
  children: React.ReactNode;
}

const Layout = ({ children }: Props): JSX.Element => (
  <>
    <Header />
    <main className={styles.container}>
      {children}
    </main>
    <Footer />
  </>
);

export default Layout;
