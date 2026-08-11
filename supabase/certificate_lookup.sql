-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).
-- Lets the public certificate page (/cert/:nim) look up a participant's
-- name by NIM without exposing email, WhatsApp, or campus columns — the
-- anon key has no direct SELECT policy on pendaftaran_python, only this
-- function (SECURITY DEFINER) can read it, and it returns just two columns.

create or replace function public.get_certificate(p_nim text)
returns table (nama text, nim text)
language sql
security definer
set search_path = public
stable
as $$
  select nama, nim
  from public.pendaftaran_python
  where nim = p_nim
  limit 1;
$$;

grant execute on function public.get_certificate(text) to anon;
