import remark from "remark";
import { Processor } from "unified";
import type { VFileCompatible } from "vfile";
import gfm from "remark-gfm";
import remark2rehype from "remark-rehype";
import stringify from "rehype-stringify";

import container from "../lib/remark-container";

const compiler: Processor = remark().use(gfm).use(container).use(remark2rehype).use(stringify);

const process = async (contents: VFileCompatible): Promise<VFileCompatible> => {
  return compiler.process(contents).then((file) => file.contents);
};

describe("remark-container", () => {
  it("interprets custom container directives", async () => {
    const input = "::: warn\ncontainer body\n:::";
    const expected = "<p><div class=\"remark-container warn\"><div class=\"remark-container__title\"></div>container body</div></p>";
    expect(await process(input)).toBe(expected);
  });

  it("interprets custom title after container directives", async () => {
    const input = "::: info custom title\ncontainer body\n:::";
    const expected = "<p><div class=\"remark-container info\"><div class=\"remark-container__title\">custom title</div>container body</div></p>";
    expect(await process(input)).toBe(expected);
  });
});
