import { useState } from "react";
import { List, X, TerminalWindow } from "@phosphor-icons/react";
import { Container } from "./Container";
import { ThemeToggle } from "./ThemeToggle";

const LINKS = [
  { href: "#kurikulum", label: "Kurikulum" },
  { href: "#jadwal", label: "Jadwal" },
  { href: "#instruktur", label: "Pemateri" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-800/80 bg-ink-950/85 backdrop-blur-md">
      <Container>
        <nav className="flex h-16 items-center justify-between md:h-[72px]">
          <a href="#top" className="flex items-center gap-2.5 text-ink-50">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-py-500 text-oncontrast">
              <TerminalWindow size={18} weight="bold" />
            </span>
            <span className="font-semibold tracking-tight">
              Python MTI <span className="text-ink-400">Unhas</span>
            </span>
          </a>

          <div className="hidden items-center gap-8 lg:flex">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-ink-300 transition-colors hover:text-ink-50"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="#daftar"
              className="hidden rounded-full bg-py-500 px-5 py-2.5 text-sm font-semibold text-oncontrast transition-transform hover:-translate-y-0.5 active:scale-[0.98] sm:inline-flex"
            >
              Daftar Sekarang
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-ink-700 text-ink-100 lg:hidden"
              aria-label={open ? "Tutup menu" : "Buka menu"}
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <List size={20} />}
            </button>
          </div>
        </nav>
      </Container>

      {open && (
        <div className="border-t border-ink-800 bg-ink-950 lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-ink-200 hover:bg-ink-800"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#daftar"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-py-500 px-5 py-2.5 text-center text-sm font-semibold text-oncontrast"
            >
              Daftar Sekarang
            </a>
          </Container>
        </div>
      )}
    </header>
  );
}
