import { Suspense } from "react";
import { Feedback, SiteFooter, SiteHeader } from "@bookrate/ui";
import BookDetailClient from "./book-detail-client";

type SearchParams = Record<string, string | string[] | undefined>;

interface BookDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}

function BookDetailLoading() {
  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader />
      <main className="mx-auto min-h-[70vh] max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <Feedback status="loading" title="Memuat detail buku..." />
      </main>
      <SiteFooter />
    </div>
  );
}

async function BookDetailResults({
  params,
  searchParams,
}: BookDetailPageProps) {
  const [{ slug }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const query = new URLSearchParams();
  for (const key of ["sort", "direction", "page", "pageSize"]) {
    const value = resolvedSearchParams[key];
    if (typeof value === "string") {
      query.set(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, item));
    }
  }

  const initialQuery = query.toString();
  return (
    <BookDetailClient
      initialQuery={initialQuery}
      key={`${slug}?${initialQuery}`}
      slug={slug}
    />
  );
}

export default function BookDetailPage(props: BookDetailPageProps) {
  return (
    <Suspense fallback={<BookDetailLoading />}>
      <BookDetailResults
        params={props.params}
        searchParams={props.searchParams}
      />
    </Suspense>
  );
}
