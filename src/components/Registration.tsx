import { useState, useRef, type FormEvent } from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import {
  CircleNotch,
  CheckCircle,
  WarningCircle,
  Sparkle,
  WhatsappLogo,
} from "@phosphor-icons/react";
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

const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/Esrk1c4j0UO4x6m3HcnyUH";

const EMPTY_FORM: FormState = {
  nama: "",
  email: "",
  whatsapp: "",
  nim: "",
  asalKampus: "",
};

/** Glowing input that pulses yellow on focus */
function GlowInput({
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  hasError,
}: {
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  hasError: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      {/* Glow layer */}
      <div
        className="pointer-events-none absolute inset-0 rounded-lg transition-opacity duration-300"
        style={{
          opacity: focused ? 1 : 0,
          boxShadow: hasError
            ? "0 0 0 3px rgba(251,113,133,0.18), 0 0 18px 4px rgba(251,113,133,0.08)"
            : "0 0 0 3px rgba(246,206,62,0.22), 0 0 18px 4px rgba(246,206,62,0.10)",
        }}
      />
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className={`w-full rounded-lg border bg-ink-900 px-4 py-3 text-sm text-ink-50 placeholder:text-ink-500 outline-none transition-colors ${
          hasError
            ? "border-rose-400/70"
            : focused
            ? "border-py-500/70"
            : "border-ink-700"
        }`}
      />
    </div>
  );
}

/** Animated floating background orbs */
function FloatingOrbs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Top-left gold blob */}
      <motion.div
        className="absolute -left-32 -top-32 h-96 w-96 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(246,206,62,0.07) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{ x: [0, 18, -8, 0], y: [0, -12, 16, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Bottom-right blue blob */}
      <motion.div
        className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(75,139,214,0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{ x: [0, -14, 10, 0], y: [0, 10, -14, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      {/* Center accent */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(246,206,62,0.03) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 6 }}
      />
    </div>
  );
}

