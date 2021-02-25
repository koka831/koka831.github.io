import React from "react";
import Document, { Head, Html, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  // set meta tags in _app.tsx
  // @see https://github.com/vercel/next.js/blob/canary/errors/no-document-viewport-meta.md
  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
