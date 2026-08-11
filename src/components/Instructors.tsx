import { motion, useReducedMotion } from "motion/react";
import { Container } from "./Container";

const PEMATERI = [
  { initials: "RA", name: "Rezaa Arisandy", topic: "Materi 1 · Dasar Python" },
  { initials: "HE", name: "Herawati", topic: "Materi 2 · Struktur Kontrol & Logika" },
  { initials: "AU", name: "Arman Umar", topic: "Materi 3 · Struktur Data Python" },
  { initials: "ZU", name: "Zulhijaya", topic: "Materi 4 · Fungsi & Dasar OOP" },
  { initials: "IB", name: "Muh. Iqram Bahring", topic: "Materi 5 · NumPy & Pandas" },
  { initials: "MR", name: "Muhammad Ramadhan", topic: "Materi 6 · EDA & Visualisasi" },
  { initials: "AA", name: "Andi Achyar", topic: "Materi 7 · Machine Learning" },
];

const GRADIENTS = [
  "from-py-600 to-py-400",
  "from-blue-450 to-ink-600",
  "from-py-500 to-blue-450",
  "from-ink-500 to-ink-700",
];

export function Instructors() {
  const reduce = useReducedMotion();

  return (
    <section id="instruktur" className="py-20 sm:py-28">
      <Container>
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-py-500">
            Pemateri
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink-50 sm:text-4xl">
            Tujuh pemateri, satu materi masing-masing
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {PEMATERI.map((person, i) => (
            <motion.div
              key={person.name}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-ink-800 bg-ink-900/60 p-5"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold text-oncontrast ${
                  GRADIENTS[i % GRADIENTS.length]
                }`}
              >
                {person.initials}
              </div>
              <h3 className="mt-4 text-sm font-semibold text-ink-50">{person.name}</h3>
              <p className="mt-1 text-xs leading-relaxed text-ink-400">{person.topic}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
