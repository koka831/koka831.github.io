import remark from "remark";
import { Processor } from "unified";
import type { VFileCompatible } from "vfile";
import gfm from "remark-gfm";
import remark2rehype from "remark-rehype";
import stringify from "rehype-stringify";

import container, { REGEX_CUSTOM_CONTAINER } from "../lib/remark-container";

const compiler: Processor = remark().use(gfm).use(container).use(remark2rehype).use(stringify);

const process = async (contents: VFileCompatible): Promise<VFileCompatible> => {
  return compiler.process(contents).then((file) => file.contents);
};

describe("remark-container", () => {
  it("REGEX_CUSTOM_CONTAINER matches with custom container", () => {
    const input = "::: warn\ncontainer body\n:::";
    const match = input.match(REGEX_CUSTOM_CONTAINER);
    expect(match).not.toBeNull();

    if (!match) throw Error();
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const [_input, type, title, content] = match;
    /* eslint-enable @typescript-eslint/no-unused-vars */

    expect(type).toBe("warn");
    expect(title).toBe("");
    expect(content).toBe("container body");
  });

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
