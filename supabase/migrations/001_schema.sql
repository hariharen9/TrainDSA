-- DSA Interview Prep Tracker schema, RLS, and streak trigger.

create extension if not exists "pgcrypto";

do $$ begin
  create type public.difficulty as enum ('easy', 'medium', 'hard');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.progress_status as enum ('unattempted', 'attempted', 'solved');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.confidence_level as enum ('struggled', 'solved_with_hints', 'solved_easily');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.topics (
  id text primary key,
  title text not null,
  order_index integer not null unique,
  concept_md text not null,
  gotchas_md text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.problems (
  id text primary key,
  topic_id text not null references public.topics (id) on delete cascade,
  title text not null,
  url text not null,
  difficulty public.difficulty not null,
  order_index integer not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (topic_id, order_index)
);

create table if not exists public.progress_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  problem_id text not null references public.problems (id) on delete cascade,
  status public.progress_status not null default 'unattempted',
  confidence public.confidence_level,
  note text,
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, problem_id)
);

create table if not exists public.streak_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  activity_date date not null default current_date,
  unique (user_id, activity_date)
);

create index if not exists problems_topic_id_idx on public.problems (topic_id, order_index);
create index if not exists progress_entries_user_id_idx on public.progress_entries (user_id);
create index if not exists progress_entries_problem_id_idx on public.progress_entries (problem_id);
create index if not exists streak_logs_user_id_idx on public.streak_logs (user_id, activity_date desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists progress_entries_set_updated_at on public.progress_entries;
create trigger progress_entries_set_updated_at
before update on public.progress_entries
for each row
execute procedure public.set_updated_at();

create or replace function public.log_streak_on_progress()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status in ('attempted', 'solved') then
    insert into public.streak_logs (user_id, activity_date)
    values (new.user_id, current_date)
    on conflict (user_id, activity_date) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists progress_entries_log_streak on public.progress_entries;
create trigger progress_entries_log_streak
after insert or update of status on public.progress_entries
for each row
execute procedure public.log_streak_on_progress();

alter table public.topics enable row level security;
alter table public.problems enable row level security;
alter table public.progress_entries enable row level security;
alter table public.streak_logs enable row level security;

drop policy if exists "topics_select_all" on public.topics;
create policy "topics_select_all"
on public.topics
for select
to anon, authenticated
using (true);

drop policy if exists "problems_select_all" on public.problems;
create policy "problems_select_all"
on public.problems
for select
to anon, authenticated
using (true);

drop policy if exists "progress_select_own" on public.progress_entries;
create policy "progress_select_own"
on public.progress_entries
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "progress_insert_own" on public.progress_entries;
create policy "progress_insert_own"
on public.progress_entries
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "progress_update_own" on public.progress_entries;
create policy "progress_update_own"
on public.progress_entries
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "progress_delete_own" on public.progress_entries;
create policy "progress_delete_own"
on public.progress_entries
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "streak_select_own" on public.streak_logs;
create policy "streak_select_own"
on public.streak_logs
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "streak_insert_own" on public.streak_logs;
create policy "streak_insert_own"
on public.streak_logs
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "streak_update_own" on public.streak_logs;
create policy "streak_update_own"
on public.streak_logs
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "streak_delete_own" on public.streak_logs;
create policy "streak_delete_own"
on public.streak_logs
for delete
to authenticated
using (auth.uid() = user_id);

grant usage on schema public to anon, authenticated;
grant select on public.topics, public.problems to anon, authenticated;
grant select, insert, update, delete on public.progress_entries, public.streak_logs to authenticated;
grant usage on type public.difficulty, public.progress_status, public.confidence_level to anon, authenticated;
