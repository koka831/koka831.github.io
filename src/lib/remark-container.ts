import type { Node, Parent } from "unist";
import visit from "unist-util-visit";
import { Settings, Processor, Transformer } from "unified";

export const REGEX_CUSTOM_CONTAINER = /:::\s*(\w+)\s*(.*?)[\n\r](.*?)[\n\r]\s*:::/;
const DEFAULT_SETTINGS: Settings = {
  className: "remark-container",
  containerTag: "div",
};

function plugin(this: Processor<Settings>, options?: Settings): Transformer {
  const settings = Object.assign({}, DEFAULT_SETTINGS, options);

  const transformer: Transformer = (tree: Node): void => {
    visit(tree, (node: Node, index: number, parent: Parent | undefined): void => {
      if (typeof node.value !== "string") return;

      const match = node.value.match(REGEX_CUSTOM_CONTAINER);
      if (!match) return;

      // note title may be null
      /* eslint-disable @typescript-eslint/no-unused-vars */
      const [_input, type, title, content] = match;
      /* eslint-enable @typescript-eslint/no-unused-vars */

      const children = [];

      if (title.length > 0) {
        children.push({
          type: "container",
          children: [
            { type: "text", value: title.trim(), },
          ],
          data: {
            hName: "div",
            hProperties: { className: [`${settings.className}__title`] },
          }
        });
      }

      children.push({
        type: "text",
        value: content.trim(),
      });

      const container: Node = {
        type: "container",
        children,
        data: {
          hName: settings.containerTag,
          hProperties: {
            className: [settings.className, type.toLowerCase()],
          },
        },
      };

      if (!parent) return;

      parent.children[index] = container;
    });
  };

  return transformer;
}

export default plugin;
