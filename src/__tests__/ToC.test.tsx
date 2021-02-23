/**
 * @jest-environment jsdom
 */
import React from "react";
import { render } from "@testing-library/react";
import { TableOfContent } from "../components";

const MockPage: React.FC = () => {
  return (
    <>
      <article>
        <h1>H1 Heading</h1>
        <h2>H2 Heading</h2>
      </article>
      <TableOfContent />
    </>
  );
};

it("contains headings", () => {
  expect(TableOfContent).toBeTruthy();
});

it("contains headings", () => {
  const { container } = render(<MockPage />);
  expect(container).toHaveTextContent("H1 Heading");
  expect(container).toHaveTextContent("H2 Heading");
});
