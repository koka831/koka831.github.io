import remark from "remark";
import { Processor } from "unified";
import type { VFileCompatible } from "vfile";
import gfm from "remark-gfm";
import remark2rehype from "remark-rehype";
import stringify from "rehype-stringify";

import caption from "../lib/remark-image-caption";

const compiler: Processor = remark().use(gfm).use(caption).use(remark2rehype).use(stringify);

const process = async (contents: VFileCompatible): Promise<VFileCompatible> => {
  return compiler.process(contents).then((file) => file.contents);
};

describe("remark-container", () => {
  it("interprets image with title", async () => {
    const input = "![image alt](/img/icon.png \"caption text of image\")";
    const expected = "<p><figure><img src=\"/img/icon.png\" alt=\"image alt\" title=\"caption text of image\"><figcaption>caption text of image</figcaption></figure></p>";
    expect(await process(input)).toBe(expected);
  });

  it("interprets image without title", async () => {
    const input = "![image alt](/img/icon.png)";
    const expected = "<p><figure><img src=\"/img/icon.png\" alt=\"image alt\"><figcaption>image alt</figcaption></figure></p>";
    expect(await process(input)).toBe(expected);
  });
});
