import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  DownloadSimple,
  SealCheck,
  CircleNotch,
  WarningCircle,
  ArrowLeft,
} from "@phosphor-icons/react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

type CertData = { nama: string; nim: string };
type Status = "loading" | "found" | "not-found" | "error";

export function CertificatePage() {
  const { nim } = useParams<{ nim: string }>();
  const [status, setStatus] = useState<Status>("loading");
  const [data, setData] = useState<CertData | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!nim) {
      setStatus("not-found");
      return;
    }
    if (!supabase) {
      setStatus("error");
      return;
    }

    let cancelled = false;
    setStatus("loading");

    supabase
      .rpc("get_certificate", { p_nim: nim })
      .then(({ data: rows, error }) => {
        if (cancelled) return;
        if (error || !rows || rows.length === 0) {
          setStatus(error ? "error" : "not-found");
          return;
        }
        setData({ nama: rows[0].nama, nim: rows[0].nim });
        setStatus("found");
      });

    return () => {
      cancelled = true;
    };
  }, [nim]);

  useEffect(() => {
    if (data) document.title = `Sertifikat ${data.nama} - Python MTI Unhas`;
  }, [data]);

  async function handleDownload() {
    if (!certRef.current || !data) return;
    setDownloading(true);
    setDownloadError(false);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(certRef.current, {
        scale: 3,
        backgroundColor: "#fdfbf2",
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`Sertifikat-${data.nim}-${data.nama.replace(/\s+/g, "-")}.pdf`);
    } catch (err) {
      console.error("[CertificatePage] failed to generate PDF:", err);
      setDownloadError(true);
    } finally {
      setDownloading(false);
    }
  }

  const certNumber = data ? `PY14/${data.nim}` : "";

  return (
    <div className="min-h-[100dvh] bg-ink-950 px-5 py-10 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-ink-400 transition-colors hover:text-ink-100"
        >
          <ArrowLeft size={16} weight="bold" />
          Kembali ke beranda
        </Link>

        {status === "loading" && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-ink-800 bg-ink-900/60 py-24 text-center">
            <CircleNotch size={32} weight="bold" className="animate-spin text-py-500" />
            <p className="mt-4 text-sm text-ink-300">Mencari sertifikat...</p>
          </div>
        )}

        {status === "not-found" && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-ink-800 bg-ink-900/60 py-24 text-center">
            <WarningCircle size={32} weight="bold" className="text-rose-300" />
            <h1 className="mt-4 text-lg font-semibold text-ink-50">
              Sertifikat tidak ditemukan
            </h1>
            <p className="mt-2 max-w-[40ch] text-sm text-ink-400">
              NIM <span className="font-mono text-ink-200">{nim}</span> belum terdaftar. Pastikan
              tautan yang Anda buka benar, atau hubungi panitia.
            </p>
            <Link
              to="/cert"
              className="mt-6 rounded-full border border-ink-700 px-5 py-2.5 text-sm font-medium text-ink-200 transition-colors hover:border-ink-500"
            >
              Coba NIM lain
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-ink-800 bg-ink-900/60 py-24 text-center">
            <WarningCircle size={32} weight="bold" className="text-rose-300" />
            <h1 className="mt-4 text-lg font-semibold text-ink-50">Terjadi kesalahan</h1>
            <p className="mt-2 max-w-[40ch] text-sm text-ink-400">
              {isSupabaseConfigured
                ? "Gagal memuat data sertifikat. Coba muat ulang halaman."
                : "Sistem sertifikat belum terhubung ke database."}
            </p>
          </div>
        )}

        {status === "found" && data && (
          <>
            <div
              ref={certRef}
              className="relative overflow-hidden rounded-lg border-[3px] border-py-600 bg-[#fdfbf2] p-3 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] sm:p-4"
            >
              <div
                className="relative rounded-sm px-8 py-10 sm:px-14 sm:py-14"
                style={{ border: "1px solid #e8cf8f" }}
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-14 w-14 border-l-2 border-t-2 border-py-600"
                />
                <span
                  aria-hidden
                  className="absolute right-0 top-0 h-14 w-14 border-r-2 border-t-2 border-py-600"
                />
                <span
                  aria-hidden
                  className="absolute bottom-0 left-0 h-14 w-14 border-b-2 border-l-2 border-py-600"
                />
                <span
                  aria-hidden
                  className="absolute bottom-0 right-0 h-14 w-14 border-b-2 border-r-2 border-py-600"
                />

                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center gap-2 text-[#8a6a1a]">
                    <SealCheck size={22} weight="fill" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                      Python MTI Unhas
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-[#8a7a55]">
                    Magister Teknik Informatika, Universitas Hasanuddin
                  </p>

                  <h1
                    className="mt-8 text-3xl font-semibold uppercase tracking-[0.15em] text-[#2a2114] sm:text-4xl"
                    style={{ fontFamily: "'EB Garamond', serif" }}
                  >
                    Sertifikat
                  </h1>
                  <p className="mt-1 text-xs uppercase tracking-[0.3em] text-[#8a6a1a]">
                    Pelatihan Python &middot; Angkatan 14
                  </p>

                  <p className="mt-8 text-sm text-[#5a4f3a]">Diberikan kepada</p>
                  <p
                    className="mt-2 max-w-[26ch] text-3xl font-bold text-[#2a2114] sm:text-4xl"
                    style={{ fontFamily: "'EB Garamond', serif" }}
                  >
                    {data.nama}
                  </p>
                  <p className="mt-2 font-mono text-sm text-[#5a4f3a]">NIM {data.nim}</p>

                  <p className="mt-8 max-w-[60ch] text-sm leading-relaxed text-[#4a4030]">
                    Atas partisipasi aktif dalam Pelatihan Python Angkatan 14 yang
                    diselenggarakan oleh Magister Teknik Informatika, Universitas Hasanuddin,
                    pada 15-16 Agustus 2026.
                  </p>

                  <div className="mt-10 flex w-full items-end justify-between gap-6 text-left">
                    <div>
                      <p className="font-mono text-[11px] text-[#8a7a55]">No. Sertifikat</p>
                      <p className="font-mono text-xs text-[#4a4030]">{certNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-[#8a7a55]">Sabtu-Ahad</p>
                      <p className="text-xs text-[#4a4030]">15-16 Agustus 2026</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center gap-2 rounded-full bg-py-500 px-6 py-3.5 text-sm font-semibold text-oncontrast transition-transform hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {downloading ? (
                  <>
                    <CircleNotch size={16} weight="bold" className="animate-spin" />
                    Menyiapkan PDF...
                  </>
                ) : (
                  <>
                    <DownloadSimple size={16} weight="bold" />
                    Download Sertifikat
                  </>
                )}
              </button>
            </div>
            {downloadError && (
              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-rose-300">
                <WarningCircle size={14} weight="bold" />
                Gagal membuat file PDF. Coba lagi dalam beberapa saat.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
