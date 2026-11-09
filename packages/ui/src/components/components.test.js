import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Button } from "./button";
import { Feedback } from "./feedback";
import { Field } from "./field";
import { Rating } from "./rating";
import { SiteHeader } from "./site-header";

describe("shared UI components", () => {
  test("renders buttons with a safe default type and a visible focus style", () => {
    const markup = renderToStaticMarkup(createElement(Button, null, "Simpan"));

    expect(markup).toContain('type="button"');
    expect(markup).toContain("ui-focus-ring");
    expect(markup).toContain("Simpan");
  });

  test("associates a field label and validation message with its input", () => {
    const markup = renderToStaticMarkup(
      createElement(Field, {
        id: "email",
        label: "Alamat email",
        error: "Email tidak valid.",
        type: "email",
      }),
    );

    expect(markup).toContain('for="email">Alamat email</label>');
    expect(markup).toContain('aria-invalid="true"');
    expect(markup).toContain('aria-describedby="email-error"');
    expect(markup).toContain("Email tidak valid.");
  });

  test("exposes a rating as an accessible label", () => {
    const markup = renderToStaticMarkup(
      createElement(Rating, { value: 4.8, reviewCount: 12 }),
    );

    expect(markup).toContain('aria-label="Rating 4.8 dari 5 dari 12 ulasan"');
  });

  test("announces errors assertively and empty states politely", () => {
    const errorMarkup = renderToStaticMarkup(
      createElement(Feedback, { status: "error", title: "Gagal memuat" }),
    );
    const emptyMarkup = renderToStaticMarkup(
      createElement(Feedback, { status: "empty", title: "Belum ada buku" }),
    );

    expect(errorMarkup).toContain('role="alert"');
    expect(errorMarkup).toContain('aria-live="assertive"');
    expect(emptyMarkup).toContain('role="status"');
    expect(emptyMarkup).toContain('aria-live="polite"');
  });

  test("provides a keyboard-operable mobile navigation disclosure", () => {
    const markup = renderToStaticMarkup(createElement(SiteHeader));

    expect(markup).toContain("<details");
    expect(markup).toContain("<summary");
    expect(markup).toContain('aria-label="Navigasi seluler"');
  });
});
