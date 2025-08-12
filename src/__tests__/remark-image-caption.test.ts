import remarkParse from "remark-parse";
import { unified } from "unified";
import type { Compatible, VFileCompatible } from "vfile";
import gfm from "remark-gfm";
import remark2rehype from "remark-rehype";
import stringify from "rehype-stringify";

import caption from "../lib/remark-image-caption";

const compiler = unified()
  .use(remarkParse)
  .use(gfm)
  .use(caption)
  .use(remark2rehype)
  .use(stringify);

const process = async (
  contents?: Compatible | undefined,
): Promise<VFileCompatible> => {
  return compiler.process(contents).then((file) => file.value);
};

describe("remark-container", () => {
  it("interprets image with title", async () => {
    const input = '![image alt](/img/icon.png "caption text of image")';
    const expected =
      "<p>" +
      "<figure>" +
      '<img src="/img/icon.png" alt="image alt" title="caption text of image">' +
      "<figcaption>img.1 caption text of image</figcaption>" +
      "</figure>" +
      "</p>";
    expect(await process(input)).toBe(expected);
  });

  it("interprets image without title", async () => {
    const input = "![image alt](/img/icon.png)";
    const expected =
      '<p><figure><img src="/img/icon.png" alt="image alt"><figcaption>img.1 image alt</figcaption></figure></p>';
    expect(await process(input)).toBe(expected);
  });

  it("interprets images", async () => {
    const input = "![alt1](image.png)\n![alt2](image2.png)";
    const expected =
      "<p>" +
      '<figure><img src="image.png" alt="alt1">' +
      "<figcaption>img.1 alt1</figcaption>" +
      "</figure>\n" +
      "<figure>" +
      '<img src="image2.png" alt="alt2">' +
      "<figcaption>img.2 alt2</figcaption>" +
      "</figure>" +
      "</p>";
    expect(await process(input)).toBe(expected);
  });
});
