export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-page">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <a
          className="ui-focus-ring w-fit rounded-sm font-semibold tracking-tight text-ink"
          href="/"
        >
          bookrate
        </a>
        <p>Tempat cerita tentang buku bertemu.</p>
        <p>© BookRate</p>
      </div>
    </footer>
  );
}
