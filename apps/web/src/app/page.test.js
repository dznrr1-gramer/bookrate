import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Home from "./page";

describe("BookRate homepage", () => {
  test("renders the product introduction and book discovery interface", () => {
    const markup = renderToStaticMarkup(createElement(Home));

    expect(markup).toContain("BookRate");
    expect(markup).toContain("Setiap buku punya");
    expect(markup).toContain("Cari bacaan yang pas.");
    expect(markup).toContain('aria-label="Cari buku"');
    expect(markup).toContain('action="/books"');
    expect(markup).toContain('name="search"');
    expect(markup).toContain("Memuat katalog...");
  });
});
