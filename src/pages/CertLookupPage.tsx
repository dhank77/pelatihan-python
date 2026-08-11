import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  IdentificationCard,
  ArrowRight,
  ArrowLeft,
  TerminalWindow,
} from "@phosphor-icons/react";

export function CertLookupPage() {
  const navigate = useNavigate();
  const [nim, setNim] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = nim.trim();
    if (!trimmed) {
      setError("NIM wajib diisi.");
      return;
    }
    navigate(`/cert/${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-ink-950 px-5 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-md">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-ink-400 transition-colors hover:text-ink-100"
        >
          <ArrowLeft size={16} weight="bold" />
          Kembali ke beranda
        </Link>

        <div className="rounded-2xl border border-ink-800 bg-ink-900/60 p-7 sm:p-9">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-py-500 text-oncontrast">
              <TerminalWindow size={18} weight="bold" />
            </span>
            <span className="font-semibold tracking-tight text-ink-50">
              Python MTI <span className="text-ink-400">Unhas</span>
            </span>
          </div>

          <h1 className="mt-6 text-xl font-semibold text-ink-50">Cek Sertifikat</h1>
          <p className="mt-1 text-sm text-ink-400">
            Masukkan NIM Anda untuk melihat dan mengunduh sertifikat Pelatihan Python
            Angkatan 14.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-1.5">
            <label htmlFor="nim" className="text-sm font-medium text-ink-200">
              NIM
            </label>
            <div className="relative">
              <IdentificationCard
                size={18}
                weight="bold"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-500"
              />
              <input
                id="nim"
                type="text"
                value={nim}
                onChange={(e) => {
                  setNim(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Contoh: H0212XXXX"
                className={`w-full rounded-lg border bg-ink-900 py-3 pl-11 pr-4 text-sm text-ink-50 placeholder:text-ink-500 outline-none transition-colors focus:border-py-500 ${
                  error ? "border-rose-400/70" : "border-ink-700"
                }`}
              />
            </div>
            {error && <p className="text-xs text-rose-300">{error}</p>}

            <button
              type="submit"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-py-500 px-6 py-3.5 text-sm font-semibold text-oncontrast transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Lihat Sertifikat
              <ArrowRight size={16} weight="bold" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
