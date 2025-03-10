import Head from "next/head";
import type { AppProps } from "next/app";

import * as CONST from "../lib/const";

import "../../node_modules/modern-normalize/modern-normalize.css";
import "../styles/variable.css";
import "../styles/style.css";
import "prismjs/plugins/command-line/prism-command-line.css";
import "../styles/prism-gruvbox.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const url = CONST.HOMEPAGE_URL;
  const title = CONST.HOMEPAGE_TITLE;
  const description = CONST.HOMEPAGE_DESCRIPTION;

  return (
    <>
      <Head>
        <title>/var/log/koka</title>
        <meta key="title" name="title" content={title} />
        <meta key="description" name="description" content={description} />
        <meta key="theme-color" name="theme-color" content="#ddd4bb" />
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:title" property="og:title" content={title} />
        <meta key="og:url" property="og:url" content={url} />
        <meta key="og:description" property="og:description" content={description} />
        <meta key="og:site_name" property="og:site_name" content={title} />
        <meta key="og:image" property="og:image" content={`${url}/img/icon.png`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:site" content="@k_0ka" />
        <meta name="twitter:description" content={description} />
        <link rel="alternate" type="application/rss+xml" href={`${url}/feed.xml`} title="/var/log/koka RSS2.0" />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
