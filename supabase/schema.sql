-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).

create table if not exists public.pendaftaran_python (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  email text not null,
  whatsapp text not null,
  nim text not null,
  asal_kampus text not null,
  created_at timestamptz not null default now()
);

alter table public.pendaftaran_python enable row level security;

-- Anon (public) visitors may only insert their own registration row.
-- They cannot read, update, or delete any row through the public API.
create policy "Public can register" on public.pendaftaran_python
  for insert
  to anon
  with check (true);
