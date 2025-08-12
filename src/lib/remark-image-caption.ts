import type { Node, Parent } from "unist";
import type { Image } from "mdast";
import { visit } from "unist-util-visit";
import type { Processor, Transformer } from "unified";

function plugin(this: Processor): Transformer {
  const transformer: Transformer = (tree: Node): void => {
    // for figure index
    let count = 0;
    visit(
      tree,
      (
        node: Node,
        index: number | undefined,
        parent: Parent | undefined,
      ): void => {
        if (node.type !== "image") return;
        if (!parent) return;

        const imageNode = node as Image;

        count += 1;

        parent.children[index ?? 0] = {
          type: "figure",
          data: { hName: "figure" },
          children: [
            { ...node },
            {
              type: "figcaption",
              data: { hName: "figcaption" },
              children: [
                {
                  type: "text",
                  value: `img.${count} ${imageNode.title || imageNode.alt}`,
                },
              ],
            },
          ],
        } as Parent;
      },
    );
  };

  return transformer;
}

export default plugin;
