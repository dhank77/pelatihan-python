import { useState } from "react";
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
import { QUESTIONS } from "../lib/quizQuestions";

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

  const allAnswered = answers.every((a) => a !== null);
  const score = answers.reduce(
    (acc: number, a, i) => acc + (a === QUESTIONS[i].answer ? 1 : 0),
    0,
  );

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
      </div>
    </div>
  );
}
