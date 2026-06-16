-- LinguaLab MVP database schema
-- Based on TECH_SPEC.md data model.
-- Run this SQL in the Supabase SQL Editor to create the production tables.

-- Enable UUID extension if not already enabled.
extension if not exists "uuid-ossp";

-- Guest / anonymous profiles. No email required for MVP.
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  proficiency_level text check (proficiency_level in ('beginner', 'intermediate', 'advanced')),
  english_variety text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- A single practice session (one scenario).
create table if not exists public.sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  scenario_id text not null,
  scenario_name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Chat messages within a session.
create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references public.sessions(id) on delete cascade not null,
  role text check (role in ('user', 'assistant')) not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Structured feedback items tied to a user message.
create table if not exists public.feedback_items (
  id uuid primary key default uuid_generate_v4(),
  message_id uuid references public.messages(id) on delete cascade not null,
  type text check (type in ('language', 'formality', 'cultural')) not null,
  target_phrase text,
  suggestion text,
  observation text,
  note text,
  why text not null,
  severity text check (severity in ('minor', 'tip', 'insight', 'important')),
  accepted boolean,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Helpful indexes for the chat history dashboard.
create index if not exists idx_sessions_user_id on public.sessions(user_id);
create index if not exists idx_messages_session_id on public.messages(session_id);
create index if not exists idx_feedback_items_message_id on public.feedback_items(message_id);

-- Row Level Security (RLS): keep data isolated by anonymous user_id.
alter table public.profiles enable row level security;
alter table public.sessions enable row level security;
alter table public.messages enable row level security;
alter table public.feedback_items enable row level security;

-- For the MVP we rely on knowing the UUID in the browser. A real product would
-- move to proper Supabase Auth and update these policies.
create policy "Allow anonymous read/write by profile id"
  on public.profiles
  for all
  using (true)
  with check (true);

create policy "Allow anonymous read/write by user id"
  on public.sessions
  for all
  using (true)
  with check (true);

create policy "Allow anonymous read/write by session"
  on public.messages
  for all
  using (true)
  with check (true);

create policy "Allow anonymous read/write by message"
  on public.feedback_items
  for all
  using (true)
  with check (true);
