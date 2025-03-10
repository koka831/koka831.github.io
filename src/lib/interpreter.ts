import emoji from "remark-emoji";
import externalLink from "rehype-external-links";
import gfm from "remark-gfm";
import headings from "rehype-autolink-headings";
import katex from "rehype-katex";
import math from "remark-math";
import prism from "remark-prism";
import { remark } from "remark";
import remarkParse from "remark-parse";
import remark2rehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import slug from "rehype-slug";
import stringify from "rehype-stringify";

import container from "remark-custom-container";
import caption from "./remark-image-caption";

const prismPlugins = ["autolinker", "command-line", "diff-highlight", "line-numbers"];

export const markdownToHtml = async (markdown: string): Promise<string> => {
  const result = await remark()
    .use(gfm)
    .use(math)
    .use(emoji)
    .use(container)
    .use(caption)
    .use(prism, { plugins: prismPlugins })
    .use(remarkParse)
    .use(remark2rehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(slug)
    .use(externalLink)
    .use(headings, { behavior: "wrap" })
    .use(katex)
    .use(stringify, { allowDangerousHtml: true })
    .process(markdown);

  return result.toString();
};
