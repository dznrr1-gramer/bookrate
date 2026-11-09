import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import CatalogClient from "./catalog-client";

describe("BookRate catalog", () => {
  test("renders the catalog filters and loading state from the URL", () => {
    const markup = renderToStaticMarkup(
      createElement(CatalogClient, {
        initialQuery:
          "search=Laut&category=fiksi&minRating=4&sort=rating&page=2",
      }),
    );

    expect(markup).toContain("Jelajahi buku");
    expect(markup).toContain('value="Laut"');
    expect(markup).toContain('name="category"');
    expect(markup).toContain('value="fiksi"');
    expect(markup).toContain('value="4"');
    expect(markup).toContain("Memuat katalog...");
  });

  test("supports a shared category URL without a search query", () => {
    const markup = renderToStaticMarkup(
      createElement(CatalogClient, {
        initialQuery: "category=fiksi",
      }),
    );

    expect(markup).toContain('name="search"');
    expect(markup).toContain('value="fiksi"');
    expect(markup).toContain("Hapus filter");
  });
});
