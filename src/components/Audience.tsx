import { motion, useReducedMotion } from "motion/react";
import { GraduationCap, Code, ChartBar, Sparkle } from "@phosphor-icons/react";
import { Container } from "./Container";

const PERSONAS = [
  {
    icon: GraduationCap,
    title: "Dari S1 non-Informatika",
    body: "Latar belakang bukan ilmu komputer bukan masalah. Materi dimulai dari dasar, tidak ada yang tertinggal.",
  },
  {
    icon: Code,
    title: "Dari S1 Informatika, tapi sudah lama tidak coding",
    body: "Sesi ini jadi penyegaran cepat sebelum masuk ke materi yang lebih lanjut.",
  },
  {
    icon: ChartBar,
    title: "Untuk bekal riset tesis",
    body: "Python jadi alat penting untuk mengolah data penelitian, dari statistik dasar sampai machine learning.",
  },
  {
    icon: Sparkle,
    title: "Belum pernah menulis kode sama sekali",
    body: "Tidak masalah. Pelatihan ini adalah titik awal yang sama untuk semua peserta.",
  },
];

export function Audience() {
  const reduce = useReducedMotion();

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-3xl font-semibold tracking-tight text-ink-50 sm:text-4xl">
              Untuk siapa pelatihan ini
            </h2>
            <p className="mt-4 max-w-[40ch] text-ink-300">
              Wajib bagi seluruh mahasiswa baru S2 MTI Unhas, dari berbagai latar belakang S1.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {PERSONAS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-xl border border-ink-800 px-5 py-5 transition-colors hover:border-ink-600"
              >
                <p.icon size={22} weight="bold" className="text-py-500" />
                <h3 className="mt-3 text-sm font-semibold text-ink-50">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-400">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
