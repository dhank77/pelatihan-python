import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  CircleNotch,
  LockSimple,
  WarningCircle,
  XCircle,
  TerminalWindow,
} from "@phosphor-icons/react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { OverallScoreChart, PerQuestionChart, type QuizStats } from "../components/QuizCharts";

type Question = {
  question: string;
  options: string[];
  answer: number;
};

const QUESTIONS: Question[] = [
  {
    question: 'Apa output dari kode berikut?\n\nprint(type(5))',
    options: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'number'>"],
    answer: 0,
  },
  {
    question: "Simbol apa yang digunakan untuk menulis komentar satu baris di Python?",
    options: ["//", "#", "/* */", "--"],
    answer: 1,
  },
  {
    question: 'Bagaimana cara mendeklarasikan sebuah list kosong di Python?',
    options: ["list = ()", "list = {}", "list = []", "list = <>"],
    answer: 2,
  },
  {
    question: 'Apa output dari:\n\nprint(3 + 2 * 2)',
    options: ["10", "7", "12", "9"],
    answer: 1,
  },
  {
    question: "Keyword apa yang digunakan untuk membuat fungsi di Python?",
    options: ["function", "def", "func", "define"],
    answer: 1,
  },
  {
    question: 'Apa hasil dari:\n\nlen("Python")',
    options: ["5", "6", "7", "Error"],
    answer: 1,
  },
  {
    question: "Struktur data apa yang bersifat immutable (tidak bisa diubah) di Python?",
    options: ["List", "Dictionary", "Set", "Tuple"],
    answer: 3,
  },
  {
    question: 'Operator apa yang digunakan untuk pembagian bilangan bulat (floor division)?',
    options: ["/", "//", "%", "**"],
    answer: 1,
  },
  {
    question: "Bagaimana cara yang benar untuk mengimpor modul math di Python?",
    options: ["#include math", "import math", "using math", "require('math')"],
    answer: 1,
  },
  {
    question: 'Apa output dari:\n\nfor i in range(3):\n    print(i)',
    options: ["1 2 3", "0 1 2", "0 1 2 3", "1 2"],
    answer: 1,
  },
];

const STORAGE_KEY = "pymti-quiz-v1";

type StoredResult = {
  answers: (number | null)[];
  score: number;
  submittedAt: string;
};

function loadStoredResult(): StoredResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.answers) || typeof parsed.score !== "number") return null;
    return parsed as StoredResult;
  } catch {
    return null;
  }
}

