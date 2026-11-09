import { BookOpen, Menu } from "lucide-react";

const navigation = [
  { href: "#katalog", label: "Jelajahi" },
  { href: "#pilihan", label: "Pilihan pembaca" },
  { href: "#tentang", label: "Tentang" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-page">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <a
          aria-label="BookRate, beranda"
          className="ui-focus-ring inline-flex shrink-0 items-center gap-2.5 rounded-lg"
          href="/"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-forest text-white">
            <BookOpen aria-hidden="true" className="size-5" />
          </span>
          <span className="text-xl font-semibold tracking-tight text-ink">
            bookrate
          </span>
        </a>

        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-7 text-sm font-medium text-muted md:flex"
        >
          {navigation.map((item) => (
            <a
              className="ui-focus-ring rounded-sm transition-colors hover:text-forest"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            className="ui-focus-ring hidden rounded-full px-3 py-2 text-sm font-medium text-ink hover:text-forest sm:inline-flex"
            href="#masuk"
          >
            Masuk
          </a>
          <a
            className="ui-focus-ring inline-flex min-h-11 items-center justify-center rounded-full bg-forest px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
            href="#daftar"
          >
            Gabung gratis
          </a>
          <details className="relative md:hidden">
            <summary
              aria-label="Buka navigasi"
              className="ui-focus-ring flex size-11 cursor-pointer list-none items-center justify-center rounded-full border border-border bg-surface text-ink [&::-webkit-details-marker]:hidden"
            >
              <Menu aria-hidden="true" className="size-5" />
            </summary>
            <nav
              aria-label="Navigasi seluler"
              className="absolute right-0 top-14 z-20 flex min-w-52 flex-col gap-1 rounded-2xl border border-border bg-surface p-2 shadow-lg"
            >
              {navigation.map((item) => (
                <a
                  className="ui-focus-ring rounded-xl px-3 py-2.5 text-sm text-ink hover:bg-surface-muted"
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </a>
              ))}
              <a
                className="ui-focus-ring rounded-xl px-3 py-2.5 text-sm text-ink hover:bg-surface-muted sm:hidden"
                href="#masuk"
              >
                Masuk
              </a>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
