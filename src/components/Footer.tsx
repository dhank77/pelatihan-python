import { TerminalWindow, EnvelopeSimple, WhatsappLogo } from "@phosphor-icons/react";
import { Container } from "./Container";

const LINKS = [
  { href: "#kurikulum", label: "Kurikulum" },
  { href: "#jadwal", label: "Jadwal" },
  { href: "#instruktur", label: "Pemateri" },
  { href: "#faq", label: "FAQ" },
];

export function Footer() {
  return (
    <footer className="border-t border-ink-800">
      <Container className="py-12 sm:py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <a href="#top" className="flex items-center gap-2.5 text-ink-50">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-py-500 text-oncontrast">
                <TerminalWindow size={18} weight="bold" />
              </span>
              <span className="font-semibold tracking-tight">
                Python MTI <span className="text-ink-400">Unhas</span>
              </span>
            </a>
            <p className="mt-4 max-w-[36ch] text-sm leading-relaxed text-ink-400">
              Pelatihan Python untuk mahasiswa baru Magister Teknik Informatika, Universitas Hasanuddin. 15-16 Agustus 2026.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-ink-200">Halaman</p>
            <ul className="mt-4 space-y-2.5">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-ink-400 hover:text-ink-100">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-ink-200">Kontak panitia</p>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="mailto:panitia.python@mti.unhas.ac.id"
                  className="flex items-center gap-2 text-sm text-ink-400 hover:text-ink-100"
                >
                  <EnvelopeSimple size={16} />
                  panitia.python@mti.unhas.ac.id
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/6281234567890"
                  className="flex items-center gap-2 text-sm text-ink-400 hover:text-ink-100"
                >
                  <WhatsappLogo size={16} />
                  +62 812-3456-7890
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-ink-800 pt-6 text-xs text-ink-500">
          © 2026 Magister Teknik Informatika, Universitas Hasanuddin.
        </div>
      </Container>
    </footer>
  );
}
