import { motion, useReducedMotion } from "motion/react";
import { Container } from "./Container";

type Item = { time: string; title: string; presenter?: string };

const DAY1: Item[] = [
  { time: "08.00-08.30", title: "Perkenalan" },
  {
    time: "08.30-10.00",
    title: "Materi 1: Pengenalan dan Dasar-dasar Python",
    presenter: "Rezaa Arisandy",
  },
  {
    time: "10.00-11.30",
    title: "Materi 2: Struktur Kontrol dan Logika",
    presenter: "Herawati",
  },
  { time: "11.30-13.30", title: "Sharing bebas & ishoma" },
  {
    time: "13.00-14.30",
    title: "Materi 3: Struktur Data Python",
    presenter: "Arman Umar",
  },
  {
    time: "14.30-15.30",
    title: "Materi 4: Fungsi dan Dasar OOP",
    presenter: "Zulhijaya",
  },
  { time: "15.30-16.00", title: "Sholat Ashar" },
  {
    time: "16.00-16.30",
    title: "Materi 4 (lanjutan): Fungsi dan Dasar OOP",
    presenter: "Zulhijaya",
  },
];

const DAY2: Item[] = [
  {
    time: "08.00-09.30",
    title: "Materi 5: NumPy, Pandas, Matplotlib & EDA",
    presenter: "Muhammad Ramadhan",
  },
  {
    time: "09.30-11.00",
    title: "Materi 6: Machine Learning, Training & Evaluasi Model",
    presenter: "Andi Achyar",
  },
  { time: "11.00-12.00", title: "Materi 7: Tugas per orang" },
  { time: "12.00-13.30", title: "Ishoma" },
  { time: "13.30-15.30", title: "Materi 8: Evaluasi & thesis sharing" },
  { time: "15.30-16.00", title: "Sholat Ashar" },
  { time: "16.00-17.00", title: "Materi 8 (lanjutan): Evaluasi & thesis sharing" },
];

function DayColumn({
  label,
  date,
  items,
  delay,
}: {
  label: string;
  date: string;
  items: Item[];
  delay: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-ink-800 bg-ink-900/60 p-6 sm:p-8"
    >
      <p className="text-sm font-semibold text-py-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-ink-50">{date}</p>

      <ol className="mt-6 space-y-0">
        {items.map((item, i) => (
          <li key={item.time + item.title} className="relative flex gap-4 pb-5 last:pb-0">
            {i !== items.length - 1 && (
              <span
                aria-hidden
                className="absolute left-[5px] top-3 h-full w-px bg-ink-700"
              />
            )}
            <span className="relative mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-ink-500" />
            <div className="flex flex-1 flex-col gap-0.5 sm:flex-row sm:gap-4">
              <span className="font-mono text-xs text-ink-400 sm:w-24 sm:shrink-0">
                {item.time}
              </span>
              <div>
                <p className="text-sm text-ink-100">{item.title}</p>
                {item.presenter && (
                  <p className="mt-0.5 text-xs text-ink-500">{item.presenter}</p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </motion.div>
  );
}

export function Schedule() {
  return (
    <section id="jadwal" className="py-20 sm:py-28">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-ink-50 sm:text-4xl">
            Susunan acara dua hari
          </h2>
          <p className="mt-3 text-ink-300">
            Delapan sesi materi berjalan pukul 08.00 sampai 17.00 WIB, dengan waktu ishoma dan sholat Ashar di kedua hari.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          <DayColumn label="Hari pertama" date="Sabtu, 15 Agustus 2026" items={DAY1} delay={0} />
          <DayColumn label="Hari kedua" date="Ahad, 16 Agustus 2026" items={DAY2} delay={0.1} />
        </div>
      </Container>
    </section>
  );
}
