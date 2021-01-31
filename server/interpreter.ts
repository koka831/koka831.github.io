import remark from "remark";
import headings from "remark-autolink-headings";
import html from "remark-html";
import math from "remark-math";
import prism from "remark-prism";
import slug from "remark-slug";
import remark2rehype from "remark-rehype";
import katex from "rehype-katex";
import stringify from "rehype-stringify";

const prismPlugins = [
  "autolinker",
  "diff-highlight",
  "line-numbers"
];

const markdownToHtml = async (markdown: string): Promise<string> => {
  const result = await remark()
    .use(html)
    .use(math)
    .use(prism, { plugins: prismPlugins, transformInlineCode: true })
    .use(slug)
    .use(headings, { behavior: "wrap" })
    .use(remark2rehype)
    .use(katex)
    .use(stringify)
    .process(markdown);

  return result.toString();
};

export default markdownToHtml;
