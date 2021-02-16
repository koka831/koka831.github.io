import React from "react";
import { AppProps } from "next/app";

import "../../node_modules/modern-normalize/modern-normalize.css";
import "../styles/globals.scss";
import "../styles/prism-gruvbox.scss";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return <Component {...pageProps} />;
}

export default MyApp;
