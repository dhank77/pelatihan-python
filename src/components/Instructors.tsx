import { motion, useReducedMotion } from "motion/react";
import { Container } from "./Container";

const PEMATERI = [
  {
    initials: "RA",
    name: "Rezaa Arisandy",
    topic: "Materi 1 · Dasar Python",
    avatar: "/avatars/rezaa.png",
  },
  {
    initials: "HE",
    name: "Herawati",
    topic: "Materi 2 · Struktur Kontrol & Logika",
    avatar: "/avatars/herawati.png",
  },
  {
    initials: "AU",
    name: "Arman Umar",
    topic: "Materi 3 · Struktur Data Python",
    avatar: "/avatars/arman.png",
  },
  {
    initials: "ZU",
    name: "Zulhijaya",
    topic: "Materi 4 · Fungsi & Dasar OOP",
    avatar: "/avatars/zulhijaya.png",
  },
  {
    initials: "MR",
    name: "Muhammad Ramadhan",
    topic: "Materi 5 · NumPy, Pandas & EDA",
    avatar: "/avatars/ramadhan.png",
  },
  {
    initials: "AA",
    name: "Andi Achyar",
    topic: "Materi 6 · Machine Learning",
    avatar: "/avatars/achyar.png",
  },
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
            Enam pemateri, satu materi masing-masing
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {PEMATERI.map((person, i) => (
            <motion.div
              key={person.name}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-ink-800 bg-ink-900/60 p-5"
            >
              <div className="h-16 w-16 overflow-hidden rounded-full ring-2 ring-ink-700">
                <img
                  src={person.avatar}
                  alt={person.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
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
