import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CircleNotch, CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { Container } from "./Container";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

type FormState = {
  nama: string;
  email: string;
  whatsapp: string;
  nim: string;
  asalKampus: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMPTY_FORM: FormState = {
  nama: "",
  email: "",
  whatsapp: "",
  nim: "",
  asalKampus: "",
};

export function Registration() {
  const reduce = useReducedMotion();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function validate(values: FormState): FormErrors {
    const next: FormErrors = {};
    if (!values.nama.trim()) next.nama = "Nama lengkap wajib diisi.";
    if (!values.email.trim()) {
      next.email = "Email wajib diisi.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = "Format email belum valid.";
    }
    if (!values.whatsapp.trim()) {
      next.whatsapp = "Nomor WhatsApp wajib diisi.";
    } else if (!/^[0-9+\s-]{9,15}$/.test(values.whatsapp)) {
      next.whatsapp = "Format nomor belum valid.";
    }
    if (!values.nim.trim()) next.nim = "NIM wajib diisi.";
    if (!values.asalKampus.trim()) next.asalKampus = "Asal kampus S1 wajib diisi.";
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validation = validate(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setStatus("submitting");
    setErrorMessage("");

    if (!supabase) {
      setStatus("error");
      setErrorMessage(
        "Formulir belum terhubung ke database. Hubungi panitia jika pesan ini masih muncul.",
      );
      return;
    }

    const { error } = await supabase.from("pendaftaran_python").insert({
      nama: form.nama.trim(),
      email: form.email.trim(),
      whatsapp: form.whatsapp.trim(),
      nim: form.nim.trim(),
      asal_kampus: form.asalKampus.trim(),
    });

    if (error) {
      setStatus("error");
      setErrorMessage("Pendaftaran gagal dikirim. Coba lagi dalam beberapa saat.");
      return;
    }

    setStatus("success");
  }

  function fieldClass(hasError: boolean) {
    return `w-full rounded-lg border bg-ink-900 px-4 py-3 text-sm text-ink-50 placeholder:text-ink-500 outline-none transition-colors focus:border-py-500 ${
      hasError ? "border-rose-400/70" : "border-ink-700"
    }`;
  }

  return (
    <section id="daftar" className="py-20 sm:py-28">
      <Container className="max-w-2xl">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border border-ink-800 bg-ink-900/60 p-7 sm:p-9"
        >
          {status === "success" ? (
            <div className="flex flex-col items-center py-10 text-center">
              <CheckCircle size={44} weight="fill" className="text-py-500" />
              <h2 className="mt-4 text-xl font-semibold text-ink-50">Pendaftaran diterima</h2>
              <p className="mt-2 max-w-[36ch] text-sm text-ink-300">
                Terima kasih, {form.nama.split(" ")[0]}. Informasi lokasi dan tautan grup akan dikirim ke {form.email} sebelum tanggal pelatihan.
              </p>
              <button
                type="button"
                onClick={() => {
                  setForm(EMPTY_FORM);
                  setErrors({});
                  setStatus("idle");
                }}
                className="mt-6 rounded-full border border-ink-700 px-5 py-2.5 text-sm font-medium text-ink-200 transition-colors hover:border-ink-500"
              >
                Daftarkan orang lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-ink-50">Formulir pendaftaran</h2>
                <p className="mt-1 text-sm text-ink-400">
                  Wajib diisi oleh seluruh mahasiswa baru S2 MTI Unhas.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <label htmlFor="nama" className="text-sm font-medium text-ink-200">
                    Nama lengkap
                  </label>
                  <input
                    id="nama"
                    type="text"
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    placeholder="Nama sesuai KTP"
                    className={fieldClass(!!errors.nama)}
                  />
                  {errors.nama && <p className="text-xs text-rose-300">{errors.nama}</p>}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="nim" className="text-sm font-medium text-ink-200">
                    NIM
                  </label>
                  <input
                    id="nim"
                    type="text"
                    value={form.nim}
                    onChange={(e) => setForm({ ...form, nim: e.target.value })}
                    placeholder="Nomor induk mahasiswa"
                    className={fieldClass(!!errors.nim)}
                  />
                  {errors.nim && <p className="text-xs text-rose-300">{errors.nim}</p>}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="asalKampus" className="text-sm font-medium text-ink-200">
                    Asal kampus S1
                  </label>
                  <input
                    id="asalKampus"
                    type="text"
                    value={form.asalKampus}
                    onChange={(e) => setForm({ ...form, asalKampus: e.target.value })}
                    placeholder="Contoh: Universitas Hasanuddin"
                    className={fieldClass(!!errors.asalKampus)}
                  />
                  {errors.asalKampus && (
                    <p className="text-xs text-rose-300">{errors.asalKampus}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-medium text-ink-200">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="nama@email.com"
                    className={fieldClass(!!errors.email)}
                  />
                  {errors.email && <p className="text-xs text-rose-300">{errors.email}</p>}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="whatsapp" className="text-sm font-medium text-ink-200">
                    Nomor WhatsApp
                  </label>
                  <input
                    id="whatsapp"
                    type="tel"
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    placeholder="08xx-xxxx-xxxx"
                    className={fieldClass(!!errors.whatsapp)}
                  />
                  {errors.whatsapp && <p className="text-xs text-rose-300">{errors.whatsapp}</p>}
                </div>
              </div>

              {status === "error" && (
                <div className="flex items-start gap-2 rounded-lg border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                  <WarningCircle size={18} weight="bold" className="mt-0.5 shrink-0" />
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-py-500 px-6 py-3.5 text-sm font-semibold text-oncontrast transition-transform hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {status === "submitting" ? (
                  <>
                    <CircleNotch size={16} weight="bold" className="animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Daftar Sekarang"
                )}
              </button>

              {!isSupabaseConfigured && (
                <p className="text-center text-xs text-ink-500">
                  Mode pratinjau: koneksi database belum dikonfigurasi.
                </p>
              )}
            </form>
          )}
        </motion.div>
      </Container>
    </section>
  );
}