export function QuizPage() {
  const [storedResult] = useState<StoredResult | null>(() => loadStoredResult());
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => storedResult?.answers ?? Array(QUESTIONS.length).fill(null),
  );
  const [submitted, setSubmitted] = useState(() => storedResult !== null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [stats, setStats] = useState<QuizStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState(false);

  const allAnswered = answers.every((a) => a !== null);
  const score = answers.reduce(
    (acc: number, a, i) => acc + (a === QUESTIONS[i].answer ? 1 : 0),
    0,
  );

  useEffect(() => {
    if (!submitted) return;
    if (!supabase) return;

    let cancelled = false;
    setStatsLoading(true);
    setStatsError(false);

    supabase
      .rpc("get_quiz_stats")
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) {
          setStatsError(true);
        } else {
          setStats(data as QuizStats);
        }
        setStatsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [submitted]);

  function selectOption(qIndex: number, optIndex: number) {
    if (submitted) return;
    const next = [...answers];
    next[qIndex] = optIndex;
    setAnswers(next);
  }

  async function handleSubmit() {
    if (!allAnswered || submitting || submitted) return;

    setSubmitting(true);
    setSubmitError("");

    if (supabase) {
      const { error } = await supabase.from("quiz_results").insert({
        answers,
        score,
        total: QUESTIONS.length,
      });
      if (error) {
        setSubmitting(false);
        setSubmitError("Jawaban gagal disimpan. Coba lagi dalam beberapa saat.");
        return;
      }
    }

    const record: StoredResult = {
      answers,
      score,
      submittedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));

    setSubmitting(false);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-[100dvh] bg-ink-950 px-5 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-2xl">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-ink-400 transition-colors hover:text-ink-100"
        >
          <ArrowLeft size={16} weight="bold" />
          Kembali ke beranda
        </Link>

        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-py-500 text-oncontrast">
            <TerminalWindow size={18} weight="bold" />
          </span>
          <span className="font-semibold tracking-tight text-ink-50">
            Python MTI <span className="text-ink-400">Unhas</span>
          </span>
        </div>

        <h1 className="mt-6 text-xl font-semibold text-ink-50">
          Quiz Asesmen Awal Python
        </h1>
        <p className="mt-1 text-sm text-ink-400">
          10 soal singkat untuk mengukur pemahaman dasar Python sebelum pelatihan dimulai.
        </p>

        {submitted && (
          <div className="mt-6 rounded-2xl border border-ink-800 bg-ink-900/60 p-6 text-center">
            <p className="text-sm text-ink-400">Skor kamu</p>
            <p className="mt-1 text-4xl font-bold text-py-500">
              {score}
              <span className="text-lg text-ink-500">/{QUESTIONS.length}</span>
            </p>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-ink-500">
              <LockSimple size={13} weight="bold" />
              Quiz ini hanya bisa diisi sekali di perangkat ini.
            </p>
          </div>
        )}

        <div className="mt-6 space-y-5">
          {QUESTIONS.map((q, qIndex) => (
            <div
              key={qIndex}
              className="rounded-2xl border border-ink-800 bg-ink-900/60 p-6"
            >
              <p className="text-sm font-medium text-ink-200">
                <span className="text-py-500">{qIndex + 1}.</span>{" "}
                <span className="whitespace-pre-line">{q.question}</span>
              </p>
              <div className="mt-4 space-y-2">
                {q.options.map((opt, optIndex) => {
                  const isSelected = answers[qIndex] === optIndex;
                  const isCorrect = q.answer === optIndex;
                  let stateClasses = "border-ink-700 hover:border-ink-500";
                  if (submitted) {
                    if (isCorrect) {
                      stateClasses = "border-py-500/70 bg-py-500/10";
                    } else if (isSelected && !isCorrect) {
                      stateClasses = "border-rose-400/70 bg-rose-400/10";
                    }
                  } else if (isSelected) {
                    stateClasses = "border-py-500/70 bg-py-500/5";
                  }
                  return (
                    <button
                      key={optIndex}
                      type="button"
                      onClick={() => selectOption(qIndex, optIndex)}
                      disabled={submitted}
                      className={`flex w-full items-center justify-between gap-2 rounded-lg border px-4 py-2.5 text-left text-sm text-ink-100 transition-colors disabled:cursor-default ${stateClasses}`}
                    >
                      <span className="font-mono">{opt}</span>
                      {submitted && isCorrect && (
                        <CheckCircle size={18} weight="fill" className="shrink-0 text-py-500" />
                      )}
                      {submitted && isSelected && !isCorrect && (
                        <XCircle size={18} weight="fill" className="shrink-0 text-rose-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {!submitted && (
          <>
            {submitError && (
              <div className="mt-5 flex items-start gap-2 rounded-lg border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                <WarningCircle size={18} weight="bold" className="mt-0.5 shrink-0" />
                {submitError}
              </div>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-py-500 px-6 py-3.5 text-sm font-semibold text-oncontrast transition-transform hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <CircleNotch size={16} weight="bold" className="animate-spin" />
                  Menyimpan...
                </>
              ) : allAnswered ? (
                <>
                  Lihat Hasil
                  <ArrowRight size={16} weight="bold" />
                </>
              ) : (
                `Jawab semua soal (${answers.filter((a) => a !== null).length}/${QUESTIONS.length})`
              )}
            </button>
            {!isSupabaseConfigured && (
              <p className="mt-3 text-center text-xs text-ink-500">
                Mode pratinjau: koneksi database belum dikonfigurasi.
              </p>
            )}
          </>
        )}

        {submitted && (
          <div className="mt-8">
            {!isSupabaseConfigured && (
              <p className="rounded-2xl border border-ink-800 bg-ink-900/60 p-6 text-center text-sm text-ink-400">
                Statistik peserta belum tersedia: koneksi database belum dikonfigurasi.
              </p>
            )}
            {isSupabaseConfigured && statsLoading && (
              <div className="flex items-center justify-center gap-2 rounded-2xl border border-ink-800 bg-ink-900/60 p-6 text-sm text-ink-400">
                <CircleNotch size={16} weight="bold" className="animate-spin" />
                Memuat statistik peserta...
              </div>
            )}
            {isSupabaseConfigured && !statsLoading && statsError && (
              <p className="rounded-2xl border border-ink-800 bg-ink-900/60 p-6 text-center text-sm text-ink-400">
                Gagal memuat statistik peserta. Coba muat ulang halaman.
              </p>
            )}
            {isSupabaseConfigured && !statsLoading && !statsError && stats && (
              <>
                <OverallScoreChart stats={stats} maxScore={QUESTIONS.length} userScore={score} />
                <PerQuestionChart questions={QUESTIONS} stats={stats} userAnswers={answers} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
