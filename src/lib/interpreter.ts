import remark from "remark";
import headings from "remark-autolink-headings";
import gfm from "remark-gfm";
import emoji from "remark-emoji";
import footnotes from "remark-footnotes";
import math from "remark-math";
import prism from "remark-prism";
import slug from "remark-slug";
import remark2rehype from "remark-rehype";
import katex from "rehype-katex";
import stringify from "rehype-stringify";

const prismPlugins = [
  "autolinker",
  "command-line",
  "diff-highlight",
  "line-numbers"
];

const markdownToHtml = async (markdown: string): Promise<string> => {
  const result = await remark()
    .use(gfm)
    .use(math)
    .use(emoji)
    .use(prism, { plugins: prismPlugins, transformInlineCode: true })
    .use(slug)
    .use(headings, { behavior: "wrap" })
    .use(footnotes)
    .use(remark2rehype)
    .use(katex)
    .use(stringify)
    .process(markdown);

  return result.toString();
};

export default markdownToHtml;
