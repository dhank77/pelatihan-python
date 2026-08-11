import { lazy, Suspense, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, CalendarBlank, MapPin } from "@phosphor-icons/react";
import { Container } from "./Container";
import { ErrorBoundary } from "./ErrorBoundary";

const NetworkBackground = lazy(() =>
  import("./NetworkBackground").then((m) => ({ default: m.NetworkBackground })),
);

const codeLines = [
  { n: 1, tokens: [{ t: "def", c: "text-py-400" }, { t: " sambut_peserta", c: "text-blue-450" }, { t: "(nama):", c: "text-ink-100" }] },
  { n: 2, tokens: [{ t: "    print", c: "text-blue-450" }, { t: "(", c: "text-ink-100" }, { t: 'f"Halo, {nama}! Siap ngoding?"', c: "text-py-400" }, { t: ")", c: "text-ink-100" }] },
  { n: 3, tokens: [{ t: "", c: "" }] },
  { n: 4, tokens: [{ t: "peserta", c: "text-ink-100" }, { t: " = ", c: "text-ink-400" }, { t: "30", c: "text-blue-450" }] },
  { n: 5, tokens: [{ t: "for", c: "text-py-400" }, { t: " hari ", c: "text-ink-100" }, { t: "in", c: "text-py-400" }, { t: " (", c: "text-ink-100" }, { t: "15", c: "text-blue-450" }, { t: ", ", c: "text-ink-400" }, { t: "16", c: "text-blue-450" }, { t: "):", c: "text-ink-100" }] },
  { n: 6, tokens: [{ t: "    belajar_python", c: "text-blue-450" }, { t: "(hari, ", c: "text-ink-100" }, { t: "materi=", c: "text-ink-400" }, { t: '"praktik langsung"', c: "text-py-400" }, { t: ")", c: "text-ink-100" }] },
];

export function Hero() {
  const reduce = useReducedMotion();

  // Re-mount the WebGL background whenever the color theme changes, since
  // its colors/blending are baked in at creation time for contrast against
  // that specific theme (additive glow reads as near-invisible on a light
  // background, so it needs different colors, not just a live toggle).
  const [themeKey, setThemeKey] = useState(
    () => document.documentElement.getAttribute("data-theme") ?? "dark",
  );
  useEffect(() => {
    const onThemeChange = (e: Event) => {
      setThemeKey((e as CustomEvent<string>).detail);
    };
    window.addEventListener("themechange", onThemeChange);
    return () => window.removeEventListener("themechange", onThemeChange);
  }, []);

  return (
    <section id="top" className="relative overflow-hidden pt-20 pb-20 sm:pt-24 sm:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(600px circle at 15% 0%, rgba(246,206,62,0.10), transparent 55%), radial-gradient(500px circle at 90% 10%, rgba(75,139,214,0.10), transparent 50%)",
        }}
      />
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <NetworkBackground key={themeKey} />
          </Suspense>
        </ErrorBoundary>
      </div>
      <Container className="relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-ink-700 bg-ink-900 px-4 py-1.5 text-xs font-medium text-ink-200">
              <CalendarBlank size={14} className="text-py-500" weight="bold" />
              15-16 Agustus 2026
              <span className="text-ink-600">·</span>
              <MapPin size={14} className="text-py-500" weight="bold" />
              Angkatan 14
            </span>

            <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-ink-50 sm:text-5xl lg:text-6xl">
              Belajar Python, dari Dasar
              <br />
              sampai Machine Learning
            </h1>

            <p className="mt-5 max-w-[48ch] text-base leading-relaxed text-ink-300 sm:text-lg">
              Pelatihan pembekalan bagi mahasiswa baru S2 Magister Teknik Informatika Unhas, dari dasar Python sampai studi kasus machine learning.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#daftar"
                className="inline-flex items-center gap-2 rounded-full bg-py-500 px-6 py-3.5 text-sm font-semibold text-oncontrast transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Daftar Sekarang
                <ArrowRight size={16} weight="bold" />
              </a>
              <a
                href="#kurikulum"
                className="inline-flex items-center gap-2 rounded-full border border-ink-700 px-6 py-3.5 text-sm font-semibold text-ink-100 transition-colors hover:border-ink-500 hover:bg-ink-900"
              >
                Lihat Kurikulum
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="overflow-hidden rounded-2xl border border-ink-700 bg-ink-900/75 shadow-[0_24px_70px_-20px_rgba(0,0,0,0.6)] backdrop-blur-md">
              <div className="flex items-center gap-2 border-b border-ink-800 bg-ink-800/50 px-4 py-3 backdrop-blur-md">
                <span className="h-2.5 w-2.5 rounded-full bg-ink-600" />
                <span className="h-2.5 w-2.5 rounded-full bg-ink-600" />
                <span className="h-2.5 w-2.5 rounded-full bg-ink-600" />
                <span className="ml-2 font-mono text-xs text-ink-400">hari_pertama.py</span>
              </div>
              <div className="overflow-x-auto px-5 pb-14 pt-6 font-mono text-[13px] leading-[1.9] sm:text-sm">
                {codeLines.map((line) => (
                  <div key={line.n} className="flex w-max min-w-full gap-4">
                    <span className="w-4 shrink-0 select-none text-right text-ink-600">{line.n}</span>
                    <span className="whitespace-pre">
                      {line.tokens.map((tok, i) => (
                        <span key={i} className={tok.c}>
                          {tok.t}
                        </span>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-ink-700 bg-ink-900/80 px-4 py-3 shadow-lg backdrop-blur-md sm:block">
              <p className="font-mono text-xs text-ink-400">output</p>
              <p className="mt-0.5 text-sm text-ink-100">Halo, Dinda! Siap ngoding?</p>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
