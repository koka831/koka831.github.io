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

    /* eslint-disable @typescript-eslint/no-unused-vars */
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    const [_input, type, title, content] = match!;
    /* eslint-enable @typescript-eslint/no-unused-vars */
    /* eslint-enable @typescript-eslint/no-non-null-assertion */

    expect(type).toBe("warn");
    expect(title).toBe("");
    expect(content).toBe("container body");
  });

  it("REGEX_CUSTOM_CONTAINER matches with custom container with custom title", () => {
    const input = "::: warn custom title\ncontainer body\nsecond line body\n:::";
    const match = input.match(REGEX_CUSTOM_CONTAINER);
    expect(match).not.toBeNull();

    /* eslint-disable @typescript-eslint/no-unused-vars */
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    const [_input, type, title, content] = match!;
    /* eslint-enable @typescript-eslint/no-unused-vars */
    /* eslint-enable @typescript-eslint/no-non-null-assertion */

    expect(type).toBe("warn");
    expect(title).toBe("custom title");
    expect(content).toBe("container body\nsecond line body");
  });

  it("interprets custom container directives", async () => {
    const input = "::: warn\ncontainer body\n:::";
    const expected = "<p><div class=\"remark-container warn\">container body</div></p>";
    expect(await process(input)).toBe(expected);
  });

  it("interprets custom title after container directives", async () => {
    const input = "::: info custom title\ncontainer body\n:::";
    const expected = "<p><div class=\"remark-container info\"><div class=\"remark-container__title\">custom title</div>container body</div></p>";
    expect(await process(input)).toBe(expected);
  });

  // TODO
  xit("interprets custom container with multi-line contents", async () => {
    const input = "::: tip TODO\n" +
      "basic ([Bridge/ABC075](https://atcoder.jp/contests/abc075/tasks/abc075_c))\n" +
      "weighted(Potential) Union-Find ([People on a line/ABC087](https://atcoder.jp/contests/abc087/tasks/arc090_b))\n" +
      "永続UF ([Stamp Rally/AGC002](https://agc002.contest.atcoder.jp/tasks/agc002_d))\n" +
      "わからん ([Nuske vs Phantom Thnook/AGC015](https://agc015.contest.atcoder.jp/tasks/agc015_c))\n" +
      ":::";

    const expected = "<p>" +
      "<div class=\"remark-contaner tip\">" +
      "<div class=\"remark-container__title\">tip</div>" +
      "" +
      "</div></p>";

    expect(await process(input)).toBe(expected);
  });
});
