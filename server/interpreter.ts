import remark from "remark";
import html from "remark-html";
import prism from "remark-prism";

const prismPlugins = [
  "autolinker",
  "diff-highlight",
  "line-numbers"
];

const markdownToHtml = async (markdown: string): Promise<string> => {
  const result = await remark()
    .use(html)
    .use(prism, { plugins: prismPlugins })
    .process(markdown);

  return result.toString();
};

export default markdownToHtml;
