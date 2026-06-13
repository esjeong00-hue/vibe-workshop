create table if not exists public.signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null unique,
  department text not null,
  position text not null,
  ai_experience text not null,
  learning_goal text not null,
  dietary_restrictions text
);

alter table public.signups enable row level security;

create policy "anon can insert signups"
  on public.signups
  for insert
  to anon
  with check (true);

create policy "anon can select signups"
  on public.signups
  for select
  to anon
  using (true);
