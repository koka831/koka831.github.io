import remark from "remark";
import html from "remark-html";
import prism from "remark-prism";

const markdownToHtml = async (markdown: string): Promise<string> => {
  const result = await remark()
    .use(html)
    .use(prism)
    .process(markdown);

  return result.toString();
};

export default markdownToHtml;
