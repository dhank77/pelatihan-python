import { CheckCircle, XCircle, UsersThree } from "@phosphor-icons/react";

export type QuizStats = {
  total: number;
  avg_score: number;
  score_distribution: { score: number; count: number }[];
  option_counts: { question_index: number; option_index: number; count: number }[];
};

type Question = {
  question: string;
  options: string[];
  answer: number;
};

/** Overall summary: total submissions, average score, and the score histogram. */
export function OverallScoreChart({
  stats,
  maxScore,
  userScore,
}: {
  stats: QuizStats;
  maxScore: number;
  userScore: number;
}) {
  const buckets = Array.from({ length: maxScore + 1 }, (_, score) => {
    const found = stats.score_distribution.find((s) => s.score === score);
    return { score, count: found?.count ?? 0 };
  });
  const maxCount = Math.max(1, ...buckets.map((b) => b.count));

  return (
    <div className="rounded-2xl border border-ink-800 bg-ink-900/60 p-6">
      <div className="flex items-center gap-2">
        <UsersThree size={18} weight="bold" className="text-py-500" />
        <h3 className="text-sm font-semibold text-ink-50">Statistik seluruh peserta</h3>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-ink-800 bg-ink-950/50 px-4 py-3">
          <p className="text-xs text-ink-400">Total peserta</p>
          <p className="mt-1 text-xl font-bold text-ink-50">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-ink-800 bg-ink-950/50 px-4 py-3">
          <p className="text-xs text-ink-400">Rata-rata skor</p>
          <p className="mt-1 text-xl font-bold text-ink-50">
            {stats.avg_score}
            <span className="text-sm font-normal text-ink-500">/{maxScore}</span>
          </p>
        </div>
        <div className="rounded-xl border border-py-500/40 bg-py-500/5 px-4 py-3">
          <p className="text-xs text-ink-400">Skor kamu</p>
          <p className="mt-1 text-xl font-bold text-py-500">
            {userScore}
            <span className="text-sm font-normal text-ink-500">/{maxScore}</span>
          </p>
        </div>
      </div>

      <p className="mt-5 text-xs font-medium text-ink-400">Distribusi skor semua peserta</p>
      <div className="mt-6 flex items-end gap-1.5" style={{ height: 96 }}>
        {buckets.map((b) => {
          const isUser = b.score === userScore;
          const heightPct = (b.count / maxCount) * 100;
          return (
            <div key={b.score} className="relative flex h-full flex-1 items-end justify-center">
              {isUser && b.count > 0 && (
                <span className="absolute -top-4 whitespace-nowrap text-[10px] font-semibold text-py-500">
                  kamu
                </span>
              )}
              <div
                title={`Skor ${b.score}: ${b.count} peserta`}
                className={`w-full rounded-t-[4px] transition-[height] ${
                  isUser
                    ? "bg-py-500 ring-2 ring-py-400 ring-offset-2 ring-offset-ink-900"
                    : b.count > 0
                      ? "bg-ink-600"
                      : "bg-ink-800"
                }`}
                style={{ height: `${Math.max(heightPct, b.count > 0 ? 6 : 2)}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 flex gap-1.5">
        {buckets.map((b) => (
          <span key={b.score} className="flex-1 text-center text-[10px] text-ink-500">
            {b.score}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Per-question breakdown: how every participant answered each option. */
export function PerQuestionChart({
  questions,
  stats,
  userAnswers,
}: {
  questions: Question[];
  stats: QuizStats;
  userAnswers: (number | null)[];
}) {
  return (
    <div className="mt-5 space-y-4">
      <h3 className="text-sm font-semibold text-ink-50">Statistik per soal</h3>
      {questions.map((q, qIndex) => {
        const counts = q.options.map(
          (_, optIndex) =>
            stats.option_counts.find(
              (c) => c.question_index === qIndex && c.option_index === optIndex,
            )?.count ?? 0,
        );
        const totalForQuestion = counts.reduce((a, b) => a + b, 0);
        const correctCount = counts[q.answer] ?? 0;
        const correctPct =
          totalForQuestion > 0 ? Math.round((correctCount / totalForQuestion) * 100) : 0;

        return (
          <div
            key={qIndex}
            className="rounded-2xl border border-ink-800 bg-ink-900/60 p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-ink-200">
                <span className="text-py-500">{qIndex + 1}.</span>{" "}
                <span className="whitespace-pre-line">{q.question}</span>
              </p>
              <span className="shrink-0 rounded-full border border-py-500/40 bg-py-500/10 px-2.5 py-1 text-[11px] font-semibold text-py-500">
                {correctPct}% benar
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              {q.options.map((opt, optIndex) => {
                const count = counts[optIndex];
                const pct = totalForQuestion > 0 ? (count / totalForQuestion) * 100 : 0;
                const isCorrect = optIndex === q.answer;
                const isUserPick = userAnswers[qIndex] === optIndex;
                const barColor = isCorrect
                  ? "bg-py-500"
                  : isUserPick
                    ? "bg-rose-400"
                    : "bg-ink-600";

                return (
                  <div key={optIndex}>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="min-w-0 flex-1 truncate font-mono text-ink-300">
                        {opt}
                      </span>
                      {isCorrect && (
                        <span className="flex items-center gap-1 text-py-500">
                          <CheckCircle size={13} weight="fill" />
                          Benar
                        </span>
                      )}
                      {isUserPick && !isCorrect && (
                        <span className="flex items-center gap-1 text-rose-300">
                          <XCircle size={13} weight="fill" />
                          Pilihanmu
                        </span>
                      )}
                      {isUserPick && isCorrect && (
                        <span className="text-ink-500">(pilihanmu)</span>
                      )}
                      <span className="w-9 shrink-0 text-right text-ink-400">
                        {Math.round(pct)}%
                      </span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-ink-800">
                      <div
                        title={`${count} dari ${totalForQuestion} peserta`}
                        className={`h-full rounded-full transition-[width] ${barColor}`}
                        style={{ width: `${Math.max(pct, count > 0 ? 3 : 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
