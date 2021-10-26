import type { Node, Parent } from "unist";
import { visit } from "unist-util-visit";
import { Processor, Transformer } from "unified";

function plugin(this: Processor): Transformer {
  const transformer: Transformer = (tree: Node): void => {
    // for figure index
    let count = 0;
    visit(
      tree,
      (node: Node, index: number | null, parent: Parent | undefined): void => {
        if (node.type !== "image") return;
        if (!parent) return;
        if (!index) return;

        count += 1;

        parent.children[index] = {
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
                  value: `img.${count} ${node.title || node.alt}`,
                },
              ],
            },
          ],
        };
      }
    );
  };

  return transformer;
}

export default plugin;
