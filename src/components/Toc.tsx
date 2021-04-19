import React, { useEffect, useState } from "react";
import throttle from "../lib/throttle";

import styles from "./Toc.module.scss";
import "./Toc.module.scss";

type ElementLikeObject = HTMLElement | Element;

const accumulateOffset = (e: ElementLikeObject | null) => {
  let offset = 0;
  while (e instanceof HTMLElement) {
    offset += e.offsetTop - e.scrollTop + e.clientTop;
    e = e.offsetParent;
  }
  return offset;
};

type Headings = {
  titles: { title: string, depth: number }[];
  nodes: HTMLElement[];
  minDepth: number;
}

const TableOfContent: React.VFC = () => {
  const [headings, setHeadings] = useState<Headings>({ titles: [], nodes: [], minDepth: 0 });
  const [active, setActive] = useState<number>();

  const onClickHeading = (ev: React.MouseEvent, index: number) => {
    ev.preventDefault();
    headings.nodes[index].scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const selector = ["h1", "h2", "h3", "h4"].join(",");
    const nodes: HTMLElement[] = Array.from(document.querySelectorAll(selector));
    const titles = nodes.map((n) => ({
      title: n.innerText,
      depth: Number(n.nodeName[1])
    }));

    const minDepth = Math.min(...titles.map(h => h.depth));
    setHeadings({ titles, nodes, minDepth });
  }, []);

  useEffect(() => {
    const scrollHandler = throttle(() => {
      const { titles, nodes } = headings;
      const offsets = nodes.map((e) => accumulateOffset(e));
      const activeIndex = offsets.findIndex(offset => offset > window.scrollY);
      setActive(activeIndex === -1 ? titles.length - 1 : activeIndex - 1);
    });

    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [headings]);

  return (
    <nav className={styles.toc__nav} role="navigation">
      <ul className={styles.toc}>
        {headings.titles.map(({ title, depth }, index) => (
          <TocTitle
            key={title?.replace(/ /g, "_")}
            title={title}
            depth={depth}
            active={active === index}
            onClick={ev => onClickHeading(ev, index)}
          />
        ))}
      </ul>
    </nav>
  );
};

type TocProps = {
  title: string;
  depth: number;
  active: boolean;
  onClick: React.MouseEventHandler;
}

const TocTitle: React.VFC<TocProps> = ({ title, depth, active, onClick }: TocProps) => {
  const head = `toc__h${depth}`;
  return (
    <li
      onClick={onClick}
      className={`
        ${active ? styles.toc__active : ""}
        ${styles[head]}
        `}>
      {title}
    </li>
  );
};

export default TableOfContent;
