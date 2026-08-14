import { useEffect, useState } from "react";
import { ChartBar, CircleNotch, WarningCircle } from "@phosphor-icons/react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { QUESTIONS } from "../lib/quizQuestions";
import { OverallScoreChart, PerQuestionChart, type QuizStats } from "../components/QuizCharts";

export function QuizChartPage() {
  const [stats, setStats] = useState<QuizStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(false);

    supabase
      .rpc("get_quiz_stats")
      .then(({ data, error: rpcError }) => {
        if (cancelled) return;
        if (rpcError || !data) {
          setError(true);
        } else {
          setStats(data as QuizStats);
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-[100dvh] bg-ink-950 px-5 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-2xl">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-py-500 text-oncontrast">
            <ChartBar size={18} weight="bold" />
          </span>
          <span className="font-semibold tracking-tight text-ink-50">
            Python MTI <span className="text-ink-400">Unhas</span>
          </span>
        </div>

        <h1 className="mt-6 text-xl font-semibold text-ink-50">
          Statistik Quiz Asesmen Awal Python
        </h1>
        <p className="mt-1 text-sm text-ink-400">
          Ringkasan jawaban seluruh peserta yang sudah mengisi quiz.
        </p>

        <div className="mt-8">
          {!isSupabaseConfigured && (
            <p className="rounded-2xl border border-ink-800 bg-ink-900/60 p-6 text-center text-sm text-ink-400">
              Statistik belum tersedia: koneksi database belum dikonfigurasi.
            </p>
          )}
          {isSupabaseConfigured && loading && (
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-ink-800 bg-ink-900/60 p-6 text-sm text-ink-400">
              <CircleNotch size={16} weight="bold" className="animate-spin" />
              Memuat statistik...
            </div>
          )}
          {isSupabaseConfigured && !loading && error && (
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-ink-800 bg-ink-900/60 p-6 text-center text-sm text-ink-400">
              <WarningCircle size={16} weight="bold" className="text-rose-300" />
              Gagal memuat statistik. Coba muat ulang halaman.
            </div>
          )}
          {isSupabaseConfigured && !loading && !error && stats && stats.total === 0 && (
            <p className="rounded-2xl border border-ink-800 bg-ink-900/60 p-6 text-center text-sm text-ink-400">
              Belum ada peserta yang mengisi quiz.
            </p>
          )}
          {isSupabaseConfigured && !loading && !error && stats && stats.total > 0 && (
            <>
              <OverallScoreChart stats={stats} maxScore={QUESTIONS.length} />
              <PerQuestionChart questions={QUESTIONS} stats={stats} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
