-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).

create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  answers jsonb not null,
  score int not null,
  total int not null,
  created_at timestamptz not null default now()
);

alter table public.quiz_results enable row level security;

-- Anon (public) visitors may only insert their own quiz submission.
-- They cannot read, update, or delete any row through the public API —
-- aggregate stats are only exposed through get_quiz_stats() below.
create policy "Public can submit quiz results" on public.quiz_results
  for insert
  to anon
  with check (true);

-- Aggregate-only stats for the results chart: total submissions, average
-- score, the score histogram, and per-question/per-option counts. No raw
-- rows or device-identifying data are ever returned.
create or replace function public.get_quiz_stats()
returns json
language sql
security definer
set search_path = public
stable
as $$
  select json_build_object(
    'total', (select count(*) from public.quiz_results),
    'avg_score', (select coalesce(round(avg(score)::numeric, 2), 0) from public.quiz_results),
    'score_distribution', (
      select coalesce(json_agg(json_build_object('score', score, 'count', cnt) order by score), '[]'::json)
      from (
        select score, count(*) as cnt
        from public.quiz_results
        group by score
      ) s
    ),
    'option_counts', (
      select coalesce(json_agg(json_build_object('question_index', qi, 'option_index', oi, 'count', cnt) order by qi, oi), '[]'::json)
      from (
        select
          (elem.idx - 1) as qi,
          (elem.value #>> '{}')::int as oi,
          count(*) as cnt
        from public.quiz_results r,
             jsonb_array_elements(r.answers) with ordinality as elem(value, idx)
        group by 1, 2
      ) o
    )
  );
$$;

grant execute on function public.get_quiz_stats() to anon;
