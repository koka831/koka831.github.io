import React from "react";
import { AppProps } from "next/app";

import "../styles/globals.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "../styles/prism-gruvbox.css";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return <Component {...pageProps} />;
}

export default MyApp;
