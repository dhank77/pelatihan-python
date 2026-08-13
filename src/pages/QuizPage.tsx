import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  TerminalWindow,
  ArrowCounterClockwise,
} from "@phosphor-icons/react";

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

export function QuizPage() {
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(QUESTIONS.length).fill(null),
  );
  const [submitted, setSubmitted] = useState(false);

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

  function handleSubmit() {
    if (!allAnswered) return;
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleRetake() {
    setAnswers(Array(QUESTIONS.length).fill(null));
    setSubmitted(false);
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
            <button
              type="button"
              onClick={handleRetake}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-ink-700 px-5 py-2.5 text-sm font-medium text-ink-200 transition-colors hover:border-ink-500"
            >
              <ArrowCounterClockwise size={16} weight="bold" />
              Ulangi quiz
            </button>
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
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-py-500 px-6 py-3.5 text-sm font-semibold text-oncontrast transition-transform hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {allAnswered ? "Lihat Hasil" : `Jawab semua soal (${answers.filter((a) => a !== null).length}/${QUESTIONS.length})`}
            <ArrowRight size={16} weight="bold" />
          </button>
        )}
      </div>
    </div>
  );
}
