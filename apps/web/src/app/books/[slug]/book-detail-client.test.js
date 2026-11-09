import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import BookDetailClient from "./book-detail-client";

describe("BookRate book detail", () => {
  test("renders the detail loading state and a return path to the catalog", () => {
    const markup = renderToStaticMarkup(
      createElement(BookDetailClient, {
        slug: "laut-bercerita",
        initialQuery: "sort=rating&page=2",
      }),
    );

    expect(markup).toContain("Memuat detail buku...");
    expect(markup).toContain('href="/books"');
  });
});
