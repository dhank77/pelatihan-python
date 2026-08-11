import { motion, useReducedMotion } from "motion/react";
import { Sigma, Stack, ChartLineUp, Brain, NotePencil, GraduationCap, Leaf } from "@phosphor-icons/react";
import { Container } from "./Container";

export function Curriculum() {
  const reduce = useReducedMotion();
  const reveal = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.3 },
          transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section id="kurikulum" className="py-20 sm:py-28">
      <Container>
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-py-500">
            Kurikulum
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink-50 sm:text-4xl">
            Delapan materi, dari baris kode pertama sampai model machine learning
          </h2>
          <p className="mt-3 text-ink-300">
            Disusun bertahap selama 2 hari, supaya kamu tidak cuma paham teori tapi juga sempat mempraktikkannya.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[168px]">
          <motion.div
            {...reveal(0)}
            className="relative overflow-hidden rounded-2xl border border-ink-700 bg-gradient-to-br from-ink-800 to-ink-900 p-6 sm:col-span-2 lg:col-span-2 lg:row-span-2"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-py-500/10 blur-2xl"
            />
            <Sigma size={26} weight="bold" className="text-py-500" />
            <h3 className="mt-4 text-xl font-semibold text-ink-50">Fondasi Python</h3>
            <p className="mt-2 max-w-[38ch] text-sm leading-relaxed text-ink-300">
              Variabel, tipe data, input/output, percabangan if-else, dan perulangan for/while. Materi 1 dan 2, fondasi sebelum lanjut ke topik lain.
            </p>
          </motion.div>

          <motion.div
            {...reveal(0.06)}
            className="rounded-2xl border border-ink-700 bg-ink-900 p-6 sm:col-span-2 lg:col-span-2"
          >
            <Stack size={26} weight="bold" className="text-ink-300" />
            <h3 className="mt-4 text-lg font-semibold text-ink-50">
              Struktur Data, Fungsi & OOP
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-300">
              List, tuple, dictionary, set, cara menulis fungsi, dan dasar pemrograman berorientasi objek. Materi 3 dan 4.
            </p>
          </motion.div>

          <motion.div
            {...reveal(0.12)}
            className="rounded-2xl border border-ink-700 bg-ink-900 p-6"
          >
            <ChartLineUp size={26} weight="bold" className="text-blue-450" />
            <h3 className="mt-4 text-lg font-semibold text-ink-50">NumPy, Pandas & EDA</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-300">
              Manipulasi data, visualisasi dengan Matplotlib, sampai exploratory data analysis. Materi 5.
            </p>
          </motion.div>

          <motion.div
            {...reveal(0.18)}
            className="rounded-2xl border border-ink-700 bg-ink-900 p-6"
          >
            <Brain size={26} weight="bold" className="text-blue-450" />
            <h3 className="mt-4 text-lg font-semibold text-ink-50">Machine Learning</h3>
            <p className="mt-2 flex items-center gap-1.5 text-sm leading-relaxed text-ink-300">
              <Leaf size={14} weight="bold" className="shrink-0 text-blue-450" />
              Studi kasus deteksi penyakit pada daun tanaman. Materi 6.
            </p>
          </motion.div>

          <motion.div
            {...reveal(0.24)}
            className="rounded-2xl border border-ink-700 bg-ink-900 p-6 sm:col-span-2"
          >
            <NotePencil size={26} weight="bold" className="text-py-500" />
            <h3 className="mt-4 text-lg font-semibold text-ink-50">Tugas Perorangan</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-300">
              Praktik mandiri untuk mengasah materi yang sudah dipelajari. Materi 7.
            </p>
          </motion.div>

          <motion.div
            {...reveal(0.3)}
            className="relative overflow-hidden rounded-2xl border border-ink-700 bg-ink-900 p-6 sm:col-span-2"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(75,139,214,0.6) 1px, transparent 1px)",
                backgroundSize: "18px 18px",
              }}
            />
            <div className="relative">
              <GraduationCap size={26} weight="bold" className="text-blue-450" />
              <h3 className="mt-4 text-lg font-semibold text-ink-50">
                Evaluasi & Thesis Sharing
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">
                Penutup pelatihan: evaluasi menyeluruh dan berbagi rencana riset tesis. Materi 8.
              </p>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
