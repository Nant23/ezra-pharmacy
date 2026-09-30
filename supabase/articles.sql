-- Run in the Supabase SQL Editor to enable health-tip publishing and image uploads.
create table if not exists public.articles (
  id text primary key,
  title text not null,
  excerpt text not null,
  content text not null,
  image text not null,
  category text not null,
  author text not null,
  date date not null default current_date,
  read_time text not null,
  tags text[] default '{}',
  created_at timestamptz default now()
);

alter table public.articles enable row level security;

drop policy if exists "Anyone can read articles" on public.articles;
create policy "Anyone can read articles" on public.articles
  for select using (true);

drop policy if exists "Admins can manage articles" on public.articles;
create policy "Admins can manage articles" on public.articles
  for all using (public.is_admin());

insert into storage.buckets (id, name, public)
values ('articles', 'articles', true)
on conflict (id) do nothing;

drop policy if exists "Anyone can view article images" on storage.objects;
create policy "Anyone can view article images" on storage.objects
  for select using (bucket_id = 'articles');

drop policy if exists "Admins can upload article images" on storage.objects;
create policy "Admins can upload article images" on storage.objects
  for insert with check (bucket_id = 'articles' and public.is_admin());
