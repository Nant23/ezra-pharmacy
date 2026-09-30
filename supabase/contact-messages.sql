-- Run in the Supabase SQL Editor to enable the Contact form inbox.
create extension if not exists "uuid-ossp";

create table if not exists public.contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) <= 254),
  phone text not null check (char_length(phone) between 7 and 40),
  subject text not null check (char_length(subject) between 1 and 120),
  message text not null check (char_length(message) between 20 and 5000),
  status text not null default 'new' check (status in ('new', 'read', 'resolved')),
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

drop policy if exists "Anyone can submit contact messages" on public.contact_messages;
create policy "Anyone can submit contact messages" on public.contact_messages
  for insert with check (true);

drop policy if exists "Admins can view contact messages" on public.contact_messages;
create policy "Admins can view contact messages" on public.contact_messages
  for select using (public.is_admin());

drop policy if exists "Admins can update contact messages" on public.contact_messages;
create policy "Admins can update contact messages" on public.contact_messages
  for update using (public.is_admin()) with check (public.is_admin());

notify pgrst, 'reload schema';
