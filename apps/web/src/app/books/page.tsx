import { Suspense } from "react";
import { Feedback, SiteFooter, SiteHeader } from "@bookrate/ui";
import CatalogClient from "./catalog-client";

type CatalogSearchParams = Record<string, string | string[] | undefined>;

interface CatalogPageProps {
  searchParams: Promise<CatalogSearchParams>;
}

function CatalogLoading() {
  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader />
      <main className="mx-auto min-h-[70vh] max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <Feedback status="loading" title="Memuat katalog..." />
      </main>
      <SiteFooter />
    </div>
  );
}

async function CatalogResults({ searchParams }: CatalogPageProps) {
  const resolvedParams = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(resolvedParams)) {
    if (typeof value === "string") {
      query.set(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, item));
    }
  }

  const initialQuery = query.toString();
  return <CatalogClient initialQuery={initialQuery} key={initialQuery} />;
}

export default function CatalogPage(props: CatalogPageProps) {
  return (
    <Suspense fallback={<CatalogLoading />}>
      <CatalogResults searchParams={props.searchParams} />
    </Suspense>
  );
}
