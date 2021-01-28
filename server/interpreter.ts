import remark from "remark";
import headings from "remark-autolink-headings";
import html from "remark-html";
import prism from "remark-prism";
import slug from "remark-slug";

const prismPlugins = [
  "autolinker",
  "diff-highlight",
  "line-numbers"
];

const markdownToHtml = async (markdown: string): Promise<string> => {
  const result = await remark()
    .use(html)
    .use(prism, { plugins: prismPlugins })
    .use(slug)
    .use(headings, { behavior: "wrap" })
    .process(markdown);

  return result.toString();
};

export default markdownToHtml;
