import React from "react";
import styles from "./footer.module.scss";

const Footer = (): JSX.Element => (
  <footer className={styles.footer}>
    <small>
      Code snippets licensed under MIT, unless otherwise noted.
    </small>
  </footer>
);

export default Footer;
