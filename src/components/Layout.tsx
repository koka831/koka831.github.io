import React from "react";
import { Header, Footer } from ".";

import styles from "./Layout.module.scss";

type Props = {
  children: React.ReactNode;
};

const Layout: React.VFC<Props> = ({ children }: Props) => (
  <>
    <Header />
    <main className={styles.container}>{children}</main>
    <Footer />
  </>
);

export default Layout;
