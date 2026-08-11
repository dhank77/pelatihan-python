import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CaretDown } from "@phosphor-icons/react";
import { Container } from "./Container";

const ITEMS = [
  {
    q: "Apakah pelatihan ini wajib diikuti?",
    a: "Ya. Pelatihan ini adalah bagian dari pembekalan mahasiswa baru S2 MTI Unhas dan wajib diikuti oleh seluruh peserta yang terdaftar.",
  },
  {
    q: "Apakah saya harus membawa laptop sendiri?",
    a: "Ya, bawa laptop dengan spesifikasi standar. Panduan instalasi Python akan dikirim lewat email setelah kamu mendaftar.",
  },
  {
    q: "Apakah cocok untuk yang belum pernah coding sama sekali?",
    a: "Cocok. Materi hari pertama dimulai dari dasar dan tidak mengasumsikan pengalaman coding sebelumnya, mengingat peserta berasal dari berbagai latar belakang S1.",
  },
  {
    q: "Bagaimana jika saya berhalangan hadir?",
    a: "Segera hubungi panitia melalui kontak di bagian bawah halaman ini agar dapat diarahkan ke ketentuan susulan.",
  },
  {
    q: "Apakah ada sertifikat setelah pelatihan selesai?",
    a: "Ya. Sertifikat digital diberikan setelah kamu menyelesaikan kedua hari pelatihan, termasuk mini project di hari kedua.",
  },
];

export function FAQ() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 sm:py-28">
      <Container className="max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-py-500">
          FAQ
        </span>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink-50 sm:text-4xl">
          Pertanyaan yang sering ditanyakan
        </h2>

        <div className="mt-8 divide-y divide-ink-800 border-y border-ink-800">
          {ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="text-sm font-medium text-ink-100 sm:text-base">{item.q}</span>
                  <CaretDown
                    size={18}
                    className={`shrink-0 text-ink-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <motion.p
                    initial={reduce ? false : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden pb-5 text-sm leading-relaxed text-ink-400"
                  >
                    {item.a}
                  </motion.p>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