/** Success confetti particles */
function SuccessParticles() {
  const particles = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full"
          style={{
            left: `${15 + (i % 6) * 14}%`,
            top: "40%",
            background: i % 3 === 0 ? "#f6ce3e" : i % 3 === 1 ? "#4b8bd6" : "#ffffff",
          }}
          initial={{ y: 0, opacity: 1, scale: 1 }}
          animate={{
            y: [0, -(60 + Math.random() * 80)],
            x: [(i % 2 === 0 ? 1 : -1) * (20 + Math.random() * 40)],
            opacity: [1, 1, 0],
            scale: [1, 1.2, 0],
          }}
          transition={{
            duration: 1.2 + Math.random() * 0.6,
            delay: Math.random() * 0.4,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

export function Registration() {
  const reduce = useReducedMotion();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showParticles, setShowParticles] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

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
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 2000);
  }

  return (
    <section id="daftar" className="relative py-20 sm:py-28">
      {/* Floating background orbs */}
      {!reduce && <FloatingOrbs />}

      <Container className="max-w-2xl">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-2xl border border-ink-800 bg-ink-900/60 p-7 sm:p-9"
          style={{
            boxShadow: "0 0 60px -20px rgba(246,206,62,0.08), 0 0 0 1px rgba(246,206,62,0.04)",
          }}
        >
          {/* Subtle top edge shimmer */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(246,206,62,0.4) 50%, transparent 100%)",
            }}
          />

          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex flex-col items-center py-10 text-center"
              >
                {/* Confetti */}
                {showParticles && !reduce && <SuccessParticles />}

                {/* Pulsing check icon */}
                <motion.div
                  animate={reduce ? {} : { scale: [1, 1.08, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-py-500/10">
                    <div className="absolute inset-0 rounded-full bg-py-500/5 blur-md" />
                    <CheckCircle size={44} weight="fill" className="relative text-py-500" />
                  </div>
                </motion.div>

                <h2 className="mt-4 text-xl font-semibold text-ink-50">Pendaftaran diterima</h2>
                <p className="mt-2 max-w-[36ch] text-sm text-ink-300">
                  Terima kasih, {form.nama.split(" ")[0]}. Informasi lokasi pelatihan akan
                  dikirim ke {form.email} sebelum tanggal pelatihan.
                </p>

                <a
                  href={WHATSAPP_GROUP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-[#0b1a0f] transition-transform hover:scale-[1.02]"
                >
                  <WhatsappLogo size={20} weight="fill" />
                  Gabung Grup WhatsApp
                </a>
                <p className="mt-2 text-xs text-ink-500">
                  Wajib bergabung untuk info terbaru seputar pelatihan.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setForm(EMPTY_FORM);
                    setErrors({});
                    setStatus("idle");
                  }}
                  className="mt-4 rounded-full border border-ink-700 px-5 py-2.5 text-sm font-medium text-ink-200 transition-colors hover:border-ink-500"
                >
                  Daftarkan orang lain
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                noValidate
                className="space-y-5"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkle size={16} weight="fill" className="text-py-500" />
                    <h2 className="text-xl font-semibold text-ink-50">Formulir pendaftaran</h2>
                  </div>
                  <p className="mt-1 text-sm text-ink-400">
                    Wajib diisi oleh seluruh mahasiswa baru S2 MTI Unhas.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label htmlFor="nama" className="text-sm font-medium text-ink-200">
                      Nama lengkap
                    </label>
                    <GlowInput
                      id="nama"
                      value={form.nama}
                      onChange={(v) => setForm({ ...form, nama: v })}
                      placeholder="Nama sesuai KTP"
                      hasError={!!errors.nama}
                    />
                    {errors.nama && <p className="text-xs text-rose-300">{errors.nama}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="nim" className="text-sm font-medium text-ink-200">
                      NIM
                    </label>
                    <GlowInput
                      id="nim"
                      value={form.nim}
                      onChange={(v) => setForm({ ...form, nim: v })}
                      placeholder="Nomor induk mahasiswa"
                      hasError={!!errors.nim}
                    />
                    {errors.nim && <p className="text-xs text-rose-300">{errors.nim}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="asalKampus" className="text-sm font-medium text-ink-200">
                      Asal kampus S1
                    </label>
                    <GlowInput
                      id="asalKampus"
                      value={form.asalKampus}
                      onChange={(v) => setForm({ ...form, asalKampus: v })}
                      placeholder="Contoh: Universitas Hasanuddin"
                      hasError={!!errors.asalKampus}
                    />
                    {errors.asalKampus && (
                      <p className="text-xs text-rose-300">{errors.asalKampus}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-sm font-medium text-ink-200">
                      Email
                    </label>
                    <GlowInput
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(v) => setForm({ ...form, email: v })}
                      placeholder="nama@email.com"
                      hasError={!!errors.email}
                    />
                    {errors.email && <p className="text-xs text-rose-300">{errors.email}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="whatsapp" className="text-sm font-medium text-ink-200">
                      Nomor WhatsApp
                    </label>
                    <GlowInput
                      id="whatsapp"
                      type="tel"
                      value={form.whatsapp}
                      onChange={(v) => setForm({ ...form, whatsapp: v })}
                      placeholder="08xx-xxxx-xxxx"
                      hasError={!!errors.whatsapp}
                    />
                    {errors.whatsapp && (
                      <p className="text-xs text-rose-300">{errors.whatsapp}</p>
                    )}
                  </div>
                </div>

                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 rounded-lg border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-200"
                  >
                    <WarningCircle size={18} weight="bold" className="mt-0.5 shrink-0" />
                    {errorMessage}
                  </motion.div>
                )}

                <motion.button
                  ref={btnRef}
                  type="submit"
                  disabled={status === "submitting"}
                  whileHover={reduce ? {} : { scale: 1.01, y: -1 }}
                  whileTap={reduce ? {} : { scale: 0.98 }}
                  className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-py-500 px-6 py-3.5 text-sm font-semibold text-oncontrast disabled:opacity-70"
                >
                  {/* Shimmer sweep on hover */}
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.22) 50%, transparent 60%)",
                      backgroundSize: "200% 100%",
                    }}
                    animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 1 }}
                  />
                  {status === "submitting" ? (
                    <>
                      <CircleNotch size={16} weight="bold" className="animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Daftar Sekarang"
                  )}
                </motion.button>

                {!isSupabaseConfigured && (
                  <p className="text-center text-xs text-ink-500">
                    Mode pratinjau: koneksi database belum dikonfigurasi.
                  </p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </Container>
    </section>
  );
}
